import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getConfig from "next/config";

import { TabView, TabPanel } from "primereact/tabview";

import CustomMessages from "../components/custom-messages";

import UserDetails from "../components/user-details";
import UserInvites from "../components/user-nvites";
import { isEmpty } from "../helpers/common";

const { publicRuntimeConfig } = getConfig();
const apiBaseUrl = `${publicRuntimeConfig.apiUrl}/v1`;

export default function MMTUserDetails({ user, userConfig, userInvites }) {
  const [userInvitesLists, setUserInvitesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showAcceptances, setShowAcceptances] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserInvitesList(userInvites?.data);
  }, [userInvites]);

  // invites/<user_id>?page=1&limit=50&tag_name=accepted
  const fetchAcceptedInvites = async (accepted) => {
    const queryString = !isEmpty(accepted)
      ? `${user?.user_id}?page=1&limit=50&tag_name=${accepted}`
      : `${user?.user_id}`;

    const response = await fetch(`${apiBaseUrl}/mmt/invites/${queryString}`);
    const acceptedInvites = await response.json();

    return acceptedInvites.data;
  };

  const handleOnlyShowAcceptedInvites = async (event) => {
    setIsLoading(true);
    setShowAcceptances(event.checked);
    if (event.checked) {
      setUserInvitesList(await fetchAcceptedInvites("accepted"));
    } else {
      setUserInvitesList(await fetchAcceptedInvites(""));
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="grid">
        <div className="md:col-12 lg:col-offset-2 lg:col-8">
          <div className="card">
            <h5>
              Welcome, {user?.first_name} {user?.last_name}!
            </h5>
            <TabView className="tabview-header-icon">
              <TabPanel header="Account" leftIcon="pi pi-user">
                <UserDetails userDetails={user} />
              </TabPanel>

              <TabPanel header="Config" leftIcon="pi pi-cog">
                <CustomMessages responseData={{ userConfig, user }} />
              </TabPanel>

              <TabPanel header="Invites" leftIcon="pi pi-users">
                <UserInvites
                  invites={userInvitesLists}
                  handleOnlyShowAcceptedInvites={handleOnlyShowAcceptedInvites}
                  setShowAcceptances={setShowAcceptances}
                  showAcceptances={showAcceptances}
                  isLoading={isLoading}
                />
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx;

  let user = null;
  let userConfig = null;
  let userInvites = null;

  try {
    const mmtURI = `https://api.mymosttrusted.net/v1/network/41/users?page=1&limit=50&activation_id=${query?.activation_id}`;

    const mmtRecordExists = await fetch(mmtURI, {
      headers: {
        Authorization: `Bearer ${process.env.MMT_API_KEY}`,
      },
    });

    user = await mmtRecordExists.json();

    const mmt2ConfigURI = `https://api.mymosttrusted.net/v1/network/41/config/${user.data[0]?.user_id}`;

    const response = await fetch(mmt2ConfigURI, {
      headers: {
        Authorization: `Bearer ${process.env.MMT_API_KEY}`,
      },
    });

    userConfig = await response.json();

    const mmtInvitesURI = `https://api.mymosttrusted.net/v1/network/41/invites/${user.data[0]?.user_id}`;
    const invitesResponse = await fetch(mmtInvitesURI, {
      headers: {
        Authorization: `Bearer ${process.env.MMT_API_KEY}`,
      },
    });

    userInvites = await invitesResponse.json();
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      user: user?.data[0],
      userConfig,
      userInvites,
    },
  };
};

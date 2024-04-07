import React, { useEffect, useRef, useState } from "react";

import { BreadCrumb } from "primereact/breadcrumb";
import { TabPanel, TabView } from "primereact/tabview";

import CustomMessages from "../components/custom-messages";

import Image from "next/image";
import UserDetails from "../components/user-details";
import UserInvites from "../components/user-invites";
import { useUserContext } from "../contexts/user-provider";
import { isEmpty } from "../helpers/common";
import { myLS } from "../utils/ls";

export const truncateAPIKEY = (str, n) =>
  str?.length > n
    ? str?.substr(0, n - 25) +
      "*****-*****-*****-*****-*****-*****-*****-" +
      str?.slice(str?.length - 6, str?.length - 1)
    : str?.length >= 5 && str?.length <= n
    ? str?.slice(0, 1) + " ***"
    : str;

export default function MMTUserDetails({ user, userConfig, userInvites }) {
  const { setCrmAPIText } = useUserContext();
  const [showEnterAPIKeyModal, setShowEnterAPIKeyModal] = useState(false);

  useEffect(() => {
    const crmapi = myLS.getItem("_seerem_k");

    if (crmapi) {
      if (crmapi.email === user?.activation_id) {
        setCrmAPIText(crmapi[user?.activation_id]);
      }
    }
  }, [setCrmAPIText]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeCRMAPI = (e) => {
    setCrmAPIText(e.target.value);

    myLS.setItem("_seerem_k", {
      [user?.activation_id]: e.target.value,
      email: user?.activation_id,
    });
  };

  const openLinkedin = useRef(null);
  const items = [{ label: "User Details" }];
  const home = { icon: "pi pi-home", url: "/" };

  const [userInvitesLists, setUserInvitesList] = useState([]);
  const [isFetchingInvitesLoadingState, setIsFetchingInvitesLoadingState] =
    useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [showAcceptances, setShowAcceptances] = useState(false);

  useEffect(() => {
    setUserInvitesList(userInvites?.data);
    setIsFetchingInvitesLoadingState(false);
    setIsLoading(false);
  }, [userInvites]);

  // invites/<user_id>?page=1&limit=50&tag_name=accepted
  const fetchAcceptedInvites = async (accepted) => {
    const queryString = !isEmpty(accepted)
      ? `${user?.user_id}?page=1&limit=50&status_name=${accepted}`
      : `${user?.user_id}`;

    const response = await fetch(`api/v1/mmt/invites/${queryString}`);
    const acceptedInvites = await response.json();

    return acceptedInvites.data;
  };

  const handleRefetchInvites = async () => {
    setShowAcceptances(false);
    setIsFetchingInvitesLoadingState(true);
    const fetchInvites = await fetchAcceptedInvites("");
    setUserInvitesList(fetchInvites);
    setIsFetchingInvitesLoadingState(false);
  };

  const handleOnlyShowAcceptedInvites = async (event) => {
    setIsFetchingInvitesLoadingState(true);
    setShowAcceptances(event.checked);
    if (event.checked) {
      setUserInvitesList(await fetchAcceptedInvites("Accepted"));
    } else {
      setUserInvitesList(await fetchAcceptedInvites(""));
    }
    setIsFetchingInvitesLoadingState(false);
  };

  if (userConfig?.code || userInvites?.code)
    return (
      <div
        style={{ height: "90vh" }}
        className="flex justify-content-center align-items-center"
      >{`Error ${userConfig?.code}, ${userConfig?.message}`}</div>
    );

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="grid">
        <div className="md:col-12 lg:col-offset-1 lg:col-10">
          <BreadCrumb model={items} home={home} />
        </div>

        <div className="md:col-12 lg:col-offset-1 lg:col-10">
          <div className="card">
            <div className="flex justify-content-between align-items-center mb-2">
              <h5 style={{ margin: "1em 0px" }}>
                Welcome, {user?.first_name} {user?.last_name}!
              </h5>
            </div>

            <div style={{ position: "relative" }}>
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
                    handleOnlyShowAcceptedInvites={
                      handleOnlyShowAcceptedInvites
                    }
                    setShowAcceptances={setShowAcceptances}
                    showAcceptances={showAcceptances}
                    isLoading={isFetchingInvitesLoadingState}
                    refetchInvites={handleRefetchInvites}
                    onChangeCRMAPI={onChangeCRMAPI}
                    showEnterAPIKeyModal={showEnterAPIKeyModal}
                    setShowEnterAPIKeyModal={setShowEnterAPIKeyModal}
                  />
                </TabPanel>
              </TabView>
              <div style={{ position: "absolute", top: 0, right: 0 }}>
                <a
                  target="_blank"
                  href={user?.li_link}
                  rel="noopener noreferrer"
                  style={{ visible: "hidden" }}
                  ref={openLinkedin}
                ></a>
                <Image
                  src="/icons8-linkedin.svg"
                  alt="linkedin"
                  width={43}
                  height={43}
                  onClick={() => openLinkedin?.current.click()}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx;
  const mmtAPIBaseUri = process.env.NEXT_PUBLIC_MMT_API_BASE_URI;

  try {
    const mmtURI = `${mmtAPIBaseUri}/users?page=1&limit=50&activation_id=${query?.activation_id}`;

    const mmtRecordExists = await fetch(mmtURI, {
      headers: {
        Authorization: `Bearer ${process.env.MMT_API_KEY}`,
      },
    });

    const userData = await mmtRecordExists.json();
    // eslint-disable-next-line no-console
    console.log(
      "🚀 ~ file: [user_id].jsx:184 ~ getServerSideProps ~ userData:",
      userData
    );

    const userConfigURI = `${mmtAPIBaseUri}/config/${userData.data[0]?.user_id}`;

    const invitesURI = `${mmtAPIBaseUri}/invites/${userData.data[0]?.user_id}`;

    const [userConfigResponse, invitesResponse] = await Promise.all([
      fetch(userConfigURI, {
        headers: {
          Authorization: `Bearer ${process.env.MMT_API_KEY}`,
        },
      }),

      fetch(invitesURI, {
        headers: {
          Authorization: `Bearer ${process.env.MMT_API_KEY}`,
        },
      }),
    ]);

    const [userConfig, userInvites] = await Promise.all([
      userConfigResponse.json(),
      invitesResponse.json(),
    ]);

    return {
      props: {
        user: JSON.parse(JSON.stringify(userData?.data[0])),
        userConfig,
        userInvites,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        user: null,
        userConfig: null,
        userInvites: null,
      },
    };
  }
};

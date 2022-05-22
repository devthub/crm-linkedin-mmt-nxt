import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { TabView, TabPanel } from "primereact/tabview";

import CustomMessages from "../components/custom-messages";

import { extractCookie } from "../helpers/common";
import tradeTokenForUser from "../helpers/trade-token";
import { useUserContext } from "../contexts/user-provider";
import UserDetails from "../components/user-details";
import UserInvites from "../components/user-nvites";

export default function MMTUserDetails({ user, userConfig, userInvites }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // React.useEffect(() => {
  //   if (userData.rejected) {
  //     router.push("/");
  //   }
  // }, [userData.rejected, router]);

  // if (isLoading) return <div>Loading...</div>;

  console.log("userInvites :>> ", userInvites);

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
                <UserInvites invites={userInvites} />
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

  console.log("index->ssr->query :>> ", query);

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

  console.log("user?.data :>> ", user?.data);

  return {
    props: {
      user: user?.data[0],
      userConfig,
      userInvites,
    },
  };
};

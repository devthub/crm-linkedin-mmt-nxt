import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { TabView, TabPanel } from "primereact/tabview";

import CustomMessages from "../components/custom-messages";

import { extractCookie } from "../helpers/common";
import tradeTokenForUser from "../helpers/trade-token";

export default function MMTUserDetails({ userData, userConfig }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  console.log("userConfig :>> ", userConfig);
  console.log("-[user_id]->>userData :>> ", userData);

  useEffect(() => {
    if (userData.rejected) {
      router.push("/");
    }
    setIsLoading(false);
  }, [router, userData]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="grid">
        <div className="md:col-12 lg:col-offset-1 lg:col-10">
          <div className="card">
            <h5>
              Welcome, {userData?.user?.first_name} {userData?.user?.last_name}!
            </h5>
            <TabView className="tabview-header-icon">
              <TabPanel header="Account" leftIcon="pi pi-cog">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
                <CustomMessages responseData={userConfig} />
              </TabPanel>
              <TabPanel header="Invites" leftIcon="pi pi-users">
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem
                  quia voluptas sit aspernatur aut odit aut fugit, sed quia
                  consequuntur magni dolores eos qui ratione voluptatem sequi
                  nesciunt. Consectetur, adipisci velit, sed quia non numquam
                  eius modi.
                </p>
              </TabPanel>
              <TabPanel header="Acceptances" leftIcon="pi pi-users">
                <p>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint occaecati cupiditate
                  non provident, similique sunt in culpa qui officia deserunt
                  mollitia animi, id est laborum et dolorum fuga. Et harum
                  quidem rerum facilis est et expedita distinctio. Nam libero
                  tempore, cum soluta nobis est eligendi optio cumque nihil
                  impedit quo minus.
                </p>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const { req, query } = ctx;
  const cookies = req.headers?.cookie?.split("; ");
  const token = extractCookie(cookies, "mmt-crm");
  console.log("index->ssr->query :>> ", query);

  const user = await tradeTokenForUser(token);
  console.log("index->ssr->user.user?.user_id :>> ", user.user?.user_id);
  let userConfig = null;

  if (query?.user_id !== user.user?.user_id) {
    return {
      props: {
        userData: { rejected: true, user: null },
        userConfig,
      },
    };
  }

  if (user.success) {
    const mmt2ConfigURI = `https://api.mymosttrusted.net/v1/network/41/config/${user.user?.user_id}`;

    const response = await fetch(mmt2ConfigURI, {
      headers: {
        Authorization: `Bearer ${process.env.MMT_API_KEY}`,
      },
    });

    userConfig = await response.json();
  }

  return {
    props: {
      userData: user,
      userConfig,
    },
  };
};

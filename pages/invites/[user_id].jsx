import React from "react";
import axios from "axios";

export default function InviteeDetails({ data }) {
  return <div>InviteeDetails</div>;
}

// export async function getStaticProps(context) {
//   const { params } = context;
//   const { data } = await axios(
//     `https://crm-linkedin-mmt-nxt.vercel.app/api/v1/invites?user_id=${params?.user_id}`
//   );
//   return {
//     props: {
//       data,
//     },
//   };
// }

// export async function getStaticPaths() {
//   const {
//     data: { data: invites },
//   } = await axios("https://crm-linkedin-mmt-nxt.vercel.app/api/v1/invites");

//   const paths = invites?.map((invite) => {
//     return {
//       params: {
//         user_id: invite?.li_user_id,
//       },
//     };
//   });

//   return {
//     paths,
//     fallback: true, //false or "blocking" // See the "fallback" section below
//   };
// }

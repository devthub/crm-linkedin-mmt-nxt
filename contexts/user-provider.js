import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userConfig, setUserConfig] = useState(null);
  const [userData, setUserData] = useState(null);
  const [invites, setInvites] = useState([]);
  const [crmAPIText, setCrmAPIText] = useState("");

  const [cookie, setCookie] = useState("");

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const cookieMap = {};
    cookies.forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookieMap[name] = value;
    });
    setCookie(cookieMap["ghl-crm"]);
    setCrmAPIText(cookieMap["ghl-crm"]);
  }, []);

  return (
    <UserContext.Provider
      value={{
        text: "hello",
        userConfig,
        setUserConfig,
        invites,
        setInvites,
        userData,
        setUserData,
        crmAPIText,
        setCrmAPIText,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}

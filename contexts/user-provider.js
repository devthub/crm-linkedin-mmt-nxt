import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userConfig, setUserConfig] = useState(null);
  const [userData, setUserData] = useState(null);
  const [invites, setInvites] = useState([]);
  const [crmAPIText, setCrmAPIText] = useState("");

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

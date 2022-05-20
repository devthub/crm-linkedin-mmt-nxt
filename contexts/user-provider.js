import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userConfig, setUserConfig] = useState(null);
  const [userData, setUserData] = useState(null);
  const [invites, setInvites] = useState([]);

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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}

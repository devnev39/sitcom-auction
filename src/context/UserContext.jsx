import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [appUser, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ appUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

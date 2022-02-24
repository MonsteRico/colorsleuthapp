// Create the UserContext
import React from "react";
const UserContext = React.createContext({ id: "", username: "", score: 0 });
export const UserProvider = UserContext.Provider;
export default UserContext;

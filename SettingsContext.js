// Create the SettingsContext
import React from "react";
const SettingsContext = React.createContext("If this is being read, something went wrong");
export const SettingsProvider = SettingsContext.Provider;
export default SettingsContext;

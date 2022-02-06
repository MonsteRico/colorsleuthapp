// Create the ThemeContext
import React from "react";
const ThemeContext = React.createContext("dark");
export const ThemeProvider = ThemeContext.Provider;
export default ThemeContext;

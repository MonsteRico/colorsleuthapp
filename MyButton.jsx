import { StatusBar } from "expo-status-bar";
import React, { useState, setState, useReducer, useContext } from "react";
import { StyleSheet, Text, View, SafeAreaView, Dimensions, Button, Pressable, Switch, } from "react-native";
import Square from "./Square";
import { pSBC, hexToRgb, rgbToHex } from "./utils.js";
import ThemeContext from "./ThemeContext";
import { darkBGColor, darkTextColor, lightBGColor, lightTextColor } from "./colors";
const MyButton = ({ onPress, text, }) => {
    let { theme, toggleTheme } = useContext(ThemeContext);
    let darkMode = theme === "dark";

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: darkMode ? darkBGColor : lightBGColor,
            alignItems: "center",
            justifyContent: "center",
        },
        button: {
            backgroundColor: darkMode ? lightBGColor : darkBGColor,
            color: darkMode ? darkTextColor : lightTextColor,
            padding: 10,
            margin: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: darkMode ? lightBGColor : darkBGColor,
        },
        buttonText: {
            color: darkMode ? lightTextColor : darkTextColor,
            fontSize: 25
        },
        text: {
            color: darkMode ? darkTextColor : lightTextColor,
        },
    });
    return (
        <Pressable style={({ pressed }) => { return [styles.button, (pressed && { backgroundColor: pSBC((darkMode ? -0.25 : 0.1), darkMode ? lightBGColor : darkBGColor) })] }} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text></Pressable>

    )
}

export default MyButton

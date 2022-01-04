import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useState, setState, useReducer } from "react";
import { Pressable, StyleSheet, Text, View, SafeAreaView, Dimensions, Button, Switch } from "react-native";
import { ScreenStack } from "react-native-screens";
import Game from "./Game";
import MainMenu from "./MainMenu";
import MyButton from "./MyButton";
import Square from "./Square";
import { darkBGColor, darkTextColor, lightBGColor, lightTextColor } from "./colors";

import SquareRow from "./SquareRow";
import ThemeContext from "./ThemeContext";

const Settings = ({ back }) => {
    let { theme, toggleTheme } = useContext(ThemeContext);
    let darkMode = theme === "dark";
    const setIsDarkMode = (isDarkMode) => {
        toggleTheme();
        darkMode = !isDarkMode;
    }
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
        },
        header: {
            color: darkMode ? darkTextColor : lightTextColor,
            fontSize: 50,
        },
        text: {
            padding: 10,
            flex: 1,
            color: darkMode ? darkTextColor : lightTextColor,
            fontSize: 20,
            textAlign: "center",
        },
    });

    /* <View style={{ justifyContent: "center", flexDirection: "row", alignItems: "top" }}>
         <Text style={styles.text}>Example Setting</Text>
         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
             <Switch style={{ marginTop: 6, }} value={false} onValueChange={() => null} />
         </View>
     </View> */

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Settings</Text>
            <View style={{ flex: 1, justifyContent: "flex-start", marginTop: 20, flexDirection: "column", alignItems: "top" }}>
                <View style={{ justifyContent: "center", flexDirection: "row", alignItems: "top" }}>
                    <Text style={styles.text}>Dark Mode</Text>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Switch style={{ marginTop: 6, flex: 1 }} value={darkMode} onValueChange={() => setIsDarkMode(darkMode)} />
                    </View>
                </View>
            </View>
            <MyButton onPress={back} text="Back" />

        </SafeAreaView>
    )
}

export default Settings

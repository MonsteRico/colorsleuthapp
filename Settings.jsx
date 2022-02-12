import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Switch, TextInput, ScrollView } from "react-native";
import MyButton from "./MyButton";
import { darkBGColor, darkTextColor, lightBGColor, lightTextColor, lightPlaceholderTextColor, darkPlaceholderTextColor } from "./colors";
import ThemeContext from "./ThemeContext";
import SettingsContext from "./SettingsContext";

const Settings = ({ back }) => {
    let { theme, toggleTheme } = useContext(ThemeContext);
    let { settings, setSettings } = useContext(SettingsContext);

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
        settingText: {
            color: darkMode ? darkTextColor : lightTextColor,
            padding: 10
        },
        header: {
            color: darkMode ? darkTextColor : lightTextColor,
            fontSize: 50,
        },
        subHeading: {
            textAlign: "center",
            color: darkMode ? darkTextColor : lightTextColor,
            fontSize: 30,
        },
        settingName: {
            padding: 10,
            flex: 1,
            color: darkMode ? darkTextColor : lightTextColor,
            fontSize: 20,
            textAlign: "center",
        },
        settingContainer: { flex: 1, justifyContent: "center", flexDirection: "row", alignItems: "flex-start" },
        textContainer: { padding: 10, justifyContent: "center", flexDirection: "column", alignItems: "center" },

        setting: { flex: 1, justifyContent: "center", alignItems: "center" },
        switchSetting: { marginTop: 6, flex: 1 },
    });


    /*
    A generic setting container
    <View style={styles.settingContainer}>
        <Text style={styles.settingName}>Dark Mode</Text>
        <View style={styles.setting}>
            <Switch style={styles.switchSetting} value={darkMode} onValueChange={() => setIsDarkMode(darkMode)} />
        </View>
    </View>
    */

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Settings</Text>
            <View style={styles.settingContainer}>
                <Text style={styles.settingName}>Dark Mode</Text>
                <View style={styles.setting}>
                    <Switch style={styles.switchSetting} value={darkMode} onValueChange={() => setIsDarkMode(darkMode)} />
                </View>
            </View>
            <MyButton onPress={() => { back(); }} text="Back" />

        </SafeAreaView>
    )
}

export default Settings

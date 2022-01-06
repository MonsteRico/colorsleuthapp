import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useState, setState, useReducer, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, SafeAreaView, Dimensions, Button, Switch, TextInput, ScrollView } from "react-native";
import { ScreenStack } from "react-native-screens";
import Game from "./Game";
import MainMenu from "./MainMenu";
import MyButton from "./MyButton";
import Square from "./Square";
import { darkBGColor, darkTextColor, lightBGColor, lightTextColor } from "./colors";

import SquareRow from "./SquareRow";
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
        settingNameDifficulty: {
            padding: 10,
            flex: 1,
            color: darkMode ? darkTextColor : lightTextColor,
            fontSize: 12,
            textAlign: "center",
        },
        settingsContainer: { flex: 1, justifyContent: "flex-start", flexDirection: "column", },
        settingContainer: { flex: 1, justifyContent: "center", flexDirection: "row", alignItems: "flex-start" },
        textContainer: { padding: 10, justifyContent: "center", flexDirection: "column", alignItems: "center" },

        setting: { flex: 1, justifyContent: "center", alignItems: "center" },
        switchSetting: { marginTop: 6, flex: 1 },
        textInputSetting: { marginTop: 10, marginRight: 15, width: "100%", height: "100%", borderWidth: 1, }
    });

    // Difficulty settings states
    // TODO need removed once testing done
    const [zeroTen, setZeroTen] = useState({ level: settings[0].level, colorLevel: settings[0].colorLevel });
    const [tenTwenty, setTenTwenty] = useState({ level: settings[1].level, colorLevel: settings[1].colorLevel });
    const [twentyTwentyfive, setTwentyTwentyfive] = useState({ level: settings[2].level, colorLevel: settings[2].colorLevel });
    const [twentyfiveThirty, setTwentyfiveThirty] = useState({ level: settings[3].level, colorLevel: settings[3].colorLevel });
    const [thirtyForty, setThirtyForth] = useState({ level: settings[4].level, colorLevel: settings[4].colorLevel });
    const [fortyPlus, setFortyPlus] = useState({ level: settings[5].level, colorLevel: settings[5].colorLevel });

    const updateSettings = () => {
        let newSettings = [
            { level: zeroTen.level, colorLevel: zeroTen.colorLevel },
            { level: tenTwenty.level, colorLevel: tenTwenty.colorLevel },
            { level: twentyTwentyfive.level, colorLevel: twentyTwentyfive.colorLevel },
            { level: twentyfiveThirty.level, colorLevel: twentyfiveThirty.colorLevel },
            { level: thirtyForty.level, colorLevel: thirtyForty.colorLevel },
            { level: fortyPlus.level, colorLevel: fortyPlus.colorLevel },]
        setSettings(newSettings);
    }

    function validateColorLevel(colorLevel) {
        if (colorLevel <= 0) {
            return [false, "Color level must be between 0 and 100"];
        }
        if (colorLevel >= 100) {
            return [false, "Color level must be between 0 and 100"];
        }
        if (colorLevel == "" || colorLevel == NaN || colorLevel == null) {
            return [false, "Color level must be a number"];
        }
        return [true, ""];
    }

    function validateLevel(level) {
        if (level <= 0) {
            return [false, "Level must be between 0 and 100"];
        }
        if (level >= 10) {
            return [false, "Level must be between 0 and 10"];
        }
        if (level == "" || level == NaN || level == null) {
            return [false, "Level must be a number"];
        }
        return [true, ""];
    }

    /* <View style={styles.settingContainer}>
                    <Text style={styles.settingName}>Dark Mode</Text>
                    <View style={styles.setting}>
                        <Switch style={styles.switchSetting} value={darkMode} onValueChange={() => setIsDarkMode(darkMode)} />
                    </View>
                </View> */

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Settings</Text>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.settingsContainer}>
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingName}>Dark Mode</Text>
                        <View style={styles.setting}>
                            <Switch style={styles.switchSetting} value={darkMode} onValueChange={() => setIsDarkMode(darkMode)} />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.subHeading}>Difficulty Settings</Text>
                        <Text style={styles.settingText, { padding: 10 }}>If you would like to create custom levels of difficulty feel free to do so and report what you feel the best settings are. You can change the number of squares and the color level for each score bracket by tapping the text boxes below!</Text>
                        <Text style={styles.settingText, { padding: 10 }}>Num of squares refers to the number of squares in a row. So the grid ends up being X by X squares. Min 1, Max 9</Text>
                        <Text style={styles.settingText, { padding: 10 }}>Color Level refers to how much the color of the different square is changed by. Min 1, Max 99</Text>
                    </View>
                    <MyButton text="Reset to Default" onPress={() => {
                        setZeroTen({ level: 1, colorLevel: 30 });
                        setTenTwenty({ level: 2, colorLevel: 25 });
                        setTwentyTwentyfive({ level: 3, colorLevel: 20 });
                        setTwentyfiveThirty({ level: 4, colorLevel: 20 });
                        setThirtyForth({ level: 4, colorLevel: 15 });
                        setFortyPlus({ level: 4, colorLevel: 10 });
                    }} />
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingNameDifficulty}>0-10</Text>

                        <Text style={styles.settingNameDifficulty}>Num Squares</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${zeroTen.level + 1}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = zeroTen.level + 1;
                                }
                                let validate = validateLevel(parseInt(value));
                                if (validate[0]) {
                                    setZeroTen({ ...zeroTen, level: parseInt(value) - 1 });
                                } else {
                                    alert(validate[1]);
                                }

                            }} />
                        </View>
                        <Text style={styles.settingNameDifficulty}>Color Level</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${zeroTen.colorLevel}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = zeroTen.colorLevel;
                                }
                                let validate = validateColorLevel(parseInt(value));
                                if (validate[0]) {
                                    setZeroTen({ ...zeroTen, colorLevel: parseInt(value) });
                                } else {
                                    alert(validate[1]);
                                }
                            }} />
                        </View>
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingNameDifficulty}>10-20</Text>

                        <Text style={styles.settingNameDifficulty}>Num Squares</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${tenTwenty.level + 1}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = tenTwenty.level + 1;
                                }
                                let validate = validateLevel(parseInt(value));
                                if (validate[0]) {
                                    setTenTwenty({ ...tenTwenty, level: parseInt(value) - 1 });
                                } else {
                                    alert(validate[1]);
                                }

                            }} />
                        </View>
                        <Text style={styles.settingNameDifficulty}>Color Level</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${tenTwenty.colorLevel}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = tenTwenty.colorLevel;
                                }
                                let validate = validateColorLevel(parseInt(value));
                                if (validate[0]) {
                                    setTenTwenty({ ...tenTwenty, colorLevel: parseInt(value) });
                                } else {
                                    alert(validate[1]);
                                }
                            }} />
                        </View>
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingNameDifficulty}>20-25</Text>

                        <Text style={styles.settingNameDifficulty}>Num Squares</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${twentyTwentyfive.level + 1}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = twentyTwentyfive.level + 1;
                                }
                                let validate = validateLevel(parseInt(value));
                                if (validate[0]) {
                                    setTwentyTwentyfive({ ...twentyTwentyfive, level: parseInt(value) - 1 });
                                } else {
                                    alert(validate[1]);
                                }

                            }} />
                        </View>
                        <Text style={styles.settingNameDifficulty}>Color Level</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${twentyTwentyfive.colorLevel}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = twentyTwentyfive.colorLevel;
                                }
                                let validate = validateColorLevel(parseInt(value));
                                if (validate[0]) {
                                    setTwentyTwentyfive({ ...twentyTwentyfive, colorLevel: parseInt(value) });
                                } else {
                                    alert(validate[1]);
                                }
                            }} />
                        </View>
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingNameDifficulty}>25-30</Text>

                        <Text style={styles.settingNameDifficulty}>Num Squares</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${twentyfiveThirty.level + 1}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = twentyfiveThirty.level + 1;
                                }
                                let validate = validateLevel(parseInt(value));
                                if (validate[0]) {
                                    setTwentyfiveThirty({ ...twentyfiveThirty, level: parseInt(value) - 1 });
                                } else {
                                    alert(validate[1]);
                                }

                            }} />
                        </View>
                        <Text style={styles.settingNameDifficulty}>Color Level</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${twentyfiveThirty.colorLevel}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = twentyfiveThirty.colorLevel;
                                }
                                let validate = validateColorLevel(parseInt(value));
                                if (validate[0]) {
                                    setTwentyfiveThirty({ ...twentyfiveThirty, colorLevel: parseInt(value) });
                                } else {
                                    alert(validate[1]);
                                }
                            }} />
                        </View>
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingNameDifficulty}>30-40</Text>

                        <Text style={styles.settingNameDifficulty}>Num Squares</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${thirtyForty.level + 1}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = thirtyForty.level + 1;
                                }
                                let validate = validateLevel(parseInt(value));
                                if (validate[0]) {
                                    setThirtyForth({ ...thirtyForty, level: parseInt(value) - 1 });
                                } else {
                                    alert(validate[1]);
                                }

                            }} />
                        </View>
                        <Text style={styles.settingNameDifficulty}>Color Level</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${thirtyForty.colorLevel}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = thirtyForty.colorLevel;
                                }
                                let validate = validateColorLevel(parseInt(value));
                                if (validate[0]) {
                                    setThirtyForth({ ...thirtyForty, colorLevel: parseInt(value) });
                                } else {
                                    alert(validate[1]);
                                }
                            }} />
                        </View>
                    </View>
                    <View style={styles.settingContainer}>
                        <Text style={styles.settingNameDifficulty}>40-Infinity</Text>
                        <Text style={styles.settingNameDifficulty}>Num Squares</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${fortyPlus.level + 1}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = fortyPlus.level + 1;
                                }
                                let validate = validateLevel(parseInt(value));
                                if (validate[0]) {
                                    setFortyPlus({ ...fortyPlus, level: parseInt(value) - 1 });
                                } else {
                                    alert(validate[1]);
                                }

                            }} />
                        </View>
                        <Text style={styles.settingNameDifficulty}>Color Level</Text>
                        <View style={styles.setting}>
                            <TextInput keyboardType="numeric" maxLength={3} style={styles.textInputSetting} placeholder={`${fortyPlus.colorLevel}`} onChangeText={(value) => {
                                if (value === "") {
                                    value = fortyPlus.colorLevel;
                                }
                                let validate = validateColorLevel(parseInt(value));
                                if (validate[0]) {
                                    setFortyPlus({ ...fortyPlus, colorLevel: parseInt(value) });
                                } else {
                                    alert(validate[1]);
                                }
                            }} />
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.settingName}>Settings Explained</Text>
                        <Text style={styles.settingText}>
                            - From 0 to 10, the grid will be {zeroTen.level + 1}x{zeroTen.level + 1} and the color level will be {zeroTen.colorLevel}.{'\n\n'}
                            - From 10 to 20, the grid will be {tenTwenty.level + 1}x{tenTwenty.level + 1} and the color level will be {tenTwenty.colorLevel}.{'\n\n'}
                            - From 20 to 25, the grid will be {twentyTwentyfive.level + 1}x{twentyTwentyfive.level + 1} and the color level will be {twentyTwentyfive.colorLevel}.{'\n\n'}
                            - From 25 to 30, the grid will be {twentyfiveThirty.level + 1}x{twentyfiveThirty.level + 1} and the color level will be {twentyfiveThirty.colorLevel}.{'\n\n'}
                            - From 30 to 40, the grid will be {thirtyForty.level + 1}x{thirtyForty.level + 1} and the color level will be {thirtyForty.colorLevel}.{'\n\n'}
                            - From 40 to infinity, the grid will be {fortyPlus.level + 1}x{fortyPlus.level + 1} and the color level will be {fortyPlus.colorLevel}.{'\n\n'}
                        </Text>
                    </View>


                </View>
            </ScrollView>
            <MyButton onPress={() => { updateSettings(); back(); }} text="Back" />

        </SafeAreaView>
    )
}

export default Settings

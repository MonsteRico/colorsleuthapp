import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import { Platform, StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import ThemeContext from "./ThemeContext";
import { darkBGColor, darkTextColor, lightBGColor, lightTextColor } from "./colors";
import MyButton from "./MyButton";
import * as Network from "expo-network";
const MainMenu = ({ onPlay, onSettings, onHowToPlay, onLeaderboard }) => {
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
        },
        text: {
            color: darkMode ? darkTextColor : lightTextColor,
            fontSize: 50
        }, tinyLogo: {
            flex: 1, marginTop: 25, marginBottom: 10, width: 50, height: undefined, aspectRatio: 1, resizeMode: "contain",
        },
        largeLogo: {
            flex: 1, marginTop: 25, marginBottom: 10, width: 200, height: undefined, aspectRatio: 1, resizeMode: "contain",
        }
    });
    const appLogoImage = (darkMode ? require("./assets/lightLogo.png") : require("./assets/logo.png"));

    function goToLeaderboard() {
        let isConnected = null;
        Network.getNetworkStateAsync().then((state) => {
            isConnected = state.isConnected;
            console.log(state);
            if (isConnected) {
                onLeaderboard();
            } else {
                alert("You are not connected to WiFi. Please connect to WiFi to view leaderboards.");
            }
        });
    }

    return (
        <>
            <StatusBar style={darkMode ? "light" : "dark"} />
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Image
                        style={Platform.OS === "web" ? styles.largeLogo : styles.tinyLogo}
                        source={appLogoImage}
                    />
                </View>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}>
                    <Text style={styles.text}>Color Sleuth</Text>
                    <MyButton onPress={onPlay} text="Play" />
                    <MyButton onPress={onHowToPlay} text="How to Play" />
                    <MyButton onPress={onSettings} text="Settings" />
                    <MyButton onPress={goToLeaderboard} text="Leaderboard" />
                </View>
                <View style={{ flex: 2 }}></View>
            </SafeAreaView>
        </>
    )
}

export default MainMenu

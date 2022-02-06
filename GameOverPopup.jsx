import React, { useContext } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ThemeContext from './ThemeContext';
import { darkBGColor, lightBGColor } from './colors.js';
import { hexToRgb } from './utils.js';
const GameOverPopup = ({ bgColor, high, score }) => {

    const { theme } = useContext(ThemeContext)
    const darkMode = theme === "dark";

    // Choose a text color based on the background color
    function pickTextColor(color) {
        let rgb = hexToRgb(color);
        let brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 125 ? lightTextColor : darkTextColor;
    }

    const textColor = pickTextColor(bgColor);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: darkMode ? darkBGColor : lightBGColor,
            alignItems: "center",
            justifyContent: "center",
        },
        squareContainer: {
            backgroundColor: darkMode ? darkBGColor : lightBGColor,
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "column",
        },
        row: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
        },
        square: {
            flex: 1,
            margin: 1,
            backgroundColor: "#0f64fa",
        },
        textStyle: {
            margin: 10,
            textAlign: "center",
            flex: 1,
            fontSize: 40,
            color: textColor,
        },
        headerStyle: {
            flex: 1,
            marginTop: "15%",
            textAlign: "center",
            fontSize: 50,
            color: textColor,
        },
    });

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignContent: "center" }}>
            <Text style={styles.headerStyle}>GAME OVER</Text>
            <View style={{ flex: 1 }}>
                <Text style={styles.textStyle}>Score: {score}</Text>
                <Text style={styles.textStyle}>High Score: {high}</Text>
            </View>
        </SafeAreaView>
    )
}

export default GameOverPopup

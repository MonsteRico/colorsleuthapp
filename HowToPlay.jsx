import React, { useContext } from "react";
import { StyleSheet, Text, SafeAreaView } from "react-native";

import MyButton from "./MyButton";
import { darkBGColor, darkTextColor, lightBGColor, lightTextColor } from "./colors";

import ThemeContext from "./ThemeContext";
const HowToPlay = ({ back }) => {
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
		header: {
			color: darkMode ? darkTextColor : lightTextColor,
			fontSize: 50,
		},
		text: {
			padding: 20,
			color: darkMode ? darkTextColor : lightTextColor,
			fontSize: 20,
			textAlign: "justify",
		},
	});

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>How To Play</Text>
			<Text style={styles.text}>
				You will be shown a grid of squares, one of which is a slightly different color from the rest. Tap on
				the square that doesn't match the others to score points! Tapping on the wrong square will cause you to
				lose lives. Lose all your lives and it's Game Over!
			</Text>
			<MyButton onPress={back} text="Back"></MyButton>
		</SafeAreaView>
	);
};

export default HowToPlay;

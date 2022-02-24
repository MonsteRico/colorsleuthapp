import React, { useContext } from "react";
import { StyleSheet, Text, SafeAreaView } from "react-native";

import MyButton from "./MyButton";
import { darkBGColor, darkTextColor, lightBGColor, lightTextColor } from "./colors";

import ThemeContext from "./ThemeContext";
import UserContext from "./UserContext";
const Leaderboard = ({ back }) => {
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
			textAlign: "center",
		},
	});

	const { user } = useContext(UserContext)
	//console.log(user);

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Leaderboard</Text>
			<Text style={styles.text}>
				Unique Device ID: {user.id}
			</Text>
			<Text style={styles.text}>
				Name: {user.name}
			</Text>
			<Text style={styles.text}>
				Score: {user.score}
			</Text>
			<MyButton onPress={back} text="Back"></MyButton>
		</SafeAreaView>
	);
};

export default Leaderboard;

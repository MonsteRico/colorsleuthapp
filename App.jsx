import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useState, setState, useReducer } from "react";
import { Pressable, StyleSheet, Text, View, SafeAreaView, Dimensions, Button } from "react-native";
import { ScreenStack } from "react-native-screens";
import Game from "./Game";
import HowToPlay from "./HowToPlay";
import MainMenu from "./MainMenu";
import Square from "./Square";
import SquareRow from "./SquareRow";
import ThemeContext from "./ThemeContext";
import SettingsContext from "./SettingsContext";

import Settings from "./Settings";

const Stack = createNativeStackNavigator();

function MainMenuScreen({ route, navigation }) {
	return <MainMenu onHowToPlay={() => navigation.navigate("HowToPlay")} onSettings={() => navigation.navigate("Settings")} onPlay={() => navigation.navigate("Game")} />;
}

function GameScreen({ route, navigation }) {
	return <Game onGameOver={() => navigation.goBack()} />;
}

function HowToPlayScreen({ route, navigation }) {
	return <HowToPlay back={() => navigation.goBack()} />;
}

function SettingsScreen({ route, navigation }) {
	return <Settings back={() => navigation.goBack()} />;
}

export default function App() {
	const [theme, setTheme] = useState("light");
	function toggleTheme() {
		setTheme(theme === "dark" ? "light" : "dark");
	}

	const [settings, setSettings] = useState([
		{ level: 1, colorLevel: 30 },
		{ level: 2, colorLevel: 25 },
		{ level: 3, colorLevel: 20 },
		{ level: 4, colorLevel: 20 },
		{ level: 4, colorLevel: 15 },
		{ level: 4, colorLevel: 10 },]);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			<SettingsContext.Provider value={{ settings, setSettings }}>
				<NavigationContainer>
					<Stack.Navigator screenOptions={{ header: () => null, animation: "fade", gestureEnabled: false, }} initialRouteName="MainMenu">
						<Stack.Screen name="Game" component={GameScreen}></Stack.Screen>
						<Stack.Screen name="MainMenu" component={MainMenuScreen} />
						<Stack.Screen name="Settings" component={SettingsScreen} />
						<Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
					</Stack.Navigator>
				</NavigationContainer>
			</SettingsContext.Provider>
		</ThemeContext.Provider>
	);
}

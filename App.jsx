import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, } from "react";
import { Text, useColorScheme, } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Game from "./Game";
import HowToPlay from "./HowToPlay";
import MainMenu from "./MainMenu";
import ThemeContext from "./ThemeContext";
import SettingsContext from "./SettingsContext";

import Settings from "./Settings";

const Stack = createNativeStackNavigator();

// Functions to render each screen in the router
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
const storeData = async (value) => {
	try {
		await AsyncStorage.setItem('@theme', value)
	} catch (e) {
		// saving error
	}
}

const getData = async () => {
	try {
		const value = await AsyncStorage.getItem('@theme')
		return value;
	} catch (e) {
		return null;
	}
}


export default function App() {
	// Setting up the theme
	let deviceScheme = useColorScheme();
	const [theme, setTheme] = useState();
	let asyncTheme = getData().then((value) => {
		if (value) {
			storeData(value);
			setTheme(value);
		} else {
			storeData(deviceScheme);
			setTheme(deviceScheme);
		}
	});

	function toggleTheme() {
		let newTheme = theme === "light" ? "dark" : "light";
		storeData(newTheme);
		setTheme(newTheme);
	}

	// The settings for the game
	const [settings, setSettings] = useState([
		{ level: 1, colorLevel: 30 },
		{ level: 2, colorLevel: 25 },
		{ level: 3, colorLevel: 20 },
		{ level: 4, colorLevel: 20 },
		{ level: 4, colorLevel: 15 },
		{ level: 4, colorLevel: 10 },]);

	// Disable large font scaling due to the font already being pretty big
	Text.defaultProps = Text.defaultProps || {};
	Text.defaultProps.allowFontScaling = false;

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

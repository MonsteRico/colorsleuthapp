import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, } from "react";
import { Platform, Text, useColorScheme, } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Game from "./Game";
import HowToPlay from "./HowToPlay";
import MainMenu from "./MainMenu";
import ThemeContext from "./ThemeContext";
import SettingsContext from "./SettingsContext";
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Settings from "./Settings";
import Leaderboard from "./Leaderboard";
import UserContext from "./UserContext";
const Stack = createNativeStackNavigator();

// Functions to render each screen in the router
function MainMenuScreen({ route, navigation }) {
	return <MainMenu onHowToPlay={() => navigation.navigate("HowToPlay")}
		onSettings={() => navigation.navigate("Settings")}
		onPlay={() => navigation.navigate("Game")}
		onLeaderboard={() => navigation.navigate("Leaderboard")} />;
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

function LeaderboardScreen({ route, navigation }) {
	return <Leaderboard back={() => navigation.goBack()} />;
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

let userServerSet = false;
let localUserSet = false;
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

	// Get Unique ID for device
	const [uniqueID, setUniqueID] = useState(null);
	let newUser = { autoID: -1, uuid: uniqueID, username: 'NULL', score: 0 }
	if (Platform.OS === 'android' || Platform.OS === 'ios') {
		/* SecureStore.deleteItemAsync("secure_deviceid").then(() => {
			console.log("Deleted");
		}
		).catch(() => {
			console.log("Error deleting");
		}); */
		SecureStore.getItemAsync('secure_deviceid').then((value) => {
			if (value && !localUserSet) {
				userServerSet = true;
				localUserSet = true;
				setUniqueID(value);
				fetch("https://matthewgardner.dev/leaderboardPHP/index.php/leaderboard/get?uuid=" + value).then(res => res.json()).then(data => {
					if (data.length > 0) {
						newUser = { autoID: data[0].autoID, uuid: data[0].uuid, username: data[0].username, score: data[0].score };
					}
					fetch("https://matthewgardner.dev/leaderboardPHP/index.php/leaderboard/getPosition?uuid=" + value).then(res => res.json()).then(data => {
						newUser = { ...newUser, position: data };
						console.log(newUser);
						setUser(newUser);
					});
				});
			} else if (!userServerSet) {
				userServerSet = true;
				let uuid = uuidv4();
				SecureStore.setItemAsync('secure_deviceid', uuid).then(() => {
					console.log(uuid)
					fetch("https://matthewgardner.dev/leaderboardPHP/index.php/leaderboard/add?uuid=" + uuid).then(() => {
						setUniqueID(uuid);
					}).catch(err => {
						console.log(err);
					});
				});
			}
		});
	} else {
		AsyncStorage.getItem('@uniqueID').then((value) => {
			if (value) {
				setUniqueID(value);
				console.log(value);
				fetch("https://matthewgardner.dev/leaderboardPHP/leaderboard/getUser?uuid=" + value).then(res => res.json()).then(data => {
					if (data.length > 0) {
						newUser = { autoID: data[0].autoID, uuid: data[0].uuid, username: data[0].username, score: data[0].score };
					}
					setUser(newUser);
				});
			} else {
				let uuid = uuidv4();
				AsyncStorage.setItem('@uniqueID', uuid).then(() => {
					//console.log(fetchUUID)
					fetch("https://matthewgardner.dev/leaderboardPHP/leaderboard/addUser?uuid=" + uuid).then(res => res.json()).then(data => {
						console.log(data);
						setUniqueID(uuid);
					}).catch(err => {
						console.log(err);
					});
				});
			}
		});
	}
	// fetch user info here
	const [user, setUser] = useState(newUser);

	return (
		<UserContext.Provider value={{ user }}>
			<ThemeContext.Provider value={{ theme, toggleTheme }}>
				<SettingsContext.Provider value={{ settings, setSettings }}>
					<NavigationContainer>
						<Stack.Navigator screenOptions={{ header: () => null, animation: "fade", gestureEnabled: false, }} initialRouteName="MainMenu">
							<Stack.Screen name="Game" component={GameScreen}></Stack.Screen>
							<Stack.Screen name="MainMenu" component={MainMenuScreen} />
							<Stack.Screen name="Settings" component={SettingsScreen} />
							<Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
							<Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
						</Stack.Navigator>
					</NavigationContainer>
				</SettingsContext.Provider>
			</ThemeContext.Provider>
		</UserContext.Provider>
	);
}

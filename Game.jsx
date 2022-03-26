import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useContext } from "react";
import { StyleSheet, Text, View, Vibration, Modal, Platform, Share } from "react-native";
import Square from "./Square";
import { determineHeightWidth, generateColor, generateDiffColor } from "./utils.js";
import ThemeContext from "./ThemeContext";
import { darkBGColor, lightBGColor, darkTextColor, lightTextColor } from "./colors.js";
import GameOverPopup from "./GameOverPopup";
import { captureRef } from 'react-native-view-shot';
import MyButton from "./MyButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsContext from "./SettingsContext";
import { pSBC } from './utils.js';
import * as Network from "expo-network";
import UserContext from "./UserContext";

// stores the high score value input to AsyncStorage
const storeData = async (value) => {
	try {
		await AsyncStorage.setItem('@highScore', value)
	} catch (e) {
		// saving error
	}
}

// retrieves the high score value from AsyncStorage
const getData = async () => {
	try {
		const value = await AsyncStorage.getItem('@highScore')
		if (value !== null) {
			// We have data!!
			return value
		}
	} catch (e) {
		// error reading value
	}
}
let highScoreSet = false;
const Game = ({ onGameOver }) => {
	// Initialize all the state variables, using the settings values
	const { settings, setSettings } = useContext(SettingsContext);
	const [color, setColor] = useState(generateColor(darkMode));
	const [diffColor, setDiffColor] = useState(generateDiffColor(color, settings[0].colorLevel));
	const [lives, setLives] = useState(3);
	const [score, setScore] = useState(0);
	const [level, setLevel] = useState(settings[0].level);
	const [differentX, setDifferentX] = useState(Math.floor(Math.random() * (level + 1)));
	const [differentY, setDifferentY] = useState(Math.floor(Math.random() * (level + 1)));
	const [squares, setSquares] = useState(generateSquaresArray(level, differentX, differentY, color, diffColor));
	const [colorLevel, setColorLevel] = useState(settings[0].colorLevel);
	const [gameOver, setGameOver] = useState(false);
	const [highScore, setHighScore] = useState("0");

	// Check if there is a high score stored in AsyncStorage
	// if there is, set the high score state variable to the value
	getData().then(
		(value) => {
			if (value != null) {
				setHighScore(value);
				highScoreSet = true;
			}
		}
	)

	// Set theme
	const { theme } = useContext(ThemeContext);
	const { user, setUser } = useContext(UserContext);
	const darkMode = theme === "dark";

	// Generate the array of squares with the square at (diffX, diffY) being the different color
	function generateSquaresArray(curLevel, diffX, diffY, mainColor, changedColor) {
		const squaresArr = [[]];
		// We use curLevel + 1 so that the level can start at 1, but the number of squares
		// in each row can be 2, making a 2x2 grid for the starting level
		for (var i = 0; i < curLevel + 1; i++) {
			squaresArr[i] = [];
			for (var j = 0; j < curLevel + 1; j++) {
				squaresArr[i].push({
					color: mainColor,
					rowNum: i,
					colNum: j,
				});
			}
		}
		squaresArr[diffX][diffY].color = changedColor;
		return squaresArr;
	}

	// Check if the score meets the requirements to increase the difficulty
	function checkLevelUp(score) {
		if (score < 10) {
			return [settings[0].level, settings[0].colorLevel];
		} else if (score < 20) {
			return [settings[1].level, settings[1].colorLevel];
		} else if (score < 25) {
			return [settings[2].level, settings[2].colorLevel];
		} else if (score < 30) {
			return [settings[3].level, settings[3].colorLevel];
		} else if (score < 40) {
			return [settings[4].level, settings[4].colorLevel];
		} else if (score >= 40) {
			return [settings[5].level, settings[5].colorLevel];
		}
		return [0, 0];
	}

	// When the game is over, flash the square that was different on the current set
	let flashing = true;
	const flash = () => {
		if (flashing) {
			flashing = !flashing;
			let flashColor = pSBC(0.5, color);
			var newSquares = generateSquaresArray(level, differentX, differentY, color, flashColor);
			setSquares(newSquares);
		} else {
			flashing = !flashing;
			var newSquares = generateSquaresArray(level, differentX, differentY, color, diffColor);
			setSquares(newSquares);
		}
	}

	// Handles most of the game logic, is called every time the user taps a square
	function handlePress(square) {
		if (square.rowNum == differentX && square.colNum == differentY) {
			// If the user tapped the correct the square generate a new board and increase score
			generateNewBoard(true);
		} else if (lives > 0) {
			// If the user tapped the wrong square, decrease the lives and generate a new board,
			// this time without increasing score
			Vibration.vibrate(400, false);
			const newLives = lives - 1;
			setLives(newLives);
			// If the user has no lives left, the game is over
			if (newLives <= 0) {
				// Flash the square that was different
				const id = setInterval(flash, 500);
				// If the score is higher than the high score, set the high score
				var localHighScore = parseInt(highScore);
				if (score > parseInt(highScore)) {
					setHighScore(score.toString());
					localHighScore = score;
					storeData(score.toString());
					highScoreSet = false;
				}
				let isConnected = null;
				Network.getNetworkStateAsync().then((state) => {
					isConnected = state.isConnected;
					//console.log(isConnected);
					if (isConnected) {
						// If the user is connected to the internet, send the high score to the server
						let url = "https://matthewgardner.dev/leaderboardPHP/index.php/leaderboard/updateScore?uuid=" + user.uuid + "&score=" + localHighScore;
						//console.log(url);
						fetch(url).then(() => {
							setTimeout(() => {
								let newUser = { ...user };
								newUser.score = localHighScore;
								setUser(newUser);
								//console.log(newUser);
								clearInterval(id);
								setGameOver(true);
							}, 2500);
						});
					} else {
						// Cancel the flash interval and set game over to true after 3 seconds
						setTimeout(() => {
							clearInterval(id);
							setGameOver(true);
						}, 3000);
					}
				});

			} else {
				// If the user has lives left, generate a new board without increasing score
				generateNewBoard(false);
			}
		}
	}

	// Reset all the state variables to their initial values
	function reset() {
		// Setting variables and then setting the state based off those variables
		// seemed to be the best way to ensure the states were all properly set.
		// It also allowed some state variables to be based off of other state variables
		highScoreSet = false;
		var newScore = 0;
		var newLives = 3;
		var newLevelData = checkLevelUp(newScore);
		var newLevel = newLevelData[0];
		var newColorLevel = newLevelData[1];
		var newColor = generateColor(darkMode);
		var newDiffColor = generateDiffColor(newColor, newColorLevel);
		var newDiffX = 0;
		var newDiffY = 0;
		if (level < 5) {
			// pick a number between 0 and level+1
			newDiffX = Math.floor(Math.random() * (newLevel + 1));
			newDiffY = Math.floor(Math.random() * (newLevel + 1));
		} else {
			newDiffX = Math.floor(Math.random() * 5);
			newDiffY = Math.floor(Math.random() * 5);
		}
		var newSquares = generateSquaresArray(newLevel, newDiffX, newDiffY, newColor, newDiffColor);
		setScore(newScore);
		setColor(newColor);
		setLives(newLives);
		setDiffColor(newDiffColor);
		setLevel(newLevel);
		setDifferentX(newDiffX);
		setDifferentY(newDiffY);
		setColorLevel(newColorLevel);
		setSquares(newSquares);
	}

	// Generate a new board
	function generateNewBoard(correct) {
		// Increase the score if the user tapped the correct square
		// Set the state variables to their new values
		var newScore = correct ? score + 10 : score;
		var newLevelData = checkLevelUp(newScore);
		var newLevel = newLevelData[0];
		var newColorLevel = newLevelData[1];
		var newColor = generateColor(darkMode);
		var newDiffColor = generateDiffColor(newColor, newColorLevel);
		var newDiffX = 0;
		var newDiffY = 0;
		// pick a number between 0 and level+1 (the number of rows/columns)
		newDiffX = Math.floor(Math.random() * (newLevel + 1));
		newDiffY = Math.floor(Math.random() * (newLevel + 1));
		var newSquares = generateSquaresArray(newLevel, newDiffX, newDiffY, newColor, newDiffColor);
		setScore(newScore);
		setColor(newColor);
		setDiffColor(newDiffColor);
		setLevel(newLevel);
		setDifferentX(newDiffX);
		setDifferentY(newDiffY);
		setColorLevel(newColorLevel);
		setSquares(newSquares);
	}

	// The funcction used to share the users high score
	const viewRef = useRef();
	const onShare = async () => {
		try {
			// react-native-view-shot caputures component
			let uri = "";
			if (Platform.OS === "ios") {
				uri = await captureRef(viewRef, {
					format: 'png',
					quality: 0.8,
					result: "data-uri",
				});
			}

			//Platform.OS === 'ios' ? "" : ""
			let appLink = Platform.OS === 'ios' ? "https://apps.apple.com/us/app/color-sleuth/id1604077102" : "not possible";
			if (Platform.OS === "web") {
				appLink = "not possible";
			}
			if (Platform.OS != "web") {
				const result = await Share.share({
					message: `I got a score of ${score} in Color Sleuth! ` +
						`${Platform.OS === 'ios' ? "See if you can find the one I missed!" : ""} ` +
						`You can play it here: ${appLink}`,
					url: Platform.OS === 'ios' ? uri : "", subject: "Share"
				});
				if (result.action === Share.sharedAction) {
					if (result.activityType) {
						// shared with activity type of result.activityType
					} else {
						// shared
					}
				} else if (result.action === Share.dismissedAction) {
					// dismissed
				}
			} else {
				// web (although web isn't fully supported currently due to missing dependencies)
				navigator.clipboard.writeText(`I got a score of ${score} in Color Sleuth! ` +
					`You can play it here: ${appLink}`).then(function () {
						//console.log('Async: Copying to clipboard was successful!');
						alert("Text copied to clipboard!");
					}, function (err) {
						alert("ERROR COPYING TO CLIPBOARD: " + err);
					});
			}
		} catch (error) {
			alert(error.message);
		}
	};

	// All of the styling for this screen
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
			color: darkMode ? darkTextColor : lightTextColor,
		},
		headerStyle: {
			margin: 10,
			textAlign: "center",
			fontSize: 50,
			marginTop: "15%",
			color: darkMode ? darkTextColor : lightTextColor,
		},
	});

	// The components that are rendered on the screen
	return (
		<View style={styles.container}>
			<StatusBar style={darkMode ? "light" : "dark"} />
			<Modal animationType="fade"
				transparent={true}
				visible={gameOver}
				presentationStyle={'overFullScreen'}
				onRequestClose={() => {
					setGameOver(!gameOver);
				}}
			>
				<View style={{ paddingBottom: 40, flex: 1, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
					<GameOverPopup bgColor={color} high={highScore} score={score}></GameOverPopup>
					<MyButton onPress={() => { setGameOver(!gameOver); reset() }} text="Play again"></MyButton>
					<MyButton onPress={() => { setGameOver(!gameOver); onGameOver() }} text="Main Menu"></MyButton>
					<MyButton onPress={() => { onShare() }} text="Share Score"></MyButton>
				</View>
			</Modal>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={styles.headerStyle}>Color Sleuth</Text>
			</View>
			<View ref={viewRef} style={(styles.squareContainer, { width: determineHeightWidth(), height: determineHeightWidth() })}>
				{squares.map((squareRow, i) => {
					return (
						<View key={Math.random(10000)} style={styles.row}>
							{squareRow.map((square, j) => {
								return (
									<Square
										key={Math.random(10000)}
										color={square.color}
										onPress={() => {
											handlePress(square);
										}}
									/>
								);
							}, this)}
						</View>
					);
				}, this)}
			</View>
			<View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
				<Text numberOfLines={1} adjustsFontSizeToFit style={styles.textStyle}>
					Score: {score}
				</Text>
				<Text numberOfLines={1} adjustsFontSizeToFit style={styles.textStyle}>
					Lives: {lives}
				</Text>
			</View>
		</View>

	);
};

export default Game;

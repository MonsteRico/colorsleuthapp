import { StatusBar } from "expo-status-bar";
import React, { useState, setState, useReducer, useRef, useContext } from "react";
import { StyleSheet, Text, View, SafeAreaView, Vibration, Dimensions, Modal, Platform, Share } from "react-native";
import Square from "./Square";
import { pSBC, hexToRgb, rgbToHex } from "./utils.js";
import ThemeContext from "./ThemeContext";
import { darkBGColor, lightBGColor, darkTextColor, lightTextColor } from "./colors.js";
import GameOverPopup from "./GameOverPopup";
import { captureRef } from 'react-native-view-shot';
import MyButton from "./MyButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsContext from "./SettingsContext";


const storeData = async (value) => {
	try {
		await AsyncStorage.setItem('@highScore', value)
	} catch (e) {
		// saving error
	}
}

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
	getData().then(
		(value) => {
			if (value != null) {
				setHighScore(value);
				highScoreSet = true;
			}
		}
	)

	const { theme } = useContext(ThemeContext)
	const darkMode = theme === "dark";

	function generateSquaresArray(curLevel, diffX, diffY, mainColor, changedColor) {
		const squaresArr = [[]];
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

	function handlePress(square) {
		if (square.rowNum == differentX && square.colNum == differentY) {
			console.log("CORRECT!");
			generateNewBoard(true);
		} else {
			console.log("WRONG!");
			Vibration.vibrate(400, false);
			const newLives = lives - 1;
			setLives(newLives);
			if (newLives <= 0) {
				console.log("GAME OVER!");
				if (score > parseInt(highScore)) {
					setHighScore(score.toString());
					storeData(score.toString());
					highScoreSet = false;
				}
				setGameOver(true);
			} else {
				generateNewBoard(false);
			}
		}
	}

	function reset() {
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

	function generateNewBoard(correct) {
		var newScore = correct ? score + 1 : score;
		var newLevelData = checkLevelUp(newScore);
		var newLevel = newLevelData[0];
		var newColorLevel = newLevelData[1];
		var newColor = generateColor(darkMode);
		var newDiffColor = generateDiffColor(newColor, newColorLevel);
		var newDiffX = 0;
		var newDiffY = 0;
		// pick a number between 0 and level+1
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

			//Platform.OS === 'ios' ? "" : " https://youtube.com"
			// TODO replace youtube link with your own
			let appLink = Platform.OS === 'ios' ? "https://apps.apple.com/us/app/youtube-watch-listen-stream/id544007664" : "https://play.google.com/store/apps/details?id=com.youtube.watch.listen.stream";
			if (Platform.OS === "web") {
				appLink = "https://youtube.com";
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
				navigator.clipboard.writeText(`I got a score of ${score} in Color Sleuth! ` +
					`You can play it here: ${appLink}`).then(function () {
						console.log('Async: Copying to clipboard was successful!');
						alert("Text copied to clipboard!");
					}, function (err) {
						alert("ERROR COPYING TO CLIPBOARD: " + err);
					});
			}
		} catch (error) {
			alert(error.message);
		}
	};

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

function determineHeightWidth() {
	return Dimensions.get("window").width > Dimensions.get("window").height
		? Dimensions.get("window").height * 0.6
		: Dimensions.get("window").width * 0.9;
}

function generateColor(darkModeOn) {
	// generate a random color
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	if (!darkModeOn) {
		if (r + g + b > 600) {
			return generateColor(darkModeOn);
		}
	} else {
		if (r + g + b < 200) {
			return generateColor(darkModeOn);
		}
	}
	return rgbToHex(r, g, b);
}

function generateDiffColor(ogColor, level) {
	// if ogColor is light negate level
	var rgbOgColor = hexToRgb(ogColor);
	var r = rgbOgColor.r;
	var g = rgbOgColor.g;
	var b = rgbOgColor.b;
	// two out of three colors > 128

	if (r + g + b > 382) {
		return pSBC(-level / 100, ogColor);
	} else {
		return pSBC((level * 0.25) / 100, ogColor);
	}
}

export default Game;

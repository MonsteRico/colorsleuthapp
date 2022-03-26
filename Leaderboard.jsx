import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, Text, StatusBar, SafeAreaView, FlatList, View, Alert, Pressable } from "react-native";
import MyButton from "./MyButton";
import { darkBGColor, darkTextColor, lightBGColor, lightTextColor } from "./colors";
import { hexToRgb, generateColor, pSBC } from './utils.js';
import ThemeContext from "./ThemeContext";
import UserContext from "./UserContext";
import Dialog from "react-native-dialog";

function pickTextColor(color) {
	let rgb = hexToRgb(color);
	let brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
	return brightness > 125 ? lightTextColor : darkTextColor;
}


const header = (darkMode) => {
	return (
		<View style={{
			backgroundColor: darkMode ? darkBGColor : lightBGColor,
			borderBottomWidth: 2, paddingBottom: 10, borderBottomColor: darkMode ? lightBGColor : darkBGColor,
		}}>
			<Text style={{
				color: darkMode ? darkTextColor : lightTextColor,
				fontSize: 50,
			}}>Leaderboard</Text>
		</View>
	)
};

function ItemDivider(darkMode) {
	return (
		<View
			style={{
				height: 1,
				opacity: 0.5,
				width: "100%",
				backgroundColor: darkMode ? lightBGColor : darkBGColor,
			}}
		/>
	);
}

// pick a random color only when the component is first created

let highlightColor;
let textColor;

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
			backgroundColor: highlightColor,
			color: textColor,
			padding: 5,
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

	const { user, setUser } = useContext(UserContext)
	//console.log(user);

	const [selectedId, setSelectedId] = useState(null);

	const [error, setError] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [scores, setScores] = useState([]);
	const [visible, setVisible] = useState(false);
	const [inputText, setInputText] = useState("");

	const handleSubmit = () => {
		//console.log(inputText);
		handleUsernameUpdate(inputText);
		setVisible(false);
	}
	const showDialog = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		//console.log("CANCEL");
		setVisible(false);
	};




	function handleUsernameUpdate(value) {
		//console.log(value);
		let url = "https://matthewgardner.dev/leaderboardPHP/index.php/leaderboard/updateUser?uuid=" + user.uuid + "&username=" + value;
		fetch(url).then(res => res.json()).then((result) => {
			Alert.alert("Username Change", result);
			if (result == "Username was changed to " + value) {
				user.username = value;
			}
			pullData();
		}).catch(error => console.log(error));
	}

	const yourScore = () => {
		return (
			<Pressable style={({ pressed }) => { return [styles.button, (pressed && { backgroundColor: pSBC((darkMode ? -0.25 : 0.1), highlightColor) })] }} onPress={() => showDialog()}>
				<View style={{ backgroundColor: highlightColor, padding: 10, flexDirection: "column" }}>
					<Text style={{ color: textColor }}>Press here to change your display name!</Text>
					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
						<Text style={{ color: textColor, fontSize: 24 }}>{user.position}</Text>
						<Text style={{ color: textColor, fontSize: 24 }}>{(user.username == "User" ? user.username + user.autoID : user.username)}</Text>
						<Text style={{ color: textColor, fontSize: 24 }}>{user.score}</Text>
					</View>
				</View>
			</Pressable >

		)
	}

	function pullData() {
		setIsLoaded(false);
		fetch("https://matthewgardner.dev/leaderboardPHP/index.php/leaderboard/list")
			.then(res => res.json())
			.then(
				(result) => {
					for (let i = 0; i < result.length; i++) {
						result[i] = { ...result[i], position: i + 1 };
						if (result[i].uuid == user.uuid) {
							let newUser = { ...user };
							newUser.username = result[i].username;
							newUser.score = result[i].score;
							newUser.position = result[i].position;
							setUser(newUser);
						}
					}
					setIsLoaded(true);
					setScores(result);
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) => {
					setIsLoaded(true);
					setError(error);
				}
			);
	}


	// Note: the empty deps array [] means
	// this useEffect will run once
	// similar to componentDidMount()
	useEffect(() => {
		pullData();
		highlightColor = generateColor(darkMode);
		textColor = pickTextColor(highlightColor);
	}, [darkMode])

	const renderItem = ({ item }) => {
		const backgroundColor = item.uuid === user.uuid ? highlightColor : (darkMode ? darkBGColor : lightBGColor);
		const color = item.uuid === user.uuid ? textColor : (darkMode ? darkTextColor : lightTextColor);
		return (
			<View style={{
				padding: 10,
				marginVertical: 20,
				backgroundColor: backgroundColor,
				flexDirection: "row",
				justifyContent: "space-between",
			}}>
				<Text style={{ fontSize: 16, color: color }}>{item.position}</Text>
				<Text style={{
					fontSize: 16,
					color: color,
				}}>{(item.username == "User" ? item.username + item.autoID : item.username)}</Text>
				<Text style={{ alignSelf: "flex-end", fontSize: 16, color: color }}>{item.score}</Text>
			</View>
		);
	};

	if (error) {
		return (<SafeAreaView style={styles.container}>
			<Text style={styles.text}>Error: {error.message}</Text>
			<MyButton onPress={back} text="Back"></MyButton>
		</SafeAreaView>)
	} else if (!isLoaded) {
		return (<SafeAreaView style={styles.container}>
			<Text style={styles.text}>Loading...</Text>
			<MyButton onPress={back} text="Back"></MyButton>
		</SafeAreaView>)
	} else {
		return (
			<SafeAreaView style={styles.container}>
				<View style={{ flex: 1 }}>
					<FlatList style={{ marginTop: 10, paddingHorizontal: 15 }}
						data={scores}
						contentContainerStyle={{ flexGrow: 1, margin: 0 }}
						renderItem={renderItem}
						keyExtractor={(score) => score.autoID}
						extraData={selectedId}
						initialScrollIndex={user.position > 2 ? user.position - 2 : 0}
						ItemSeparatorComponent={() => ItemDivider(darkMode)}
						ListHeaderComponent={header(darkMode)}
						stickyHeaderIndices={[0]}
						onRefresh={() => { pullData() }}
						getItemLayout={(data, index) => (
							{ length: 150, offset: 150 * index, index }
						)}
						refreshing={!isLoaded}
					/>
					<View style={{ flex: 0 }}>
						{yourScore()}
					</View>
				</View>
				<MyButton onPress={back} text="Back"></MyButton>
				<Dialog.Container visible={visible}>
					<Dialog.Title>Change Display Name</Dialog.Title>
					<Dialog.Description>
						Enter what you want your new display name to be.
					</Dialog.Description>
					<Dialog.Input onChangeText={(text) => setInputText(text)} />
					<Dialog.Button label="Cancel" onPress={handleCancel} />
					<Dialog.Button label="Change" onPress={handleSubmit} />
				</Dialog.Container>
			</SafeAreaView>
		);
	}
};

export default Leaderboard;

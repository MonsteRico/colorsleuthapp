import React from "react";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { pSBC } from "./utils.js";
function Square({ color, rowNum, colNum, onPress }) {
	const styles = StyleSheet.create({
		square: {
			flex: 1,
			margin: 1,
			backgroundColor: color,
		},
	});
	return <Pressable style={({ pressed }) => { return [styles.square, (pressed && { backgroundColor: pSBC(-0.15, color) })] }} onPress={onPress}></Pressable>;
}

export default Square;

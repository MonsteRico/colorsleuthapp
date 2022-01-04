import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Pressable } from "react-native";
import Square from "./Square";
function SquareRow({
	rowNum,
	numSquares,
	colorOne,
	colorTwo,
	diffX,
	diffY,
	onPress,
}) {
	const styles = StyleSheet.create({
		row: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "space-between",
			width: "100%",
			height: "50%",
		},
	});
	const squares = [];
	for (var i = 0; i < numSquares; i++) {
		if (i == diffX && rowNum == diffY) {
			squares.push(
				<Square
					key={rowNum * i + numSquares * i}
					color={colorOne}
					rowNum={rowNum}
					colNum={i}
					onPress={onPress}
				/>
			);
		} else {
			squares.push(
				<Square
					key={rowNum * i + numSquares * i}
					rowNum={rowNum}
					color={colorTwo}
					colNum={i}
					onPress={onPress}
				/>
			);
		}
	}
	return <View style={styles.row}>{squares}</View>;
}

export default SquareRow;

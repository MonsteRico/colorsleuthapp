import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, Text, StatusBar, SafeAreaView, FlatList, View, Pressable, Button } from "react-native";
import MyButton from "./MyButton";
import { darkBGColor, darkTextColor, lightBGColor, lightTextColor } from "./colors";
import { hexToRgb, generateColor, pSBC } from './utils.js';
import ThemeContext from "./ThemeContext";
import UserContext from "./UserContext";
import Dialog from "react-native-dialog";
const InputUsernameDialog = ({ handleCancel, handleUsernameUpdate, visible }) => {
    const [inputText, setInputText] = useState("");

    const handleSubmit = () => {
        console.log(inputText);
        handleUsernameUpdate(inputText);
    }

    return (
        <Dialog.Container visible={visible}>
            <Dialog.Title>Change Display Name</Dialog.Title>
            <Dialog.Description>
                Enter what you want your new display name to be.
            </Dialog.Description>
            <Dialog.Input onChangeText={(text) => setInputText(text)} />
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button label="Change" onPress={handleSubmit} />
        </Dialog.Container>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default InputUsernameDialog;
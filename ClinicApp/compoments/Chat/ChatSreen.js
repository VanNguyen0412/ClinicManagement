import React, { useEffect, useState, useContext } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image } from "react-native";
import { MyUserContext } from "../../configs/Context";
import MyStyles from "../../styles/MyStyles";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { MyContext } from "../../App";

const ChatScreen = ({ onBack }) => {
    const {renderCallButton } = useContext(MyContext);
    const user = useContext(MyUserContext);
    const userId = user.id;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [userDetails, setUserDetails] = useState({});
    // console.info(chatId)
    const chatId = "1"; 

    useEffect(() => {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const msgs = snapshot.docs.map(async (doc) => {
                const messageData = { id: doc.id, ...doc.data() };

                if (!userDetails[messageData.senderId]) {
                    await fetchUserDetails(messageData.senderId);
                }
                return messageData;
            });
            Promise.all(msgs).then(setMessages); // Wait for all promises
        });

        return () => unsubscribe(); // Cleanup when component unmounts
    }, [chatId]);

    const fetchUserDetails = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const response = await authApi(token).get(endpoints['user'](id)); // Replace with your actual API
            const data = await response.data;
            setUserDetails((prevDetails) => ({
                ...prevDetails,
                [id]: { name: data.username, avatar: data.avatar },
            }));
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const handleSendMessage = async () => {
        setNewMessage(""); // Clear the input after sending
        if (newMessage.trim()) {
            await addDoc(collection(db, "chats", chatId, "messages"), {
                text: newMessage,
                senderId: userId,
                timestamp: new Date(),
            });
            
        }
        
    };

    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Trò chuyện</Text>
                </View>
                <TouchableOpacity onPress={() => renderCallButton()}>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            
            <FlatList
                style={{ padding: 12 }}
                data={messages}
                renderItem={({ item }) => {
                    const sender = userDetails[item.senderId] || {};
                    return (
                        
                        <View style={item.senderId === userId ? styles.myMessageContainer : styles.theirMessageContainer}>
                            {/* <Text>{item.timestamp}</Text> */}
                            {sender.avatar && (
                                <Image source={{ uri: sender.avatar }} style={styles.avatar} />
                            )}
                            <View>
                                <View style={styles.senderInfo}>
                                    <Text style={styles.senderName}>{sender.name || "Unknown"}</Text>
                                </View>
                                <View style={item.senderId === userId ? styles.myMessage : styles.theirMessage}>
                                    <Text style={styles.text}>{item.text}</Text>
                                </View>
                            </View>

                        </View>
                    );
                }}
                keyExtractor={(item) => item.id}
            />
            <View style={{ padding: 12, flexDirection: 'row' }}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Nhập tin nhắn..."
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.buttonRecord}>
                    <FontAwesome name="send" size={25} color='#835741' />
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        flex: 3,
        borderWidth: 1,
        borderColor: '#8B4513',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontFamily: 'serif',
        width: '100%',
        alignSelf: 'center'
    },
    myMessageContainer: {
        flexDirection: 'row',
        alignSelf: "flex-end",
        marginVertical: 5,
    },
    theirMessageContainer: {
        flexDirection: 'row',
        alignSelf: "flex-start",
        marginVertical: 5,
    },
    senderInfo: {
        // flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 15,
        marginRight: 5,
        // borderWidth: 1
    },
    senderName: {
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'serif',
    },
    myMessage: {
        borderWidth: 0.5,
        borderColor: '#835741',
        backgroundColor: "#e6c4a8",
        padding: 15,
        borderRadius: 5,
        marginRight: 10,
    },
    theirMessage: {
        borderWidth: 0.5,
        borderColor: '#e6c4a8',
        backgroundColor: "#ECECEC",
        padding: 15,
        borderRadius: 5,
        marginLeft: 10,
    },
    text: {
        fontFamily: 'serif',
        fontSize: 15
    },
    buttonRecord: {
        flex: 1,
        backgroundColor: '#e6c4a8',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 14,
        borderColor: '#835741',
        borderWidth: 0.5,
    },
});

export default ChatScreen;

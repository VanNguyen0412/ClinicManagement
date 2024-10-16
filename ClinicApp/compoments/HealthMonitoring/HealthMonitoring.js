import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MyStyles from "../../styles/MyStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import style from "./style";
import moment from "moment"; // For date formatting
import { Modal } from "react-native";
import { Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { MyContext } from "../../App";

const HealthMonitoring = () => {
    const {renderCallButton } = useContext(MyContext);
    const nav = useNavigation();
    const [bloodPressure, setBloodPressure] = useState({});
    const [days, setDays] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showForm) {
            initializeDays();
            loadStoredData();
        }
    }, [showForm]);

    const initializeDays = () => {
        const today = moment(); // Current day
        const newDays = [today.format("DD/MM/YYYY"), today.add(1, "days").format("DD/MM/YYYY"), today.add(1, "days").format("DD/MM/YYYY")];
        setDays(newDays);
    };

    const loadStoredData = async () => {
        try {
            const storedBP = await AsyncStorage.getItem("bloodPressure");
            if (storedBP) {
                setBloodPressure(JSON.parse(storedBP));
            }
        } catch (error) {
            console.error("Error loading data", error);
        }
    };

    const saveData = async () => {
        try {
            await AsyncStorage.setItem("bloodPressure", JSON.stringify(bloodPressure));
        } catch (error) {
            console.error("Error saving data", error);
        }
    };

    const handleInputChange = (day, field, value) => {
        setBloodPressure((prevState) => ({
            ...prevState,
            [day]: {
                ...prevState[day],
                [field]: value,
            },
        }));
        saveData(); // Save input on change
    };

    const handlePredict = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const bpData = Object.values(bloodPressure).map((bp) => [parseFloat(bp.systolic), parseFloat(bp.diastolic)]);
            const response = await authApi(token).post(endpoints["predict"], {
                blood_pressure: bpData,
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={() => nav.navigate("Home")}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Theo Dõi Sức Khỏe</Text>
                </View>
                <TouchableOpacity onPress={() => renderCallButton()}>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>

            {showForm && (
                <ScrollView style={{ padding: 12 }}>
                    {days.map((day, index) => (
                        <View key={index} >
                            <Text style={style.day}>{`Ngày ${index + 1} - ${day}`}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Nhập chỉ số tâm thu:</Text>
                                    <TextInput
                                        style={style.input}
                                        value={bloodPressure[day]?.systolic || ""}
                                        onChangeText={(text) => handleInputChange(day, "systolic", text)}
                                        keyboardType="numeric"
                                        placeholder="Nhập chỉ số ..."
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Nhập chỉ số tâm trương:</Text>
                                    <TextInput
                                        style={style.input}
                                        value={bloodPressure[day]?.diastolic || ""}
                                        onChangeText={(text) => handleInputChange(day, "diastolic", text)}
                                        keyboardType="numeric"
                                        placeholder="Nhập chỉ số ..."
                                    />
                                </View>
                            </View>
                        </View>
                    ))}

                    {days.every((day) => bloodPressure[day]?.systolic && bloodPressure[day]?.diastolic) && (
                        <TouchableOpacity style={style.button} onPress={handlePredict}>
                            <Text style={style.buttonText1}>Dự Đoán</Text>
                        </TouchableOpacity>
                    )}

                    {prediction !== null && (
                        <Text style={{ marginTop: 15, fontFamily: 'serif' }}>Prediction: {prediction === 1 ? 'Có nguy cơ huyết áp cao' : 'Huyết áp bình thường'}</Text>
                    )}

                </ScrollView>
            )}

            {!showForm && (
                <View style={style.container}>
                    <TouchableOpacity
                        style={style.plusButton}
                        onPress={() => setShowForm(true)}
                    >
                        <FontAwesome name="plus-square-o" size={50} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
            {loading && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={loading}
                >
                    <View style={MyStyles.loadingContainer}>
                        <View style={MyStyles.overlay} />
                        <View style={MyStyles.logoContainer}>
                            <Image source={{ uri: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1726585796/logo1.png' }} style={MyStyles.logo} />
                        </View>
                        <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default HealthMonitoring;

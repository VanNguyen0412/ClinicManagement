import { View, Text, Alert } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import styles from "../Patient/styles";
import { ActivityIndicator, SegmentedButtons } from "react-native-paper";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/APIs";
import moment from "moment";
import { Modal } from "react-native";
import { Image } from "react-native";

const ResultPrescription = ({ onBack }) => {
    const [value, setValue] = useState('done');
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadResult = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['result']);
            setResult(res.data);
            console.info(res.data)
        } catch (error) {
            if (error.response) {
                console.error(error)
                Alert.alert("VítalCare Clinic", "Bị lỗi thông tin!");
            } else {
                console.error("Network error", error);
                Alert.alert("VítalCare Clinic", "Có lỗi xảy ra, vui lòng thử lại sau")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadResult()
    }, [])
    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Kết Quả Khám Bệnh</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <SegmentedButtons style={styles.tabMenu}
                    value={value}
                    onValueChange={setValue}
                    buttons={[
                        {
                            value: 'done',
                            label: 'Lịch hẹn hoàn thành',
                        },
                        {
                            value: 'notyet',
                            label: 'Lịch hẹn chưa hoàn thành',
                        },

                    ]}
                />
                {value === 'done' && (
                    <ScrollView style={{marginBottom: 20}}>       
                    {result.map((result) => (
                        <View style={{flex: 1, padding: 8, marginBottom: 5}}>
                            <View style={{ flexDirection: 'row', borderWidth: 0.5, padding:5, borderRadius: 6, borderColor: '#835741' }}>
                                <Text style={{ fontFamily: 'serif', marginRight: 13, marginTop: 60, fontWeight: '700', flex:1 }}>Phiếu khám: {result.id}</Text>
                                <View style={{flex: 4}}>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif', fontSize: 17, fontWeight: '700' }}>Bác sĩ: {result.doctor.full_name}</Text>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif', fontSize: 15 }} >Mã bệnh nhân: MH{result.appointment.patient.code}</Text>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Ngày khám: {moment(result.appointment.appointment_date).format('Do MMMM, YYYY')}</Text>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Giờ khám: {moment(result.appointment.appointment_time, "HH:mm:ss.SSSSSS").format('HH:mm:ss')}</Text>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Triệu chứng: {result.symptom}</Text>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Chẩn đoán: {result.diagnosis}</Text>

                                </View>
                            </View>
                        </View>
                    ))}
                    </ScrollView>

                )}
                {value === 'notyet' && (
                    <View style={{marginBottom: 20}}>       
                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Không có dữ liệu</Text>
                    </View>

                )}
            </View>
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
            )
            }
        </>
    )
}
export default ResultPrescription;
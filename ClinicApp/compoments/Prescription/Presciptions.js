import { View, Text, TouchableOpacity, Modal, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MyStyles from "../../styles/MyStyles";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import moment from "moment";
import styles from "../Appointment/styles";
import CreatePresciption from "../Doctor/CreatePresciption";
import { MyUserContext } from "../../configs/Context";
import { MyContext } from "../../App";

const Prescription = ({ onBack, appointmentId }) => {
    const [prescription, setPrescription] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [selectedPre, setSelectedPre] = useState(null);
    const user = useContext(MyUserContext);
    const {renderCallButton } = useContext(MyContext);

    const handleView = (doctor) => {
        loadPrescriptionDetail(doctor)
        setShow(true);
    };

    const handleBack = () => {
        setShow(false);
    };

    const loadPrescriptionDetail = async (prescriptionId) => {
        setLoading(true)
        try{
            let res = await APIs.get(endpoints['prescription-detail'](prescriptionId))
            setSelectedPre(res.data)
            
        }catch(ex){
            Alert.alert("Thông báo", "Loading thông tin bác sĩ lỗi.")
        }finally{
            setLoading(false);
        }
    }

    const loadPrescription = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['prescription'](appointmentId));
            setPrescription(res.data)
            console.info(prescription)
        } catch (ex) {

        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        loadPrescription();
    }, [appointmentId]);

    if (show && selectedPre) {
        return <CreatePresciption prescription={selectedPre} onBack={handleBack} />;
    }

    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Danh Sách Kết Quả Khám</Text>
                </View>
                <TouchableOpacity onPress={() => renderCallButton()}>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 13 }}>
                {prescription.map((prescription) => (
                    <View key={prescription.id} style={styles.appointmentCard}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'serif', marginTop: 43, fontWeight: '700', flex: 1 }}>STT: {prescription.id}</Text>
                            <View style={{ flex: 4 }}>
                                <Text style={styles.patientName}>{prescription.appointment.patient.full_name}</Text>
                                <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Ngày khám: {moment(prescription.appointment.appointment_date).format('Do MMMM, YYYY')}</Text>
                                <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Giờ khám: {moment(prescription.appointment.appointment_time, "HH:mm:ss.SSSSSS").format('HH:mm:ss')}</Text>
                                <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Triệu chứng: {prescription.symptom}</Text>
                                <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Chẩn đoán: {prescription.diagnosis}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.search1}
                            onPress={() => handleView(prescription.id)}>
                            <Text style={styles.text1}>Kê Toa Thuốc</Text>
                        </TouchableOpacity>
                    </View>
                ))}
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
            )}
        </>
    )
}

export default Prescription;
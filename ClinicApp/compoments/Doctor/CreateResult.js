import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Alert } from 'react-native';
import HealthRecord from './HealthRecord.js';
import styles from './styles.js';
import { useNavigation } from '@react-navigation/native';
import CreatePresciption from './CreatePresciption.js';
import { FontAwesome } from "@expo/vector-icons";
import MyStyles from '../../styles/MyStyles.js';
import { Modal } from 'react-native';
import { Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import APIs, { authApi, endpoints } from '../../configs/APIs.js';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Prescription from '../Prescription/Presciptions.js';
import { MyContext } from '../../App.js';

const CreateResult = ({ route }) => {
    const {renderCallButton } = useContext(MyContext);
    const { appointmentId } = route.params;
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [allergy, setAllergy] = useState('');
    const [showRecords, setShowRecords] = useState(false);
    const [createPrescription, setCreatePrescription] = useState(false);
    const nav = useNavigation()

    const loadDetailAppointment = async () => {
        setLoading(true)
        try {
            let res = await APIs.get(endpoints['appointment-detail'](appointmentId));
            setDetail(res.data)
            console.info(detail)
        } catch (ex) {
            console.error(ex)
            Alert.alert("VítalCare Clinic", "Loading thông tin lịch hẹn lỗi");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadDetailAppointment()
    }, [appointmentId]);

    // 


    const handleViewRecords = () => {
        setShowRecords(true);
    };

    const handleBack = () => {
        setShowRecords(false);
    };

    const handleCreatePrescription = async () => {
        if (!symptoms || !diagnosis || !allergy){
            Alert.alert("VítalCare Clinic", "Thiếu thông tin. Hãy điền đủ thông tin yêu cầu.")
        }
        setLoading(true)
        try{
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }   
            // console.info(token);
            const fromData = new FormData();
            fromData.append('symptom', symptoms );
            fromData.append('diagnosis', diagnosis);
            fromData.append('allergy_medicines', allergy);
            // console.info(fromData)
            const response = await authApi(token).post(endpoints['appointment-result'](appointmentId), fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if(response.status === 201){
                Alert.alert("VítalCare Clinic", "Tạo kết quả thành công.");
                setCreatePrescription(true);
            }else if(response.status === 400){
                Alert.alert("VítalCare Clinic", "Đã có kết quả cho cuộc hẹn này");
                setAllergy('')
                setSymptoms('')
                setDiagnosis('')
            }
            
        }catch (error) {
            if (error.response){
                console.error(error)
                Alert.alert("VítalCare Clinic","Đã có kết quả cho cuộc hẹn này!");
            }else {
                console.error("Network error", error);
                Alert.alert("VítalCare Clinic", "Có lỗi xảy ra, vui lòng thử lại sau")
            }
        } finally {
            setLoading(false);
        }
        
    };

    const handleBackResult = () => {
        setCreatePrescription(false);
    };

    if (showRecords && detail) {
        const patientId = detail.patient.id;
        const patient = {
            name: detail.patient.full_name,
            code: detail.patient.code
        }
        return <HealthRecord patientId={patientId} patient={patient} onBack={handleBack} />;
    }

    if (createPrescription) {
        const appointment = appointmentId;
        return <Prescription appointmentId={appointment} onBack={handleBackResult} />;
    }

    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={() => nav.navigate("Appointment")}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Tạo Kết Quả Khám</Text>
                </View>
                <TouchableOpacity onPress={() => renderCallButton()}>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.subTitle}>I. Thông tin bệnh nhân</Text>
                {detail === null ?
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
                    </Modal> :
                    <>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.label}>Họ và tên:</Text>
                            <Text style={styles.name}>{detail.patient.full_name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.label}>Mã bệnh nhân:</Text>
                            <Text style={styles.name}>MH{detail.patient.code}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.label}>Ngày khám:</Text>
                            <Text style={styles.name}>{moment(detail.appointment_date).format('Do MMMM, YYYY')}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.label}>Giờ khám:</Text>
                            <Text style={styles.name}>{moment(detail.appointment_time, "HH:mm:ss.SSSSSS").format('HH:mm:ss')}</Text>
                        </View>
                    </>
                }

                <Text style={styles.subTitle}>II. Tạo Kết Quả Khám</Text>

                <Text style={styles.label}>Triệu chứng <Text style={{ color: 'red' }}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={symptoms}
                    onChangeText={setSymptoms}
                    placeholder="Nhập triệu chứng"
                />

                <Text style={styles.label}>Chẩn đoán <Text style={{ color: 'red' }}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={diagnosis}
                    onChangeText={setDiagnosis}
                    placeholder="Nhập chẩn đoán"
                />

                <Text style={styles.label}>Thuốc dị ứng <Text style={{ color: 'red' }}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={allergy}
                    onChangeText={setAllergy}
                    placeholder="Nhập thuốc dị ứng"
                />
                
                    <TouchableOpacity style={styles.buttonRecord} onPress={handleViewRecords}>
                        <Text style={styles.buttonText1}>Xem hồ sơ bệnh nhân</Text>
                    </TouchableOpacity>
                

                <TouchableOpacity style={styles.button}
                    onPress={handleCreatePrescription}>
                    <Text style={styles.buttonText1}>Xuất kết quả</Text>
                </TouchableOpacity>

            </ScrollView>
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
    );
}


export default CreateResult;
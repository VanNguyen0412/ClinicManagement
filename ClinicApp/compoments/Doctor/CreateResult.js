import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import HealthRecord from './HealthRecord.js';
import styles from './styles.js';
import { useNavigation } from '@react-navigation/native';
import CreatePresciption from './CreatePresciption.js';
import { FontAwesome } from "@expo/vector-icons";

const CreateResult = ({route}) => {
    const {patient} = route.params;
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [allergy, setAllergy] = useState('');
    const [showRecords, setShowRecords] = useState(false);
    const [createPrescription, setCreatePrescription] = useState(false);
    const nav = useNavigation()

    // Dữ liệu hồ sơ khám bệnh giả lập
    const records = [
        { date: '01/01/2024', symptoms: 'Ho', diagnosis: 'Cảm cúm', allergy: 'Không có' },
        { date: '15/01/2024', symptoms: 'Sốt', diagnosis: 'Viêm phổi', allergy: 'Penicillin' },
    ];
    

    const handleViewRecords = () => {
        setShowRecords(true);
    };

    const handleBack = () => {
        setShowRecords(false);
    };

    const handleCreatePrescription = () => {
        setCreatePrescription(true);
    };

    const handleBackResult = () => {
        setCreatePrescription(false);
    };

    if (showRecords) {
        const patientInfo = {
            name: patient,
            examDate: patient,
            examTime: patient,
        };

        return <HealthRecord records={records} patientInfo={patientInfo} onBack={handleBack} />;
    }

    if (createPrescription) {
        const patientInfo = {
            name: patient,
            examDate: '12/09/2024',
            examTime: '15:00:00',
            diagnosis: diagnosis,
            symptoms: symptoms
        };

        return <CreatePresciption patientInfo={patientInfo} onBack={handleBackResult} />;
    }
    
    return (
        <>
        <View style={styles.header1}>
                <FontAwesome name="angle-left" size={35} style={{marginTop: 25}} 
                onPress={() => nav.navigate("Appointment")
                }/>
                <Text style={styles.title}>Tạo Kết Quả Khám</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.subTitle}>I. Thông tin bệnh nhân</Text>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.label}>Họ và tên:</Text>
                    <Text style={styles.name}>{patient}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.label}>Ngày khám:</Text>
                    <Text style={styles.name}>{patient}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.label}>Giờ khám:</Text>
                    <Text style={styles.name}>{patient}</Text>
                </View>
            
                <Text style={styles.subTitle}>II. Tạo Kết Quả Khám</Text>

                <Text style={styles.label}>Triệu chứng <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={symptoms}
                    onChangeText={setSymptoms}
                    placeholder="Nhập triệu chứng"
                />

                <Text style={styles.label}>Chẩn đoán <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={diagnosis}
                    onChangeText={setDiagnosis}
                    placeholder="Nhập chẩn đoán"
                />

                <Text style={styles.label}>Thuốc dị ứng <Text style={{color: 'red'}}>*</Text>:</Text>
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
        </>
    );
}


export default CreateResult;
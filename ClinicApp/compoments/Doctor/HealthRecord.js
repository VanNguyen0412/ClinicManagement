import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import styles from './styles.js';
import MyStyles from '../../styles/MyStyles.js';
import { FontAwesome } from "@expo/vector-icons";
import moment from 'moment';
import { authApi, endpoints } from '../../configs/APIs.js';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { MyContext } from '../../App.js';


const HealthRecord = ({ patientId, onBack, patient }) => {
    const {renderCallButton } = useContext(MyContext);

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadRecords = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const res = await authApi(token).get(endpoints['patient-record'](patientId));
            setRecords(res.data)
            // console.info(records)
        } catch (ex) {
            console.error(ex)
            Alert.alert("VítalCare Clinic", "Loading thông tin hồ sơ bệnh bị lỗi")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRecords();
    }, [patientId])

    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Hồ Sơ Khám Bệnh</Text>
                </View>
                <TouchableOpacity onPress={() => renderCallButton()}>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <View style={styles.containerRecord}>
                <Text style={styles.subTitle}>I. Thông tin bệnh nhân</Text>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>Họ và tên:</Text>
                    <Text style={styles.infoText}>{patient.name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>Mã bệnh nhân:</Text>
                    <Text style={styles.infoText}>MH{patient.code}</Text>
                </View>
                {records.map((record) => (
                    <>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.infoText}>{record.patient.email}</Text>
                        </View>
                    </>
                ))}
                <Text style={styles.subTitle}>II. Hồ sơ khám bệnh</Text>
                <ScrollView>
                    {!records ? <Text style={{fontFamily: 'serif', fontSize: 16, textAlign:'center'}}>
                        Bệnh nhân <Text style={{fontWeight: 'bold'}}>{patient.name}</Text> chưa có hồ sơ khám bệnh</Text> :
                        records.map((record) => (
                            <View style={styles.recordCard} key={record.id}>
                                <Text style={styles.recordText}>
                                    Ngày khám: {moment(record.appointment_date).format('DD MMMM YYYY HH:mm:ss')}
                                </Text>
                                <Text style={styles.recordText}>Triệu chứng: {record.symptom}</Text>
                                <Text style={styles.recordText}>Chẩn đoán: {record.diagnosis}</Text>
                                <Text style={styles.recordText}>Bác sĩ: {record.doctor.full_name}</Text>
                                <Text style={styles.recordText}>Thuốc dị ứng: {record.allergy_medicines}</Text>
                            </View>
                        ))
                    }

                </ScrollView>
                <TouchableOpacity style={styles.backButtonRecord} onPress={onBack}>
                    <Text style={styles.backButtonTextRecord}>Quay lại</Text>
                </TouchableOpacity>
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
    );
};



export default HealthRecord;
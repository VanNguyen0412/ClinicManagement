import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import styles from './styles';
import { FontAwesome } from "@expo/vector-icons";
import MyStyles from '../../styles/MyStyles';
import { MyDispatchContext, MyUserContext } from '../../configs/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, endpoints } from '../../configs/APIs';
import { Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ActivityIndicator } from 'react-native-paper';
import moment from 'moment';

const Appointment = () => {
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [appointment, setAppointment] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'Chưa xác nhận.';
      case 'confirm':
        return 'Đã xác nhận.';
      case 'cancel':
        return 'Bị hủy.';
      default:
        return status;
    }
  };
  const loadAppointment = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found.");
        return;
      }
      if (user.role === 'patient') {
        let res = await authApi(token).get(endpoints['appointment-patient'])
        setAppointment(res.data)

      } else if (user.role === 'doctor') {
        let res = await authApi(token).get(endpoints['appointment-confirm']);
        setAppointment(res.data)
      

      } else if (user.role === 'nurse') {
        let res = await authApi(token).get(endpoints['appointment-pending']);
        setAppointment(res.data)
      }
    } catch (ex) {
      Alert.alert("Lịch Khám", "Loading thông tin lịch khám lỗi")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
      loadAppointment();
  }, [user.role])

  const totalPages = Math.ceil(appointment.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentAppointments = appointment.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePre = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };


  return (
    <>
      <View style={MyStyles.headerList}>
        <TouchableOpacity onPress={() => nav.navigate("HomeDoctor")}>
          <FontAwesome name="arrow-left" size={24} color="#835741" />
        </TouchableOpacity>
        <View>
          <Text style={MyStyles.titleList}>Lịch Hẹn Trong Ngày</Text>
        </View>
        <TouchableOpacity>
          <FontAwesome name="phone" size={24} color="#835741" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        
      <ScrollView>
        {currentAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontFamily: 'serif', marginRight: 13, marginTop: 43, fontWeight: '700'}}>STT: {appointment.id}</Text>
              <View>
                <Text style={styles.patientName}>{appointment.patient.full_name}</Text>
                <Text style={{ marginBottom: 5, fontFamily: 'serif', fontSize: 15 }} >Mã bệnh nhân: MH{appointment.patient.code}</Text>
                <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Ngày khám: {moment(appointment.appointment_date).format('Do MMMM, YYYY')}</Text>
                <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Giờ khám: {moment(appointment.appointment_time,  "HH:mm:ss.SSSSSS").format('HH:mm:ss')}</Text>
                <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Trạng thái: {getStatus(appointment.status)}</Text>
              </View>
            </View>
            

            <TouchableOpacity style={styles.search1}
              onPress={() => { nav.navigate("CreateResult", { 'appointmentId': appointment.id, 'patient': appointment.patient.id}) }}
            >
              <Text style={styles.text1}>
                {user.role === 'nurse' ? 'Xác nhận lịch hẹn' : 
                user.role === 'doctor' ? 'Hoàn thành phiếu khám' : 'Hủy phiếu khám'}
                </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        <Button
          title="Pre"
          fontFamily="serif"
          onPress={handlePre}
          disabled={currentPage === 0}
          color={currentPage === 0 ? '#D3D3D3' : '#8B4513'}
        />
        <Text style={styles.dots}>...</Text>
        <Button
          title="Next"
          onPress={handleNext}
          disabled={currentPage >= totalPages - 1}
          color={currentPage >= totalPages - 1 ? '#D3D3D3' : '#8B4513'}
        />
      </View>

    </View >
      { loading && (
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


export default Appointment;
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import styles from './styles';
import { FontAwesome } from "@expo/vector-icons";

const Appointment = () => {
    const nav = useNavigation();
    const [date, setDate] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 4;
  
    const appointments = [
      { id:1, patientName: 'Tên Bệnh Nhân 1', date: 'Ngày 1', time: 'Thời gian 1' },
      { id:2, patientName: 'Tên Bệnh Nhân 2', date: 'Ngày 2', time: 'Thời gian 2' },
      { id:3, patientName: 'Tên Bệnh Nhân 3', date: 'Ngày 3', time: 'Thời gian 3' },
      { id:4, patientName: 'Tên Bệnh Nhân 4', date: 'Ngày 4', time: 'Thời gian 4' },
      { id:5, patientName: 'Tên Bệnh Nhân 5', date: 'Ngày 5', time: 'Thời gian 5' },
      { id:6, patientName: 'Tên Bệnh Nhân 6', date: 'Ngày 6', time: 'Thời gian 6' },
      { id:7, patientName: 'Tên Bệnh Nhân 7', date: 'Ngày 7', time: 'Thời gian 7' },
      { id:8, patientName: 'Tên Bệnh Nhân 8', date: 'Ngày 8', time: 'Thời gian 8' },
    ];
  
    const totalPages = Math.ceil(appointments.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const currentAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);
  
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
        <View style={styles.header1}>
                <FontAwesome name="angle-left" size={35} style={{marginTop: 25}} 
                onPress={() => nav.navigate("HomeDoctor")
                }/>
                <Text style={styles.title}>Lịch Hẹn Trong Ngày</Text>
        </View>
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="dd/MM/yyyy"
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity style={styles.search}>
            <Text style={styles.text}>Tìm Kiếm</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
      {currentAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View>
            <Text style={styles.patientName}>{appointment.patientName}</Text>
            <Text style={{marginBottom:5}}>{appointment.date}</Text>
            <Text style={{marginBottom:5}}>{appointment.time}</Text>
            </View>
            <TouchableOpacity style={styles.search1}
                onPress={() => 
                  {nav.navigate("CreateResult", {'appointmentId': appointment.id, 'patient': appointment.patientName})}} 
              >
              <Text style={styles.text1}>Hoàn thành phiếu khám</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        <Button 
          title="Pre" 
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
    </View>
    </>
  );
}


export default Appointment;
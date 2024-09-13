import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles.js';

const HealthRecord = ({ records, onBack, patientInfo }) => {
    return (
        <View style={styles.containerRecord}>
            <Text style={styles.title}>Hồ Sơ Khám Bệnh</Text>
            {/* Hiển thị thông tin bệnh nhân */}
            <View style={{flexDirection:'row'}}>
                <Text style={styles.label}>Họ và tên:</Text>
                <Text style={styles.infoText}>{patientInfo.name}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.label}>Ngày khám:</Text>
                <Text style={styles.infoText}>{patientInfo.examDate}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <Text style={styles.label}>Giờ khám:</Text>
                <Text style={styles.infoText}>{patientInfo.examTime}</Text>
            </View>
            <FlatList
                data={records}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.recordCard}>
                        <Text style={styles.recordText}>Ngày khám: {item.date}</Text>
                        <Text style={styles.recordText}>Triệu chứng: {item.symptoms}</Text>
                        <Text style={styles.recordText}>Chẩn đoán: {item.diagnosis}</Text>
                        <Text style={styles.recordText}>Thuốc dị ứng: {item.allergy}</Text>
                    </View>
                )}
            />
            <TouchableOpacity style={styles.backButtonRecord} onPress={onBack}>
                <Text style={styles.backButtonTextRecord}>Quay lại</Text>
            </TouchableOpacity>
        </View>
    );
};



export default HealthRecord;
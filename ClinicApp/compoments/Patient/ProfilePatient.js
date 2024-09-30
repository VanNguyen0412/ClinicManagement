import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import { FontAwesome } from '@expo/vector-icons';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Context';
import { Modal } from 'react-native';
import { Image } from 'react-native';
import { ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import moment from 'moment';
import styles from './styles';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePatient = ({ onBack }) => {
    const [patient, setPatient] = useState({});
    const user = useContext(MyUserContext);
    const [loading, setLoading] = useState(false)
    const [health_monitoring, setHealthMonitoring] = useState([]);
    const [value, setValue] = useState('health');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [heart_rate, setHeartRate] = useState('');
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');

    const getPatient = async () => {
        setLoading(true)
        try {
            if (user && user.id) {
                let url = `${endpoints['current-patient']}?user=${user.id}`;
                const res = await APIs.get(url);
                setPatient(res.data);
            }
            // console.info(patient)
        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Bị lỗi loading.")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (user && user.id) {
            getPatient();
        }
    }, [user.id])

    const getHealth = async () => {
        setLoading(true)
        try {
            if (patient && patient.id) {

                const res = await APIs.get(endpoints['health_monitoring'](patient.id));
                setHealthMonitoring(res.data);
            }
            // console.info(health_monitoring)
        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Bị lỗi loading.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (patient && patient.id) {
            getHealth();
        }
    }, [patient.id])

    const handleUpdateDoctor = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).post(endpoints['update-doctor-HM'](patient.id))

            if (res.status === 200) {
                Alert.alert("VítalCare Clinic", "Đã cập nhập thành công.");
                getHealth()
            } else if (res.status === 400) {
                Alert.alert("VítalCare Clinic", "Bệnh nhân chưa có tạo theo dõi sức khỏe.");
                getHealth()
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        setLoading(true);
        if (!height || !weight || !heart_rate || !systolic || !diastolic) {
            Alert.alert("VítalCare Clinic", "Thiếu thông tin, vui lòng điền lại.")
        }
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const formData = new FormData()
            if (health_monitoring.length > 0) {
                formData.append('height', height)
                formData.append('weight', weight)
                formData.append('heart_rate', heart_rate)
                formData.append('blood_pressure_systolic', systolic)
                formData.append('blood_pressure_diastolic', diastolic)
                let res = await authApi(token).patch(endpoints['update-HM'](patient.id), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (res.status === 200) {
                    Alert.alert("VítalCare Clinic", "Đã cập nhật tình trạng sức khỏe thành công.");
                    getHealth()
                    setDiastolic('')
                    setHeartRate('')
                    setHeight('')
                    setSystolic('')
                    setWeight('')
                }
            } else if (health_monitoring.length === 0) {
                formData.append('height', height)
                formData.append('weight', weight)
                formData.append('heart_rate', heart_rate)
                formData.append('blood_pressure_systolic', systolic)
                formData.append('blood_pressure_diastolic', diastolic)

                let res = await authApi(token).post(endpoints['create_health_monitoring'](patient.id), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (res.status === 201) {
                    Alert.alert("VítalCare Clinic", "Đã tạo tình trạng sức khỏe thành công.");
                    getHealth()
                    setDiastolic('')
                    setHeartRate('')
                    setHeight('')
                    setSystolic('')
                    setWeight('')
                } else if (res.status === 400) {
                    Alert.alert("VítalCare Clinic", "Bệnh nhân này đã có bản ghi theo dõi sức khỏe, không thể tạo thêm.");
                }
            }

        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Hồ Sơ Đã Lưu</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.container}>
                <SegmentedButtons style={styles.tabMenu}
                    value={value}
                    onValueChange={setValue}
                    buttons={[
                        {
                            value: 'health',
                            label: 'Hồ sơ y tế',
                        },
                        {
                            value: 'doctor',
                            label: 'Bác sĩ',
                        },
                        {
                            value: 'update',
                            label: 'Cập nhập',
                        }
                    ]}
                />

                {value === 'health' && (
                    <View style={styles.infoCard}>
                        <Text style={styles.infoHeader}>Thông tin cá nhân</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.label1}>Họ và tên:</Text>
                            <Text style={styles.value}>{patient.first_name} {patient.last_name}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label1}>Mã số:</Text>
                            <Text style={styles.value}>MH{patient.code}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label1}>Giới tính:</Text>
                            <Text style={styles.value}>{patient.gender ? 'Nam' : 'Nữ'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label1}>Ngày sinh:</Text>
                            <Text style={styles.value}>{moment(patient.birthdate).format('Do MMMM, YYYY')}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label1}>Quốc tịch:</Text>
                            <Text style={styles.value}>Việt Nam</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label1}>Địa chỉ:</Text>
                            <Text style={styles.value}>{patient.address}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label1}>Số điện thoại:</Text>
                            <Text style={styles.value}>{patient.phone}</Text>
                        </View>
                        {health_monitoring.map((item) => (
                            <View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label1}>Chiều cao:</Text>
                                    <Text style={styles.value}>{item.height} cm</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label1}>Cân nặng:</Text>
                                    <Text style={styles.value}>{item.weight} kg</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label1}>BMI:</Text>
                                    <Text style={styles.value}>{((item.weight / Math.pow(item.height / 100, 2)).toFixed(1))}</Text>
                                </View>
                            </View>
                        ))}

                    </View>
                )}
                {value === 'doctor' && (
                    <View style={styles.infoCard}>
                        <Text style={styles.infoHeader1}>Danh sách bác sĩ từng khám bệnh</Text>

                        {health_monitoring.map((item) => (
                            item.doctor.map((doctor) => (
                                <View style={{ flexDirection: 'row', borderWidth: 0.5, borderColor: '#835741', padding: 3, borderRadius: 7, marginBottom: 10 }}>
                                    <Text style={{ fontFamily: 'serif', marginRight: 13, marginTop: 43, fontWeight: '700' }}>BS: {doctor.id}</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif', fontSize: 17, fontWeight: '700' }}>
                                            Tên bác sĩ: {doctor.first_name} {doctor.last_name}</Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Chuyên khoa: {doctor.expertise}</Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Có {doctor.experience_years} năm kinh nghiệm</Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Bằng cấp: {doctor.qualifications}</Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Email: {doctor.user.email}</Text>
                                    </View>
                                </View>
                            ))

                        ))}
                        <TouchableOpacity style={styles.button} onPress={handleUpdateDoctor}>
                            <Text style={styles.buttonText1}>Cập nhập</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {value === 'update' && (
                    <View style={styles.infoCard}>
                        <Text style={styles.infoHeader1}>Cập nhập</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Chiều cao <Text style={{ color: 'red' }}>*</Text>:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={height}
                                    onChangeText={setHeight}
                                    placeholder="Nhập chiều cao"
                                    keyboardType='numeric'

                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Cân nặng <Text style={{ color: 'red' }}>*</Text>:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={weight}
                                    onChangeText={setWeight}
                                    placeholder="Nhập cân nặng"
                                    keyboardType='numeric'
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Nhịp tim <Text style={{ color: 'red' }}>*</Text>:</Text>
                            <TextInput
                                style={styles.input}
                                value={heart_rate}
                                onChangeText={setHeartRate}
                                placeholder="Nhập chỉ số nhịp tim"
                                keyboardType='numeric'
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Huyết áp tâm thu <Text style={{ color: 'red' }}>*</Text>:</Text>
                            <TextInput
                                style={styles.input}
                                value={systolic}
                                onChangeText={setSystolic}
                                placeholder="Nhập chỉ số tâm thu"
                                keyboardType='numeric'
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Huyết áp tâm trương <Text style={{ color: 'red' }}>*</Text>:</Text>
                            <TextInput
                                style={styles.input}
                                value={diastolic}
                                onChangeText={setDiastolic}
                                placeholder="Nhập chỉ số tâm trương"
                                keyboardType='numeric'
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                            <Text style={styles.buttonText1}>Cập nhập</Text>
                        </TouchableOpacity>
                        <Text style={styles.bonus}>
                            Huyết áp tâm thu hay còn gọi là huyết áp tối đa, thường từ <Text style={{ fontWeight: 'bold' }}>90 đến 140 mmHg</Text>.
                            Huyết áp tâm trương hay còn gọi là huyết áp tối thiểu. Huyết áp tâm trương dao động trong khoảng từ <Text style={{ fontWeight: 'bold' }}>50 đến 90 mmHg</Text>.
                            Chỉ số huyết áp nhỏ hơn <Text style={{ fontWeight: 'bold' }}>120/80 mmHg</Text> là huyết áp tối ưu.
                        </Text>
                        <Text style={styles.bonus}>
                            Đối với người từ <Text style={{ fontWeight: 'bold' }}>18</Text> tuổi trở lên,
                            nhịp tim bình thường trong lúc nghỉ ngơi dao động trong khoảng từ <Text style={{ fontWeight: 'bold' }}>60 đến 100</Text> nhịp mỗi phút.
                        </Text>
                    </View>
                )}
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
            )}
        </>
    );
};


export default ProfilePatient;

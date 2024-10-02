import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView, ImageBackground,
     Animated, Dimensions, TouchableOpacity, 
     FlatList} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import styles from "./styles";
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from "react-native-dropdown-picker";
import { Modal } from "react-native";
import MyStyles from "../../styles/MyStyles";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const RegisterAppointment = () => {
    const nav = useNavigation();
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [appdate, setAppDate] = useState('');
    const [time, setTime] = useState('');
    const [showtime, setShowTime] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [open, setOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [doctor, setDoctor] = useState([])

    const [listDoctor, setListDoctor] = useState([])

    const loadNameDoctor = async () => {
        setLoading(true);
        try{
            let res = await APIs.get(endpoints['doctor-name'])
            const formattedDoctor = res.data.map(doc => ({ label: doc.full_name, value: doc.id }));
            setListDoctor(formattedDoctor)
        }catch(ex){
            console.error(ex)
        }finally{
            setLoading(false)        
        }
    }
    useEffect(() => {
        loadNameDoctor();
    }, [])

    const loadDoctor = async () => {
        setLoading(true)
        try{
            let res = await APIs.get(endpoints['doctor'])
            setDoctor(res.data);
            // console.info(selectedSpecialty)
        }catch(ex){
            Alert.alert("VítalCare Clinic", "Bị lỗi khi loading thuốc.")
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=> {
        loadDoctor();
    }, []);

    const handleDetails = () => {
        const doctorDetails = doctor.find(doc => doc.id === dropdownValue);
        setSelectedDoctor(doctorDetails);
        setModalVisible(true);
        
    };


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        const formattedDate = 
        `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        setAppDate(formattedDate); // Định dạng dd/MM/yyyy
      };

    const onChangeTime = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowTime(false);
        // setDate(currentDate);
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        setTime(`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`); // Định dạng HH:mm
        };

    const registerAppointment = async () => {
        if (!appdate || !time || !dropdownValue){
            Alert.alert("VítalCare Clinic", "Bạn nhập thiếu thông tin!");
        }
        setLoading(true);
        try{
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }   
            // console.info(token);
            const fromData = new FormData();
            fromData.append('appointment_date', appdate );
            fromData.append('appointment_time', time);
            fromData.append('doctor', dropdownValue);
            // console.info(fromData)
            const response = await authApi(token).post(endpoints['create-appointment'], fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if(response.status === 201){
                Alert.alert("VítalCare Clinic", "Tạo lịch hẹn thành công. Hãy đợi xét duyệt thông qua email.");
                setAppDate("")
                setTime("")
                setDropdownValue(null)
            }
            
        }catch (error) {
            if (error.response){
                console.error(error)
                Alert.alert("VítalCare Clinic","Bạn nhập thiếu thông tin!");
            }else {
                console.error("Network error", error);
                Alert.alert("VítalCare Clinic", "Có lỗi xảy ra, vui lòng thử lại sau")
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
        <View style={MyStyles.headerList}>
            <TouchableOpacity onPress={() => nav.navigate("Home")}>
            <FontAwesome name="arrow-left" size={24} color="#835741" />
            </TouchableOpacity>
            <View>
            <Text style={MyStyles.titleList}>Đăng Ký Lịch Khám</Text>
            </View>
            <TouchableOpacity>
            <FontAwesome name="phone" size={24} color="#835741" />
            </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.addMedicineContainer}>
            <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
            <DropDownPicker
                key={listDoctor.id}
                items={listDoctor}
                open={open}
                placeholder="Chọn bác sĩ"
                setOpen={setOpen}
                setValue={setDropdownValue}
                setItems={setListDoctor}
                containerStyle={{ marginBottom: 10, height: 40, width:'90%'}}
                // onChangeItem={(item) => setDropdownValue(item.value)}
                value={dropdownValue}
                style={styles.dropdownContainer}
            />
            <TouchableOpacity 
                onPress={handleDetails}
                style={styles.iconContainer}
                disabled={!dropdownValue}
            >
                <FontAwesome name="info-circle" size={24} color={dropdownValue ? "#835741" : "#ccc"} />
            </TouchableOpacity>
            </View>
            </View>
            <View style={{flex: 1}}>
            <Text style={styles.label}>Ngày Khám <Text style={{color: 'red'}}>*</Text>:</Text>
            <View style={styles.fieldTextinput}>
                <TextInput
                    style={styles.inputDate}
                    value={appdate}
                    placeholder="dd/MM/yyyy"
                    onFocus={() => setShow(true)}
                    editable={false} // Không cho phép chỉnh sửa trực tiếp
                />
                <TouchableOpacity onPress={() => setShow(true)}>
                    <FontAwesome name='calendar's size={20} color="#835741" />
                </TouchableOpacity>
                </View>
                {show && (
                    <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    />
                )}
            </View>
            <View style={{flex: 1}}>
            <Text style={styles.label}>Giờ Khám <Text style={{color: 'red'}}>*</Text>:</Text>
            <View style={styles.fieldTextinput}>
                <TextInput
                    style={styles.inputDate}
                    value={time}
                    placeholder="HH:mm"
                    onFocus={() => setShowTime(true)}
                    editable={false} // Không cho phép chỉnh sửa trực tiếp
                />
                <TouchableOpacity onPress={() => setShowTime(true)}>
                    <FontAwesome name='clock-o' size={20} color="#835741" />
                </TouchableOpacity>
                </View>
                {showtime && (
                    <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    onChange={onChangeTime}
                    />
                )}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                    <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    {selectedDoctor && (
                        <>
                            <Text style={styles.modalTitle}>{`${selectedDoctor.first_name} ${selectedDoctor.last_name}`}</Text>
                            <Text style={styles.modalText}>Chuyên môn: {selectedDoctor.expertise}</Text>
                            <Text style={styles.modalText}>Bằng cấp: {selectedDoctor.qualifications}</Text>
                            <Text style={styles.modalText}>Kinh nghiệm: {selectedDoctor.experience_years} năm</Text>
                            <Text style={styles.modalText}>Chức vụ: {selectedDoctor.position}</Text>
                        </>
                    )}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={registerAppointment}>
                <Text style={styles.closeButtonText}>Đăng Ký</Text>
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
                            <Image source={{uri: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1726585796/logo1.png'}} style={MyStyles.logo} />
                        </View>
                        <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                </Modal>
            )}
        </>
    )
}
export default RegisterAppointment;
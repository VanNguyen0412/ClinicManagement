import { FontAwesome } from "@expo/vector-icons";
import { View, Text, TextInput, Alert } from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useEffect, useReducer, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import MyStyles from "../../styles/MyStyles";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal } from "react-native";
import { Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { MyUserContext } from "../../configs/Context";


const CreatePatient = () => {
    const nav = useNavigation()
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState(null);
    const [phone, setPhone] = useState('');
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const user = useReducer(MyUserContext)
    const [patient, setPatient] = useState([]);

    const getPatient = async () => {
        try{
            let url = `${endpoints['current-patient']}?user=${user.id}`;
            const res = await APIs.get(url)
            setPatient(res.data)
        }catch(ex){
            Alert.alert("Trang chủ", "Bị lỗi loading.")
        }
    }

    useEffect(()=>{
        getPatient();
    },[user])

    const handleDone = async () => {
        if (!first_name || !last_name || !birthdate || !address ||!gender || !phone){
            Alert.alert("Thông báo", "Thiếu thông tin. Hãy điền đủ thông tin yêu cầu.")
        }
        setLoading(true);

        try{  
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }     
            const fromData = new FormData();
            fromData.append('first_name', first_name);
            fromData.append('last_name', last_name);
            fromData.append('birthdate', birthdate);
            fromData.append('address', address);
            fromData.append('gender', gender);
            fromData.append('phone', phone);

            const response = await authApi(token).post(endpoints['create-patient'], fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status === 201){
                Alert.alert("Hồ Sơ Cá Nhân", "Đã hoàn tất hồ sơ cá nhân.");
                nav.navigate("Home");
            }
        } catch (error) {
            if (error.response){
                console.error("Error response:", error.response);
                Alert.alert("Hồ Sơ Cá Nhân","Đã có lỗi, hãy thử lại!");
            }else {
                console.error("Network error", error);
                Alert.alert("Hồ Sơ Cá Nhân", "Có lỗi xảy ra, vui lòng thử lại sau")
            }
        } finally {
            setLoading(false);
        }
    }
    
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        const formattedDate = 
        `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        setBirthdate(formattedDate); // Định dạng dd/MM/yyyy
      };

    return (
        <>
        <View style={MyStyles.headerList}>
        <TouchableOpacity onPress={() => nav.navigate("Home")}>
            <FontAwesome name="arrow-left" size={24} color="#835741" />
        </TouchableOpacity>
        <View>
            <Text style={MyStyles.titleList}>Hồ Sơ Cá Nhân</Text>
        </View>
        <TouchableOpacity>
            <FontAwesome name="phone" size={24} color="#835741" />
        </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={{flex:1}}>
                <Text style={styles.label}>Họ <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={first_name}
                    onChangeText={setFirstname}
                    placeholder="Nhập họ"
                />
            </View>
            <View style={{flex:1}}>
                <Text style={styles.label}>Tên <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={last_name}
                    onChangeText={setLastname}
                    placeholder="Nhập tên"
                />
            </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={{flex:1}}>
                <Text style={styles.label}>Ngày sinh <Text style={{color: 'red'}}>*</Text>:</Text>
                <View style={styles.fieldTextinput}>
                <TextInput
                    style={styles.inputDate}
                    value={birthdate}
                    placeholder="yyyy-MM-dd"
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
                {/* <Button title="Chọn ngày" onPress={() => setShow(true)} /> */}
            </View>
            <View style={{flex:1}}>
                <Text style={styles.label}>Giới tính <Text style={{color: 'red'}}>*</Text>:</Text>
                <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <TouchableOpacity
                    style={[styles.option, gender === true && styles.selected]} 
                    onPress={() => setGender(true)}
                >
                    <Text style={styles.optionText}>Nam</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.option, gender === false && styles.selected]} 
                    onPress={() => setGender(false)}
                >
                    <Text style={styles.optionText}>Nữ</Text>
                </TouchableOpacity>
                </View> 
            </View>
            
            </View>
            <View style={{flex:1}}>
                <Text style={styles.label}>Địa chỉ <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Nhập địa chỉ"
                />
            </View>
            <View style={{flex:1}}>
                <Text style={styles.label}>Số điện thoại <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                />
            </View>

            <TouchableOpacity style={styles.button} 
                onPress={handleDone}>
                    <Text style={styles.buttonText1}>Hoàn Thành</Text>
            </TouchableOpacity>
            {loading && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={loading}
                >
                    <View style={MyStyles.loadingContainer}>
                        <View style={MyStyles.overlay} />
                        <View style={MyStyles.logoContainer}>
                            <Image source={'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1726585796/logo1.png'} style={MyStyles.logo} />
                        </View>
                        <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                </Modal>
            )}
        </ScrollView>
        </>
    )
}
export default CreatePatient;
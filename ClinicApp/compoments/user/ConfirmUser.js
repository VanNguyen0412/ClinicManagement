import { ImageBackground, View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import styleUser from "./styleUser";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import APIs, { endpoints } from "../../configs/APIs";
import MyStyles from "../../styles/MyStyles";
import { Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const ComfirmUser = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const nav = useNavigation()

    const fields = [{
        label: "Tên người dùng",
        icon1: "user",
        field: "username",
    },  {
        label: "OTP Code",
        icon1: "code",
        field: "otp",
    },
    ];

    const change = (value, field) => {
        setUser(current => {
            return {...current, [field]: value}
        })
    }

    const confirm = async () => {
        if (!user.username || !user.otp) {
            Alert.alert("VítalCare Clinic", "Vui lòng nhập đủ thông tin");
            return;

        }

        setLoading(true);

        try{       
            const fromData = new FormData();
            fromData.append('username', user.username);
            fromData.append('otp', user.otp);
            
            const response = await APIs.post(endpoints['confirm-user'], fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status === 200){
                Alert.alert("VítalCare Clinic", "Xác nhận thành công. Tài khoản đã được kích hoạt.");
                nav.navigate("Login");
            }
        } catch (error) {
            if (error.response){
                console.error("Error response:", error.response);
                Alert.alert("VítalCare Clinic","Username hoặc mã OTP không chính xác!");
            }else {
                console.error("Network error", error);
                Alert.alert("VítalCare Clinic", "Có lỗi xảy ra, vui lòng thử lại sau")
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground style={styleUser.container} source={require('./images/Clinic2.png')}>
            <View style={styleUser.background}>
                <Text style={styleUser.title}>VítalCare Clinic</Text>
                <Text style={styleUser.registerText}>XÁC NHẬN ĐĂNG KÝ</Text>
                <Text style={styleUser.infoText}>Nhập mã otp mà phòng khám đã gửi cho bạn thông qua email!!</Text>
                {fields.map((f) => (
                    <View
                        key={f.field}
                        style={styleUser.fieldTextinput}>
                        <TextInput
                            value={user[f.field]}
                            onChangeText={(t) => change(t, f.field)}
                            placeholder={f.label}
                            placeholderTextColor="#999"
                            secureTextEntry={f.secureTextEntry}
                            style={styleUser.textInput}
                        />
                        <TouchableOpacity>
                            <FontAwesome name={f.icon1} size={25} color="#835741" />
                        </TouchableOpacity>
                    </View>
                ))}
                
                <TouchableOpacity style={styleUser.backgroundButton} onPress={confirm}>
                    <Text style={styleUser.buttonLogin}>Xác Nhận</Text>
                </TouchableOpacity>
                
                <View style={styleUser.footer}>
                <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
                    <Text style={[styleUser.footerText, styleUser.margin]}>Quay lại trang chủ</Text>
                </TouchableOpacity>
                <Text style={styleUser.footerText}>Bản quyền © 2024</Text>
                </View>
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
                            <Image source={{uri: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1726585796/logo1.png'}} style={MyStyles.logo} />
                        </View>
                        <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                </Modal>
            )}
        </ImageBackground>
    )
}
export default ComfirmUser;
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button, TextInput, TouchableOpacity, View, Text, ImageBackground, Image, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styleUser from "./styleUser";
import { useContext } from "react";
import { MyDispatchContext } from "../../configs/Context";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyles from "../../styles/MyStyles";
import { ActivityIndicator } from "react-native-paper";

const Login = ({ navigation, route }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);
    const [showPassword, setShowPassword] = useState(true);

    const fields = [{
    label: "Tên đăng nhập",
    icon1: "user",
    icon2: "user",
    field: "username",
    secureTextEntry: false
    },  {
    label: "Mật khẩu",
    icon1: "eye",
    icon2: "eye-slash",
    field: "password",
    secureTextEntry: showPassword
    }];

    const change = (value, field) => {
        setUser(current => {
            return {...current, [field]: value}
        })
    }

    const login = async () => {
        setLoading(true);
        try {
            let res = await APIs.post(endpoints['login'], {
                ...user, 
                'client_id': 'Tb1JGVGg4Ew1bWMAdlWh7UdyQaefMl8Uc3QxLmQI',
                'client_secret': '9mMKrSHbjNKmRiEQMyJajVbHwuhW9x7RQQieD7bOowG4mmkZOXU5X5ZxCs6RIoLc2WSwUCraLuCvqovDAugvmvJsStMPYlzQvgMbNEuci4vJJfNO2DznQi9zbPtCO3wm',
                'grant_type': 'password'
            });
            await AsyncStorage.setItem("token", res.data.access_token);
            console.info(res.data.access_token)
            setTimeout(async () => {
                let user = await authApi(res.data.access_token).get(endpoints['current-user']);
                console.info(user.data);
                
                dispatch({
                    "type": "login",
                    "payload": user.data
                })
            }, 100);
        } catch (ex) {
            console.error(
                "Error response:",
                ex.response ? ex.response.data : ex.message
            );
              Alert.alert("VítalCare Clinic", "Tên đăng nhập hoặc mật khẩu không hợp lệ!!!", [
                {
                  text: "OK",
                  onPress: () => {},
                },
              ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ImageBackground style={styleUser.container} source={require('./images/Clinic2.png')}>
            
            <View style={styleUser.background}>
            <Text style={styleUser.title}>VítalCare Clinic</Text>
            <Text style={styleUser.registerText}>ĐĂNG NHẬP</Text>
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
                        
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <FontAwesome
                                name={showPassword ? f.icon2 : f.icon1}
                                size={25}
                                color="#835741"
                            />
                        </TouchableOpacity>
                        
                    </View>
                ))}
                <View style={styleUser.linksContainer}>
                    <TouchableOpacity >
                        <Text style={styleUser.linkText}>Quên mật khẩu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => nav.navigate('Register')}>
                        <Text style={styleUser.linkText}>Đăng ký tài khoản</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styleUser.backgroundButton} onPress={login}>
                    <Text style={styleUser.buttonLogin}>Đăng nhập</Text>
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
    );
}
export default Login;
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button, TextInput, TouchableOpacity, View, Text, ImageBackground, KeyboardAvoidingView, Platform, Image} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styleUser from "./styleUser";
import { ActivityIndicator, TouchableRipple } from "react-native-paper";
import { Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import APIs, { endpoints } from "../../configs/APIs";
import { Modal } from "react-native";
import MyStyles from "../../styles/MyStyles";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const nav = useNavigation()

    const fields = [{
    label: "Tên người dùng",
    icon1: "user",
    field: "username",
    },  {
    label: "Email",
    icon1: "envelope",
    field: "email",
    },];

    const change = (value, field) => {
        setUser(current => {
            return {...current, [field]: value}
        })
    }

    const picker = async () =>{
        let {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("VítalCare Clinic", "Không tải được ảnh!");
        else {
            let res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            
            if (!res.canceled)
                change(res.assets[0], 'avatar');
        }
    };

    const register = async () => {
        if (!user.avatar) {
            Alert.alert("VítalCare Clinic", "Vui lòng chọn ảnh đại diện");
            return;

        }

        if(password !== confirmPassword){
            Alert.alert("VítalCare Clinic", "Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);

        try{       
            const fromData = new FormData();
            fromData.append('username', user.username);
            fromData.append('email', user.email);
            fromData.append('password', password);
            fromData.append('avatar', {
                uri: user.avatar.uri,
                type: 'image/jpeg',  // or appropriate type
                name: 'avatar.jpg'
            });
            const response = await APIs.post(endpoints['create-user'], fromData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status === 201){
                Alert.alert("VítalCare Clinic", "Đăng ký thành công, chờ xét duyệt");
                nav.navigate("ConfirmUser");
            }
        } catch (error) {
            if (error.response){
                console.error("Error response:", error.response);
                Alert.alert("VítalCare Clinic","Thông tin nhập vào không chính xác!");
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
                <Text style={styleUser.registerText}>ĐĂNG KÝ</Text>
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
                <View style={styleUser.fieldTextinput}>
                    <TextInput
                        style={styleUser.textInput}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Nhập Mật Khẩu"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <FontAwesome name={showPassword ? 'eye-slash' : 'eye'}  size={23} color="#835741" />
                    </TouchableOpacity>
                </View>
                <View style={styleUser.fieldTextinput}>
                    <TextInput
                        style={styleUser.textInput}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Nhập Lại Mật Khẩu"
                        placeholderTextColor="#999"
                        secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <FontAwesome name={showConfirmPassword ? 'eye-slash' : 'eye'}  size={23} color="#835741" />
                    </TouchableOpacity>
                </View>
            
                <TouchableOpacity onPress={picker}>
                    <Text style={styleUser.avatarText}>{user.avatar? 'Chọn lại Avatar' : 'Chọn Avatar'}</Text>
                </TouchableOpacity>
                {user.avatar && <Image source={{uri:user.avatar.uri}} style={{width: 150, height: 130, borderRadius: 50}} />}

                <TouchableOpacity style={styleUser.backgroundButton} onPress={register}>
                    <Text style={styleUser.buttonLogin}>Đăng ký</Text>
                </TouchableOpacity>

                <View style={styleUser.footer}>
                <TouchableOpacity onPress={() => nav.navigate('ConfirmUser')}>
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
                            <Image source={'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1726585796/logo1.png'} style={MyStyles.logo} />
                        </View>
                        <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                </Modal>
            )}
        </ImageBackground>
    );
}
export default Register;
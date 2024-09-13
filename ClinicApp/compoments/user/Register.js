import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button, TextInput, TouchableOpacity, View, Text, ImageBackground, KeyboardAvoidingView, Platform, Image} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styleUser from "./styleUser";
import { TouchableRipple } from "react-native-paper";

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
            
                <TouchableRipple>
                    <Text style={styleUser.avatarText}>Chọn Avatar</Text>
                </TouchableRipple>
                {user.avatar && <Image source={{uri:user.avatar.uri}}  />}

                <TouchableOpacity style={styleUser.backgroundButton} onPress={() => nav.navigate('ConfirmUser')}>
                    <Text style={styleUser.buttonLogin}>Đăng ký</Text>
                </TouchableOpacity>

                <View style={styleUser.footer}>
                <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
                    <Text style={[styleUser.footerText, styleUser.margin]}>Quay lại trang chủ</Text>
                </TouchableOpacity>
                <Text style={styleUser.footerText}>Bản quyền © 2024</Text>
                </View>
            </View>
            
        </ImageBackground>
    );
}
export default Register;
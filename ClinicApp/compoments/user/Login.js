import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button, TextInput, TouchableOpacity, View, Text, ImageBackground } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styleUser from "./styleUser";

const Login = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    // const dispatch = useContext(MyDispatchContext);
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
                    <TouchableOpacity >
                        <Text style={styleUser.linkText}>Đăng ký tài khoản</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styleUser.backgroundButton} onPress={() => nav.navigate('HomeDoctor')}>
                    <Text style={styleUser.buttonLogin}>Đăng nhập</Text>
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
export default Login;
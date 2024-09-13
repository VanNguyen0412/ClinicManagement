import { ImageBackground, View, Text, TextInput, TouchableOpacity } from "react-native";
import styleUser from "./styleUser";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

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
                <TouchableOpacity style={styleUser.backgroundButton} onPress={() => nav.navigate('Home')}>
                    <Text style={styleUser.buttonLogin}>Xác Nhận</Text>
                </TouchableOpacity>
                
                <View style={styleUser.footer}>
                <TouchableOpacity onPress={() => nav.navigate('HomeScreen')}>
                    <Text style={[styleUser.footerText, styleUser.margin]}>Quay lại trang chủ</Text>
                </TouchableOpacity>
                <Text style={styleUser.footerText}>Bản quyền © 2024</Text>
                </View>
            </View>
        </ImageBackground>
    )
}
export default ComfirmUser;
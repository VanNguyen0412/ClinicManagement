import { View, Text, TouchableOpacity, useAnimatedValue, Alert, Modal } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { MyUserContext } from '../../configs/Context';
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/APIs";
import { Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import moment from "moment";

const NotificationDetail = ({ onBack, notificationId }) => {
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState(null);
    // console.info(notificationId);

    const loadDetail = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).post(endpoints['read-noti'](notificationId));
            setDetail(res.data)
            // console.info(detail)
        } catch (ex) {
            console.error(ex)
            Alert.alert("Thông báo", "Hiện thông tin lỗi");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDetail();
    }, [notificationId])


    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={[MyStyles.titleList]}>Chi tiết thông báo</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            {detail === null ?
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
                :
                <>
                    <View>
                        <Text>{detail.content}</Text>
                        <Text>{moment(detail.created_date).format('DD MMMM YYYY HH:mm:ss')}</Text>
                    </View>
                </>}
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
            )
            }
        </>
    )
}
export default NotificationDetail;
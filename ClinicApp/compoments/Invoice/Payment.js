import { View, Text, TouchableOpacity, Alert, ScrollView, } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MyStyles from "../../styles/MyStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/APIs";
import { useEffect, useState } from "react";
import style from "../Notification/style";
import { Modal } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Image } from "react-native";
import moment from "moment";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import Invoice from "./Invoice";
import styles from "../Forum/styles";

const Payment = ({ onBack, paymentId }) => {
    const [detail, setDetail] = useState(null)
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const nav = useNavigation();

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("ĐĂNG KÝ", "Không tải được ảnh!");
        else {
            let res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!res.canceled)
                setImage(res.assets[0]);
        }
    };

    const handleCreate = async () => {
        if (!image) {
            Alert.alert("VítalCare Clinic", "Thiếu thông tin. Hãy điền đủ thông tin yêu cầu.")
        }
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const formData = new FormData()
            const filename = image.uri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const fileType = match ? `image/${match[1]}` : `image`;

            // formData.append('image', image)
            if (image) {
                formData.append('payment_proof', {
                    uri: image.uri,
                    name: filename,
                    type: fileType
                });
            }
            
            // formData.append('payment_method', "momo")
            let res = await authApi(token).post(endpoints['proof-payment'](paymentId), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status === 200) {
                Alert.alert("VítalCare Clinic", "Minh chứng thanh toán thành công")
                nav.navigate("Home")
                
            } else if (res.status === 400) {
                Alert.alert("VítalCare Clinic", "Thiếu thông tin. Hãy điền đủ thông tin yêu cầu.")
            }

        } catch (error) {
            if (error.response || error.response.status === 400) {
                Alert.alert("VítalCare Clinic", "Hình ảnh dung lượng quá lớn!");
            }
        } finally {
            setLoading(false)
        }
     }


    const loadInvoiceDetail = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['invoice-detail'](paymentId))
            setDetail(res.data)
        } catch (error) {
            Alert.alert("VítalCare Clinic", "Bị lỗi khi load dữ liệu hóa đơn chưa thanh toán.")

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadInvoiceDetail()
    }, [paymentId])

    return (
        <View>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Thanh Toán Hóa Đơn</Text>
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
                <ScrollView style={{padding: 15}}>
                    <View style={style.invoiceContainer}>
                        <View style={{ flex: 3 }}>
                            <Text style={style.text}>Tiền thuốc: </Text>
                            <Text style={style.text}>Tiền khám: </Text>
                            <Text style={style.text}>Tổng hóa đơn: </Text>
                            <Text style={style.text}>Ngày tạo: </Text>
                        </View>
                        <View style={{ flex: 4 }}>
                            <Text style={style.text}>{detail.total_price} VNĐ</Text>
                            <Text style={style.text}>{detail.consultation_fee} VNĐ</Text>
                            <Text style={style.text}>
                                {(parseFloat(detail.total_price) + parseFloat(detail.consultation_fee))} VNĐ</Text>
                            <Text style={style.text}>{moment(detail.created_at).format('DD MMMM YYYY HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={picker}>
                            <Text style={styles.textAvatar}>{image ? 'Chọn lại hình ảnh' : 'Chọn hình ảnh'}</Text>
                        </TouchableOpacity>
                        {image && <Image source={{ uri: image.uri }} style={styles.image} />}
                        <TouchableOpacity style={styles.buttonRecord} onPress={handleCreate}>
                            <Text style={styles.buttonText}>Tạo mới</Text>
                        </TouchableOpacity>
                </ScrollView>
            }
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
        </View>
    )
}
export default Payment;
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/Context";
import style from "../Notification/style";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { endAsyncEvent } from "react-native/Libraries/Performance/Systrace";
import { Modal } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Image } from "react-native";

const InvoiceDetail = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const user = useContext(MyUserContext);
    const { invoiceId } = route.params;
    const nav = useNavigation()
    const [detail, setDetail] = useState(null)
    const [patient, setPatient] = useState({});

    const loadInvoiceDetail = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['invoice-detail'](invoiceId))
            setDetail(res.data)



        } catch (error) {
            Alert.alert("VítalCare Clinic", "Bị lỗi khi load dữ liệu hóa đơn chưa thanh toán.")

        } finally {
            setLoading(false)
        }
    }

    const getPatient = async () => {
        try {
            if (user && user.id) {
                let url = `${endpoints['current-patient']}?user=${user.id}`;
                const res = await APIs.get(url);
                setPatient(res.data);
            }
            // console.info(patient)
        } catch (ex) {
            Alert.alert("Trang chủ", "Bị lỗi loading.")
        }
    }

    useEffect(() => {
        if (user && user.id) {
            getPatient();
        }
    }, [user.id])

    useEffect(() => {
        loadInvoiceDetail()
    }, [invoiceId])

    return (
        <View>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={() => nav.navigate("Home")}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={[MyStyles.titleList]}>Thanh Toán Hóa Đơn</Text>
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
                <ScrollView style={{ padding: 16 }}>
                    <Text style={style.subTitle}>I. Thông tin khách hàng: </Text>
                    <View style={style.invoiceContainer}>
                        <View style={{ flex: 3 }}>
                            <Text style={style.text}>Họ và tên: </Text>
                            <Text style={style.text}>Mã bệnh nhân: </Text>
                            <Text style={style.text}>Số điện thoại: </Text>
                        </View>
                        <View style={{ flex: 4 }}>
                            <Text style={style.text}>{patient.first_name} {patient.last_name} </Text>
                            <Text style={style.text}>MH{patient.code} </Text>
                            <Text style={style.text}>{patient.phone} </Text>
                        </View>
                    </View>
                    <Text style={style.subTitle}>II. Chi tiết hóa đơn: </Text>
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
                            <Text style={style.text}>{patient.phone} VNĐ</Text>
                            <Text style={style.text}>{moment(detail.created_at).format('DD MMMM YYYY HH:mm:ss')}</Text>
                        </View>
                    </View>
                    <Text style={style.subTitle}>III. Phương thức thanh toán: </Text>
                    <View>
                        <TouchableOpacity style={style.momo}>
                            <Image source={{ uri: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1728151711/momo.jpg' }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={style.momo}>
                            <Image source={{ uri: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1728151842/cash.png' }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={style.payment} >
                        <Text style={style.paymentText}>Thanh toán</Text>
                    </TouchableOpacity>
                </ScrollView>
            }

        </View>
    )
}
export default InvoiceDetail;
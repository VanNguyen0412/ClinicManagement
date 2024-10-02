import { TouchableOpacity, View, Text, Alert, Modal, Image, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MyStyles from "../../styles/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { ActivityIndicator, SegmentedButtons } from "react-native-paper";
import styles from "../Appointment/styles";
import moment from "moment";

const Invoice = ({ patientId, onBack }) => {
    const nav = useNavigation()
    const [invoice, setInvoice] = useState([])
    const [loading, setLoading] = useState(false);
    const [require, setRequire] = useState(false)
    const [value, setValue] = useState('done');


    const handleRequire = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).post(endpoints['require-invoice'](patientId))
            if (res.status === 200) {
                Alert.alert("VítalCare Clinic", "Đã yêu cầu thành công.");
                await AsyncStorage.setItem("require", JSON.stringify(require));
            } else if (res.status === 400) {
                // console.error("Error creating forum:", response.data);
                Alert.alert("VítalCare Clinic", "Bạn chưa có kết quả khám và toa thuốc!");
                setRequire(true)

            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const loadInvoice = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }

            let res = await authApi(token).get(endpoints['invoice'](patientId))
            setInvoice(res.data);

        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Bị lỗi.")
        }
    }

    useEffect(() => {

        loadInvoice()

    }, [patientId])

    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Thông Tin Hóa Đơn</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 12 }}>
                <SegmentedButtons 
                    style={{marginBottom: 20}}
                    value={value}
                    onValueChange={setValue}
                    buttons={[
                        {
                            value: 'done',
                            label: 'Lịch sử thanh toán',
                        },
                        {
                            value: 'new',
                            label: 'Thanh toán',
                        },
                    ]}
                />
                {value === 'new' && (
                    !require &&
                    <TouchableOpacity style={MyStyles.closeButton} onPress={handleRequire}>
                        <Text style={MyStyles.closeButtonText}>Yêu cầu hóa đơn</Text>
                    </TouchableOpacity>

                )}

                {value === 'done' && (
                    <View>
                    <Text style={{fontFamily: 'serif', marginBottom:  10, fontSize: 17, fontWeight: '700'}}>
                        Danh sách hóa đơn đã thanh toán</Text>
                    {invoice.map((invoice) => (
                        <View key={invoice.id} style={styles.appointmentCard} >
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontFamily: 'serif', marginRight: 13, marginTop: 60, fontWeight: '700' }}>Số HĐ: {invoice.id}</Text>
                                <View>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif', fontSize: 16, fontWeight: '700' }} >Mã hóa đơn: {invoice.invoice_number}</Text>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif', fontSize: 15 }} >
                                        Bệnh nhân: {invoice.prescription.appointment.patient.full_name}</Text>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>
                                        Ngày tạo: {moment(invoice.created_at).format('DD MMMM YYYY HH:mm:ss')}</Text>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Tiền thuốc: {invoice.total_price} VNĐ</Text>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Tiền khám: {invoice.consultation_fee} VNĐ</Text>
                                    <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Trạng thái: {invoice.is_paid ? 'Đã thanh toán' : 'Chưa thanh toán'}</Text>
                                    {invoice.is_paid ? (
                                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 7 }} >
                                            <FontAwesome name="info-circle" size={20} color='#835741' />
                                            <Text style={{ fontFamily: 'serif', color: '#835741', marginLeft: 7 }}>Chi tiết</Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                    ))}
                    </View>
                )}

            </ScrollView >
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
    );
}
export default Invoice;
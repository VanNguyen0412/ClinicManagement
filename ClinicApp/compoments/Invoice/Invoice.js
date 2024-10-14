import { TouchableOpacity, View, Text, Alert, Modal, Image, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import MyStyles from "../../styles/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { ActivityIndicator, SegmentedButtons } from "react-native-paper";
import styles from "../Appointment/styles";
import moment from "moment";
import InvoiceDetail from "./InvoiceDetail";
import { RefreshControl } from "react-native";
import { MyContext } from "../../App";

const Invoice = ({ patientId, onBack }) => {
    const {renderCallButton } = useContext(MyContext);
    const nav = useNavigation()
    const [invoice, setInvoice] = useState([])
    const [loading, setLoading] = useState(false);
    const [require, setRequire] = useState(false)
    const [value, setValue] = useState('done');
    const [no_paid, setNoPaid] = useState([])
    const [payment, setPayment] = useState(false)
    const [result, setResult] = useState([]);
    const [refreshing1, setRefreshing1] = useState(false);
    const [refreshing2, setRefreshing2] = useState(false);

    const onRefresh1 = async () => {
        setRefreshing1(true);
        
        await loadInvoiceNoPaid(); // Load lại thuốc
        setRefreshing1(false);
    };

    const onRefresh2 = async () => {
        setRefreshing2(true);
        
        await loadInvoice(); // Load lại thuốc
        setRefreshing2(false);
    };

    const loadResult = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['result-invoice']);
            setResult(res.data);
            // console.info(res.data)
        } catch (error) {
            if (error.response) {
                console.error(error)
                Alert.alert("VítalCare Clinic", "Bị lỗi thông tin!");
            } else {
                console.error("Network error", error);
                Alert.alert("VítalCare Clinic", "Có lỗi xảy ra, vui lòng thử lại sau")
            }
        } finally {
            setLoading(false)
        }
    }


    const handleRequire = async (prescriptionId) => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).post(endpoints['require-invoice'](prescriptionId))
            if (res.status === 200) {
                Alert.alert("VítalCare Clinic", "Đã yêu cầu thành công.");

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
        setLoading(true)

        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }

            let res = await authApi(token).get(endpoints['invoice'](patientId))
            setInvoice(res.data);
            console.info(res.data)

        } catch (error) {
            if(error.status === 404){
                setInvoice([])
            }else{
                Alert.alert("VítalCare Clinic", "Bị lỗi.")

            }
        } finally {
            setLoading(false)

        }
    }

    const loadInvoiceNoPaid = async () => {
        setLoading(true)

        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }

            let res = await authApi(token).get(endpoints['invoice-none'](patientId))
            setNoPaid(res.data);
            // console.info(no_paid)
        } catch (error) {
            if(error.status === 404){
                setNoPaid([])
            }else{
                Alert.alert("VítalCare Clinic", "Bị lỗi khi load dữ liệu hóa đơn chưa thanh toán.")

            }
        } finally {
            setLoading(false)

        }
    }

    useEffect(() => {
        loadInvoiceNoPaid()
        loadInvoice()
        loadResult()
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
                <TouchableOpacity onPress={() => renderCallButton()}>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 12 }}>
                <SegmentedButtons
                    style={{ marginBottom: 20 }}
                    value={value}
                    onValueChange={setValue}
                    buttons={[
                        {
                            value: 'done',
                            label: 'Lịch sử',
                        },
                        {
                            value: 'require',
                            label: 'Yêu cầu',
                        },
                        {
                            value: 'new',
                            label: 'Mới',
                        },
                    ]}
                />
                {value === 'require' && (
                    <ScrollView style={{ marginBottom: 20 }}>
                        {result.map((result) => (
                            <View style={{ flex: 1, padding: 8, marginBottom: 5 }} key={result.id}>
                                <View style={{ borderWidth: 2, padding: 8, borderRadius: 6, borderColor: '#835741' }}>
                                    <View>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif', fontSize: 17, fontWeight: '700' }} >
                                            Bệnh nhân: MH{result.appointment.patient.code}</Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif', fontSize: 15 }} >
                                            Bác sĩ: {result.doctor.full_name}</Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>
                                            Ngày khám: {result.appointment.appointment_date} </Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>
                                            Giờ khám: {result.appointment.appointment_time}</Text>
                                    </View>
                                    {!require &&
                                        <TouchableOpacity style={MyStyles.invoiceButton} onPress={() => handleRequire(result.id)}>
                                            <Text style={MyStyles.invoiceButtonText}>Yêu cầu hóa đơn</Text>
                                        </TouchableOpacity>}

                                </View>

                            </View>
                        ))}
                    </ScrollView>
                )}

                {value === 'new' && (
                    <ScrollView 
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing1}
                            onRefresh={onRefresh1}
                        />
                    }>
                        <Text style={{ fontFamily: 'serif', marginBottom: 10, fontSize: 17, fontWeight: '700' }}>
                            Hóa đơn của bạn</Text>
                        {no_paid.map((no) => (
                            <View key={no.id} style={styles.appointmentCard} >
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'serif', marginRight: 13, marginTop: 60, fontWeight: '700' }}>Số HĐ: {no.id}</Text>
                                    <View>
                                        <Text style={{ marginBottom: 3, fontFamily: 'serif', fontSize: 16, fontWeight: '700' }} >Mã hóa đơn: {no.invoice_number}</Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif', fontSize: 12 }}>
                                            {moment(no.created_at).format('Do/MM/YYYY HH:mm:ss')}</Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Tiền thuốc: {no.total_price} VNĐ</Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Tiền khám: {no.consultation_fee} VNĐ</Text>
                                        <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>Trạng thái: {no.is_paid ? 'Đã thanh toán' : 'Chưa thanh toán'}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.buttonRecord} onPress={() => nav.navigate("InvoiceDetail", { "invoiceId": no.id })}>
                                    <Text style={styles.closeButtonText}>Thanh toán</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                )}

                {value === 'done' && (
                    <ScrollView style={{marginBottom:150}}
                    refreshControl={ // Thêm RefreshControl để làm mới khi kéo xuống
                        <RefreshControl
                            refreshing={refreshing2}
                            onRefresh={onRefresh2}
                        />
                    }>
                        <Text style={{ fontFamily: 'serif', marginBottom: 10, fontSize: 17, fontWeight: '700' }}>
                            Danh sách hóa đơn đã thanh toán</Text>
                        {invoice.map((invoice) => (
                            <View key={invoice.id} style={[styles.appointmentCard]} >
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
                                            null
                                        ) : <TouchableOpacity style={{ flexDirection: 'row', marginTop: 7 }} >
                                            <FontAwesome name="info-circle" size={20} color='#835741' />
                                            <Text style={{ fontFamily: 'serif', color: '#835741', marginLeft: 7 }}>Chi tiết</Text>
                                        </TouchableOpacity>}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                )}

            </View >
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
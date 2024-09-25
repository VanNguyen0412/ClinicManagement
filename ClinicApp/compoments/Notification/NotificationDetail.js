import { View, Text, TouchableOpacity, useAnimatedValue, Alert, Modal } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { MyUserContext } from '../../configs/Context';
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { Image } from "react-native";
import { ActivityIndicator, DataTable } from "react-native-paper";
import moment from "moment";
import style from "./style";
import Toast from 'react-native-toast-message';
// import { WebView } from 'react-native-webview';
import { Linking } from "react-native";

const NotificationDetail = ({ onBack, notificationId }) => {
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState(null);
    const [info, setInfo] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [modalVisible1, setModalVisible1] = useState(false);

    const handlePress = (medicine) => {
        setSelectedMedicine(medicine);
        setModalVisible1(!modalVisible1)
    };

    const getStatus = (status) => {
        switch (status) {
            case 'confirm':
                return 'Đã xác nhận';
            case 'pending':
                return 'Đang chờ';
            case 'cancel':
                return 'Đã bị hủy';
            default:
                return status;
        }
    };

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
            console.info(detail)
        } catch (ex) {
            console.error(ex)
            Alert.alert("Thông báo", "Hiện thông tin lỗi");
        } finally {
            setLoading(false)
        }
    }

    const loadInfo = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['notification-information'](notificationId));
            setInfo(res.data)

        } catch (ex) {
            console.error(ex)
            Alert.alert("Thông báo", "Hiện thông tin chi tiết bị lỗi");
        } finally {
            setLoading(false)
        }
    };

    const handleDownload = async () => {
        setLoading(true);
        setDownloading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let response = await APIs.get(endpoints['download-pdf'](notificationId));

            if (response.status === 200) {
                const pdfUrl = response.request.responseURL;
                Linking.openURL(pdfUrl);
                console.info(pdfUrl)
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load PDF',
                });
            }

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.error || 'An error occurred',
            });
        } finally {
            setDownloading(false);
            setLoading(false);
        }
    };
    useEffect(() => {
        loadDetail();
        loadInfo();
    }, [notificationId])



    const renderDetailContent = () => {
        if (!detail || !info) return null;

        switch (detail.type) {
            case 'appointment':
                return (
                    <>
                        <View style={{ padding: 16 }}>
                            <Text style={style.content}>{detail.content}</Text>
                            {/* Thông tin lịch hẹn */}
                            <Text style={style.subTitle}>I. Thông tin lịch hẹn:</Text>
                            <Text style={style.text}>{`Ngày hẹn khám: ${moment(info.appointment_date).format('DD MMMM YYYY')}`}</Text>
                            <Text style={style.text}>{`Giờ hẹn khám: ${moment(info.appointment_time, "HH:mm:ss.SSSSSS").format('HH:mm:ss')}`}</Text>
                            <Text style={style.text}>{`Tình trạng: ${getStatus(info.status)}`}</Text>

                            {/* Thông tin bác sĩ */}
                            <Text style={style.subTitle}>II. Thông tin bác sĩ:</Text>
                            <Text style={style.text}>{`Tên bác sĩ: ${info.doctor.full_name}`}</Text>
                            <Text style={style.text}>{`Chuyên khoa: ${info.doctor.expertise}`}</Text>

                            {/* Thông tin bệnh nhân */}
                            <Text style={style.subTitle}>III. Thông tin bệnh nhân:</Text>
                            <Text style={style.text}>{`Tên bệnh nhân: ${info.patient.full_name}`}</Text>
                            <Text style={style.text}>{`Mã bệnh nhân: MH${info.patient.code}`}</Text>
                            <Text style={style.text}>{`Email: ${info.patient.email}`}</Text>
                        </View>
                    </>
                );
            case 'medicine':
                return (
                    <>

                        <View style={{ padding: 12 }}>
                            <Text style={style.content}>{detail.content}</Text>
                            {/* Thông tin lịch hẹn */}
                            <Text style={style.subTitle}>I. Thông tin toa thuốc:</Text>

                            <DataTable>
                                <DataTable.Header style={style.tableHeader}>
                                    <DataTable.Title style={style.tableTitle1}>Tên Thuốc</DataTable.Title>
                                    <DataTable.Title style={style.tableTitle3}>SL</DataTable.Title>
                                    <DataTable.Title style={style.tableTitle1}>Cách Dùng</DataTable.Title>
                                    <DataTable.Title style={style.tableTitle3}>Giá</DataTable.Title>
                                    <DataTable.Title style={{ flex: 1 }}></DataTable.Title>
                                </DataTable.Header>
                                {info.map((medicine) => (
                                    <DataTable.Row key={medicine.id} style={style.tableRow}>
                                        <DataTable.Cell style={style.tableCell1}>{medicine.medicine.name}</DataTable.Cell>
                                        <DataTable.Cell style={style.tableCell3}>{medicine.count}</DataTable.Cell>
                                        <DataTable.Cell style={style.tableCell1}>{medicine.dosage}</DataTable.Cell>
                                        <DataTable.Cell style={style.tableCell3}>{medicine.price}</DataTable.Cell>
                                        <DataTable.Cell style={{ flex: 1 }}>
                                            <FontAwesome
                                                name="info-circle"
                                                size={20}
                                                color="#835741"
                                                style={{ marginLeft: 10 }}
                                                onPress={() => handlePress(medicine)}
                                            />
                                        </DataTable.Cell>

                                    </DataTable.Row>
                                ))}

                            </DataTable>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible1}
                                onRequestClose={() => {
                                    setModalVisible1(!modalVisible1);
                                }}>
                                <View style={style.modalOverlay}>
                                    <View style={style.modalView}>
                                        {selectedMedicine && (
                                            <>
                                                {/* <Image source={{ uri: selectedMedicine.image }} style={styles.modalImage} /> */}
                                                <Text style={style.modalTitle}>Tên Thuốc: {selectedMedicine.medicine.name}</Text>
                                                <Text style={style.modalText}>Số Lượng: {selectedMedicine.count}</Text>
                                                <Text style={style.modalText}>Cách Dùng: {selectedMedicine.dosage}</Text>
                                                <Text style={style.modalText}>Giá: {selectedMedicine.price} VNĐ</Text>
                                            </>
                                        )}
                                        
                                        <TouchableOpacity
                                            style={style.closeButton}
                                            onPress={() => setModalVisible1(false)}>
                                            <Text style={style.closeButtonText}>Đóng</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            < Text style={style.subTitle} > II.Toa thuốc:</Text>

                            <TouchableOpacity
                                onPress={() => handleDownload()}>
                                <Text style={style.closeButtonText}><FontAwesome name="cloud-download" size={20} />{downloading ? 'Đang Tải...' : 'Tải Toa Thuốc'}</Text>
                            </TouchableOpacity>
                            <Toast ref={(ref) => Toast.setRef(ref)} />
                        </View >


                    </>
                );
            case 'general':
            default:
                return (
                    <>
                        <View style={{ padding: 16 }}>
                            <Text style={style.content}>{detail.content}</Text>
                            {/* Thông tin lịch hẹn */}
                            <Text style={style.subTitle}>I. Thông tin lịch hẹn:</Text>
                            <Text style={style.text}>{`Ngày hẹn khám: ${moment(info.appointment.appointment_date).format('DD MMMM YYYY')}`}</Text>
                            <Text style={style.text}>{`Giờ hẹn khám: ${moment(info.appointment.appointment_time, "HH:mm:ss.SSSSSS").format('HH:mm:ss')}`}</Text>
                            <Text style={style.text}>{`Tên bệnh nhân: ${info.appointment.patient.full_name}`}</Text>
                            <Text style={style.text}>{`Mã bệnh nhân: MH${info.appointment.patient.code}`}</Text>

                            {/* Thông tin bác sĩ */}
                            <Text style={style.subTitle}>II. Thông tin khám bệnh:</Text>
                            <Text style={style.text}>{`Tên bác sĩ: ${info.doctor.full_name}`}</Text>
                            <Text style={style.text}>{`Chuyên khoa: ${info.doctor.expertise}`}</Text>
                            <Text style={style.text}>{`Triệu chứng: ${info.diagnosis}`}</Text>
                            <Text style={style.text}>{`Chẩn đoán: ${info.symptom}`}</Text>

                        </View>
                    </>
                );
        }
    }


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
            {detail === null || info === null ?
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
                    <View>{renderDetailContent()}</View>

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
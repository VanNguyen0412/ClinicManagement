import { Alert, Image, Modal, ScrollView } from "react-native";
import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import styles from "./styles";
import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator, Appbar, DataTable } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import MyStyles from "../../styles/MyStyles";
import moment from "moment";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MyContext } from "../../App";


const CreatePresciption = ({ onBack, prescription }) => {
    const {renderCallButton } = useContext(MyContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [newMedicine, setNewMedicine] = useState({ name: '', count: '', dosage: '', price: '' });
    const [addMedicine, setAddMedicine] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [selectedMedicine1, setSelectedMedicine1] = useState(null);
    const [medicine, setMedicine] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [listMedicine, setListMedicine] = useState([])
    const [filteredMedicineList, setFilteredMedicineList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showFull, setShowFull] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState([]);
    const [viewDone, setViewDone] = useState(false);
    const nav = useNavigation();

    const loadMedicine = async () => {
        try {
            let res = await APIs.get(endpoints['medicine-all'])
            setMedicine(res.data)
            const formattedMedicine = res.data.map(med => ({
                label: med.name,
                value: med.id,
                image: med.image
            }));
            setListMedicine(formattedMedicine)
        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Bị lỗi khi loading thuốc.")
        }
    }

    const handleAdd = () => {
        setAddMedicine(!addMedicine)
        setSearchText('')
    }

    useEffect(() => {
        loadMedicine();
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = listMedicine.filter(medicine =>
            medicine.label.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredMedicineList(filtered);
    };


    const handleSelectMedicine = (medicine) => {
        setSearchText(medicine.label);
        setFilteredMedicineList([]);
    };

    const handleClearText = () => {
        setSearchText('');
    };

    const handleModal = (item) => {
        setSelectedMedicine(item);
        setModalVisible(!modalVisible)
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const selected = listMedicine.find(item => item.label === selectedMedicine.name);
            let res = await authApi(token).delete(endpoints['delete-medicine'](prescription.id, selected.value));
            if (res.status === 200) {
                Alert.alert("VítalCare Clinic", "Đã xóa thuốc thành công.");
                setMedicines((prevMedicines) =>
                    prevMedicines.filter((med) => med.id !== selectedMedicine.id)
                );
                setModalVisible(false);
                setSelectedMedicine(null);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("VítalCare Clinic", "Bị lỗi khi xóa.");
        } finally {
            setLoading(false)
        }

    };

    const handleAddMedicine = async () => {

        setLoading(true)
        try {

            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const selected = listMedicine.find(item => item.label === searchText);
            const formData = new FormData();
            formData.append('medicine', selected.value);
            formData.append('dosage', newMedicine.dosage);
            formData.append('count', newMedicine.count);
            formData.append('price', newMedicine.price);
            console.info(formData)
            const response = await authApi(token).post(endpoints['add-medicines'](prescription.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.status === 201) {
                Alert.alert("VítalCare Clinic", "Thêm thuốc thành công.");
                if (selected) {
                    const newId = (medicines.length + 1).toString();
                    const newMedicineEntry = {
                        id: newId,
                        name: selected.label,
                        count: newMedicine.count,
                        dosage: newMedicine.dosage,
                        price: newMedicine.price
                    };
                    setMedicines(prevMedicines => [...prevMedicines, newMedicineEntry]);
                }
                setNewMedicine({ count: '', dosage: '', price: '' });
                setAddMedicine(false)
            } else if (response.status === 400) {
                Alert.alert("VítalCare Clinic", "Thuốc này đã được thêm vào đơn thuốc.")
            }

        } catch (error) {
            console.error(error);
            Alert.alert("VítalCare Clinic", "Thuốc này đã được thêm vào đơn thuốc.");
        } finally {
            setLoading(false)
        }


    };

    const handleDone = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['done-prescription'](prescription.id))
            setDone(res.data)
            setViewDone(true)
        } catch (error) {
            console.error(error);
            Alert.alert("VítalCare Clinic", "Hoàn thành toa thuốc bị lỗi.");
        } finally {
            setLoading(false)
        }
    };

    const handleCloseDone = () => {
        setViewDone(false);
        nav.navigate("HomeDoctor")
    }

    const handleDetails = (value) => {
        const medicineDetails = medicine.find(med => med.name === value);
        setSelectedMedicine1(medicineDetails);
        setModalVisible1(true);
    };

    const toggle = () => {
        setShowFull(!showFull);
    };

    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Kê Toa Thuốc</Text>
                </View>
                <TouchableOpacity onPress={() => renderCallButton()}>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.subTitle}>I. Thông tin bệnh nhân</Text>
                <View style={{ flex: 1, padding: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Họ và tên:</Text>
                        <Text style={styles.name}>{prescription.appointment.patient.full_name}</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Ngày khám:</Text>
                        <Text style={styles.name}>{moment(prescription.appointment.appointment_date).format('Do MMMM, YYYY')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Giờ khám:</Text>
                        <Text style={styles.name}>{moment(prescription.appointment.appointment_time, "HH:mm:ss.SSSSSS").format('HH:mm:ss')}</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Triệu chứng:</Text>
                        <Text style={styles.name}>{prescription.symptom}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.label}>Chẩn đoán:</Text>
                        <Text style={styles.name}>{prescription.diagnosis}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.subTitle}>II. Danh sách thuốc</Text>
                    <FontAwesome name='plus-square-o' size={25} style={styles.iccon}
                        onPress={handleAdd} />
                </View>
                <DataTable>
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title style={styles.tableTitle1}>Tên Thuốc</DataTable.Title>
                        <DataTable.Title style={styles.tableTitle3}>SL</DataTable.Title>
                        <DataTable.Title style={styles.tableTitle1}>Cách Dùng</DataTable.Title>
                        <DataTable.Title style={styles.tableTitle3}>Giá</DataTable.Title>
                        <DataTable.Title style={styles.tableTitle3}></DataTable.Title>
                    </DataTable.Header>
                    {medicines.map((item) => (
                        <DataTable.Row style={styles.tableRow}>
                            <DataTable.Cell style={styles.tableCell1}>{item.name}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCell3}>{item.count}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCell1}>{item.dosage}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCell3}>{item.price}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCell3}>
                                <FontAwesome
                                    name="info-circle"
                                    size={20}
                                    color="#835741"
                                    style={{ marginLeft: 10 }}
                                    onPress={() => handleModal(item)}
                                />
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>

                {addMedicine && (
                    <View style={styles.addMedicineContainer}>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput
                                    style={styles.inputSearch}
                                    placeholder="Search medicine..."
                                    value={searchText}
                                    onChangeText={handleSearch}
                                />
                                {searchText.length > 0 && (
                                    <TouchableOpacity onPress={handleClearText} style={{ flex: 0.5, justifyContent: "center" }}>
                                        <FontAwesome name="close" size={24} color="#835741" />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => handleDetails(searchText ? listMedicine.find(item => item.label === searchText).label : '')}
                                    style={{ flex: 0.5, justifyContent: "center" }}
                                    disabled={!searchText}
                                >
                                    <FontAwesome name="info-circle" size={24} color={searchText ? "#835741" : "#ccc"} />
                                </TouchableOpacity>
                            </View>

                            {filteredMedicineList.length > 0 && (
                                <FlatList
                                    data={filteredMedicineList}
                                    keyExtractor={(item) => item.value.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.item}
                                            onPress={() => handleSelectMedicine(item)}
                                        >
                                            <Image source={{ uri: item.image }} style={{ width: 40, height: 40, borderRadius: 3, marginRight: 7 }} />
                                            <Text style={{ fontFamily: 'serif', flex: 1 }}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}

                        </View>
                        <TextInput
                            style={styles.inputMedicine}
                            placeholder="Số lượng"
                            value={newMedicine.count}
                            onChangeText={(text) => setNewMedicine({ ...newMedicine, count: text })}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.inputMedicine}
                            placeholder="Cách dùng"
                            value={newMedicine.dosage}
                            onChangeText={(text) => setNewMedicine({ ...newMedicine, dosage: text })}
                        />
                        <TextInput
                            style={styles.inputMedicine}
                            placeholder="Giá"
                            value={newMedicine.price}
                            onChangeText={(text) => setNewMedicine({ ...newMedicine, price: text })}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={[styles.addButton, styles.marginMedicine]}
                            onPress={handleAddMedicine}
                        >
                            <Text style={styles.closeButtonText}>Thêm Thuốc</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleDone}>
                    <Text style={styles.closeButtonText}>Hoàn Tất Toa Thuốc</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            {selectedMedicine && (
                                <>
                                    <Text style={styles.modalTitle}>{selectedMedicine.name}</Text>
                                    <Text style={styles.modalText}>Số Lượng: {selectedMedicine.count}</Text>
                                    <Text style={styles.modalText}>Cách dùng: {selectedMedicine.dosage}</Text>
                                    <Text style={styles.modalText}>Giá: {selectedMedicine.price} VNĐ</Text>
                                </>
                            )}
                            <TouchableOpacity
                                style={styles.closeButton1}
                                onPress={handleDelete}>
                                <Text style={styles.closeButtonText}>Xóa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible1}
                    onRequestClose={() => {
                        setModalVisible1(!modalVisible);
                    }}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView1}>
                            {selectedMedicine1 && (
                                <>
                                    <Image source={{ uri: selectedMedicine1.image }} style={styles.modalImage} />
                                    <Text style={styles.modalTitle}>{selectedMedicine1.name}</Text>
                                    <Text style={styles.modalText}>Giá: {selectedMedicine1.price} VNĐ/ Sản phẩm</Text>
                                    <Text style={styles.modalUses}>
                                        {showFull ? selectedMedicine1.uses : `${selectedMedicine1.uses.substring(0, 70)}... `}
                                        <TouchableOpacity onPress={toggle}>
                                            <Text style={styles.showMoreText}>{showFull ? ' Thu gọn' : ' Xem thêm'}</Text>
                                        </TouchableOpacity>
                                    </Text>

                                </>
                            )}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible1(false)}>
                                <Text style={styles.closeButtonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={viewDone}
                    onRequestClose={() => {
                        setViewDone(!viewDone);
                    }}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Danh sách toa thuốc</Text>
                            <Text style={{ fontFamily: 'serif', textAlign: 'center', fontWeight: '700' }}>Bệnh Nhân: {prescription.appointment.patient.full_name}</Text>
                            {done.map((item) => (
                                <>
                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        <Text style={{ fontFamily: 'serif', marginRight: 7, marginTop: 43, fontWeight: '700', flex: 1 }}>Phiếu khám: {prescription.id}</Text>
                                        <View style={{flex: 4}}>
                                            <Text style={{ marginBottom: 5, fontFamily: 'serif' }}>{item.medicine.name}</Text>
                                            <Text style={styles.modalText}>Cách dùng: {item.dosage}</Text>
                                            <Text style={styles.modalText}>Số lượng: {item.count} / {item.medicine.unit}</Text>
                                            <Text style={styles.modalText}>Giá: {item.price} VNĐ / Sản phẩm</Text>
                                        </View>
                                    </View>
                                </>
                            ))}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleCloseDone}>
                                <Text style={styles.closeButtonText}>Hoàn thành</Text>
                            </TouchableOpacity>
                        </View >
                    </View>
                </Modal>
            </ScrollView>
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
export default CreatePresciption;
import { Image, Modal, ScrollView } from "react-native";
import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import styles from "./styles";
import { FontAwesome } from "@expo/vector-icons";
import { Appbar, DataTable } from "react-native-paper";
import { useState } from "react";
import DropDownPicker from 'react-native-dropdown-picker';


const CreatePresciption = ({onBack, patientInfo }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [newMedicine, setNewMedicine] = useState({ name: '', quantity: '', usage: '', price: '' });
    const [addMedicine, setAddMedicine] = useState(false);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [open, setOpen] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [selectedMedicine1, setSelectedMedicine1] = useState(null);

    const [medicines, setMedicines]= useState([]);
    const [listMedicine, setListMedicine] = useState([
        {label:'Chọn thuốc...'},
        {label: 'Enat 400 IU điều trị và dự phòng tình trạng thiếu vitamin E', value: '1' },
        {label: 'Viên uống Blackmores Cholesterol Health hỗ trợ giảm cholesterol (Hộp 60 viên)', value: '2', },
        {label: 'Viên uống DHC DHA bổ sung DHA, EPA, hỗ trợ giảm mỡ máu (120 viên)', value: '3', },
        {label: 'Viên uống DHC DHA bổ sung DHA, EPA, hỗ trợ giảm mỡ máu (120 viên)', value: '4', },
        
    ])
    const [medicine] = useState([
        {
            name: "Enat 400 IU điều trị và dự phòng tình trạng thiếu vitamin E",
            image: "https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032708/1.jpg",
            unit: 'Viên',
            price: '35.000'
        },
        {
            name: "Viên uống Blackmores Cholesterol Health hỗ trợ giảm cholesterol (Hộp 60 viên)",
            image: "https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032898/2.jpg",
            unit: 'Viên',
            price: '35.000'
        },
        {
            name: "Viên uống DHC DHA bổ sung DHA, EPA, hỗ trợ giảm mỡ máu (120 viên)",
            image: "https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032954/3.jpg",
            unit: 'Viên',
            price: '35.000'
        },
        {
            name: "Viên uống DHC DHA bổ sung DHA, EPA, hỗ trợ giảm mỡ máu (120 viên)",
            image: "https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032954/3.jpg",
            unit: 'Viên',
            price: '35.000'
        },
    ]);

    const handleModal = (item) => {
        setSelectedMedicine(item);
        setModalVisible(!modalVisible)
    }

    const handleDelete = () => {
        setMedicines((prevMedicines) =>
            prevMedicines.filter((med) => med.id !== selectedMedicine.id)
        );
        setModalVisible(false);
        setSelectedMedicine(null);
    };

    const handleAddMedicine = () => {
        const selected = listMedicine.find(item => item.value === dropdownValue);
        if (selected) {
            const newId = (medicines.length + 1).toString();
            const newMedicineEntry = {
                id: newId,
                name: selected.label,
                quantity: newMedicine.quantity,
                usage: newMedicine.usage,
                price: newMedicine.price
            };

            // Add the new medicine to the state
            setMedicines(prevMedicines => [...prevMedicines, newMedicineEntry]);

            // Reset the dropdown and new medicine fields
            setDropdownValue(null);
            setNewMedicine({ quantity: '', usage: '', price: '' });
            setAddMedicine(false)
        }
    };

    const handleDetails = (value) => {
        const medicineDetails = medicine.find(med => med.name === value);
        setSelectedMedicine1(medicineDetails);
        setModalVisible1(true);
    };

    return (
        <>
        <View style={styles.header1}>
                <FontAwesome name="angle-left" size={35} style={{marginTop: 25}} onPress={onBack}/>
                <Text style={styles.title}>Kê Toa Thuốc</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            
                <Text style={styles.subTitle}>I. Thông tin bệnh nhân</Text>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.label}>Họ và tên:</Text>
                    <Text style={styles.name}>{patientInfo.name}</Text>
                </View>
                
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.label}>Ngày khám:</Text>
                    <Text style={styles.name}>{patientInfo.examDate}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.label}>Giờ khám:</Text>
                    <Text style={styles.name}>{patientInfo.examTime}</Text>
                </View>
                
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.label}>Triệu chứng:</Text>
                    <Text style={styles.name}>{patientInfo.diagnosis}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.label}>Chẩn đoán:</Text>
                    <Text style={styles.name}>{patientInfo.symptoms}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={styles.subTitle}>II. Danh sách thuốc</Text>
                    <FontAwesome name='plus-square-o' size={25} style={styles.iccon}
                    onPress={() => setAddMedicine(!addMedicine)} />
                </View>
                <DataTable>
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title style={styles.tableTitle1}>Tên Thuốc</DataTable.Title>
                        <DataTable.Title style={styles.tableTitle3}>SL</DataTable.Title>
                        <DataTable.Title style={styles.tableTitle1}>Cách Dùng</DataTable.Title>
                        <DataTable.Title style={styles.tableTitle3}>Giá</DataTable.Title>
                        <DataTable.Title style={styles.tableTitle3}></DataTable.Title>
                    </DataTable.Header>
                    <FlatList
                    data={medicines}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <DataTable.Row style={styles.tableRow}>
                            <DataTable.Cell style={styles.tableCell1}>{item.name}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCell3}>{item.quantity}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCell1}>{item.usage}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCell3}>{item.price}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCell3}>
                                <FontAwesome
                                    name="info-circle"
                                    size={20}
                                    color="#835741"
                                    style={{marginLeft: 10}}
                                    onPress={() => handleModal(item)}
                                />
                            </DataTable.Cell>
                        </DataTable.Row>
                    )}
                /> 
                </DataTable>
                
                {addMedicine && (
                <View style={styles.addMedicineContainer}>
                    <View style={{flexDirection:'row',justifyContent: 'space-between'}}>
                    <DropDownPicker
                        items={listMedicine}
                        open={open}
                        placeholder="Chọn thuốc"
                        setOpen={setOpen}
                        setValue={setDropdownValue}
                        setItems={setListMedicine}
                        containerStyle={{ marginBottom: 10, height: 40, width:'90%'}}
                        onChangeItem={(item) => setDropdownValue(item.value)}
                        value={dropdownValue}
                        style={styles.dropdownContainer}
                    />
                    <TouchableOpacity 
                        onPress={() => handleDetails(dropdownValue ? listMedicine.find(item => item.value === dropdownValue).label : '')}
                        style={styles.iconContainer}
                        disabled={!dropdownValue}
                    >
                        <FontAwesome name="info-circle" size={24} color={dropdownValue ? "#835741" : "#ccc"} />
                    </TouchableOpacity>
                    </View>
                <TextInput
                    style={styles.inputMedicine}
                    placeholder="Số lượng"
                    value={newMedicine.quantity}
                    onChangeText={(text) => setNewMedicine({ ...newMedicine, quantity: text })}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.inputMedicine}
                    placeholder="Cách dùng"
                    value={newMedicine.usage}
                    onChangeText={(text) => setNewMedicine({ ...newMedicine, usage: text })}
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
                        onPress={() => setModalVisible1(false)}>
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
                            {/* <Image source={{ uri: selectedMedicine.image }} style={styles.modalImage} /> */}
                            <Text style={styles.modalTitle}>{selectedMedicine.name}</Text>
                            <Text style={styles.modalText}>Số Lượng: {selectedMedicine.quantity}</Text>
                            <Text style={styles.modalText}>Cách dùng: {selectedMedicine.usage}</Text>
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
                <View style={styles.modalView}>
                    {selectedMedicine1 && (
                        <>
                            <Image source={{ uri: selectedMedicine1.image }} style={styles.modalImage} />
                            <Text style={styles.modalTitle}>{selectedMedicine1.name}</Text>
                            <Text style={styles.modalText}>Đơn vị: {selectedMedicine1.unit}</Text>
                            <Text style={styles.modalText}>Giá: {selectedMedicine1.price} VNĐ</Text>
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
        </ScrollView>
        </>
    );
}
export default CreatePresciption;
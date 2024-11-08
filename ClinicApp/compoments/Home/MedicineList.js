import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import MedicineDetail from "./MedicineDetail";
import styleMedicine from "./styleMedicine";
import { MyUserContext } from "../../configs/Context";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { Modal } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { MyContext } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MedicineList = () => {
    const { renderCallButton } = useContext(MyContext);
    const [show, setShow] = useState(false);
    const nav = useNavigation()
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [medicine, setMedicine] = useState([]);
    const user = useContext(MyUserContext);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [quantity, setQuantity] = useState(1); 
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);

    const openQuantityModal = (medicine) => {
        setSelectedMedicine(medicine);
        setQuantity(1); 
        setModalVisible(true);
    };

    const handleView = (medicine) => {
        loadMedicineDetail(medicine)
        setShow(true);
    };

    const handleBack = () => {
        setShow(false);
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = await AsyncStorage.getItem("token");

                if (!token) {
                    Alert.alert("Error", "No access token found.");
                    return;
                }
                let res = await authApi(token).get(endpoints['cart-user']);
                setCartItems(res.data);
                const totalQuantity = res.data.reduce((total, item) => total + item.quantity, 0);
                setCartCount(totalQuantity);

            } catch (error) {
                Alert.alert("VítalCare Clinic", "Không thể tải giỏ hàng");
            }
        };

        fetchCart();
    }, [user]);

    const loadMedicine = async () => {
        setLoading(true);
        try {
            let url = `${endpoints['medicine']}?page=${page}`;
            let res = await APIs.get(url)
            if (res.data.next === null) {
                setPage(0);
                setMore(false);
            }
            if (page === 1) {
                setMedicine(res.data.results);
            } else {
                setMedicine(current => {
                    return [...current, ...res.data.results];
                });
            }
        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Bị lỗi khi loading thuốc.")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMedicine();
    }, [page, user]);

    const moreMedicine = () => {
        setPage(page + 1);
    }

    const loadMedicineDetail = async (medicine) => {
        setLoading(true)
        try {
            let res = await APIs.get(endpoints['medicineDetail'](medicine.id))
            setSelectedMedicine(res.data)
        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Loading thông tin thuốc lỗi.")
        } finally {
            setLoading(false);
        }
    }

    const addToCart = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).post(endpoints['cart'], {
                medicine_id: selectedMedicine.id,
                quantity: quantity  
            });
            if (res.status === 200) {
                Alert.alert("VítalCare Clinic", "Thuốc đã được thêm vào giỏ hàng.");
                setCartCount(prevCount => prevCount + quantity);  
                setModalVisible(false);  
            }

        } catch (error) {
            Alert.alert("VítalCare Clinic", "Không thể thêm thuốc vào giỏ hàng");
        }
    };

    if (show && selectedMedicine) {
        return <MedicineDetail medicine={selectedMedicine} onBack={handleBack} />;
    }

    const adjustQuantity = (change) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + change)); 
    };

    return (
        <View style={{ marginBottom: 30 }}>
            {user.role === 'patient' ?
                <View style={MyStyles.headerList}>
                    <TouchableOpacity onPress={() => nav.navigate("Home")}>
                        <FontAwesome name="arrow-left" size={24} color="#835741" />
                    </TouchableOpacity>

                    <View>
                        <Text style={MyStyles.titleList}>Thực Phẩm Chức Năng</Text>
                    </View>

                    <TouchableOpacity onPress={() => nav.navigate("CartScreen")}>
                        <View style={{ position: "relative" }}>
                            <FontAwesome name="cart-plus" size={24} color="#835741" />
                            {cartCount >= 0 && (
                                <View style={styleMedicine.cartBadge}>
                                    <Text style={styleMedicine.cartBadgeText}>{cartCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
                :
                <View style={MyStyles.headerList}>
                    <TouchableOpacity onPress={() => nav.navigate("HomeDoctor")}>
                        <FontAwesome name="arrow-left" size={24} color="#835741" />
                    </TouchableOpacity>

                    <View>
                        <Text style={MyStyles.titleList}>Thực Phẩm Chức Năng</Text>
                    </View>

                    <TouchableOpacity onPress={() => renderCallButton()}>
                        <FontAwesome name="phone" size={24} color="#835741" />
                    </TouchableOpacity>
                </View>
            }
            <View style={styleMedicine.searchContainerList}>
                <TextInput
                    style={styleMedicine.searchInputList}
                    placeholder="Nhập tên thực phẩm cần tìm"
                />
                <FontAwesome name="search" size={24} color="#835741" />
            </View>

            <ScrollView style={styleMedicine.list}>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {medicine.map(item => (
                        <View style={styleMedicine.card} key={item.id}>
                            <View style={{ alignSelf: 'center' }}>
                                <Image source={{ uri: item.image }} style={styleMedicine.image} />
                            </View>
                            <View style={styleMedicine.details}>
                                <Text style={styleMedicine.name}>{item.name.length > 30 ? `${item.name.substring(0, 25)}...` : item.name}</Text>
                                <Text style={styleMedicine.price}>{item.price}đ / SP</Text>
                                <TouchableOpacity style={{ flexDirection: 'row', marginTop: 7 }} onPress={() => handleView(item)}>
                                    <FontAwesome name="info-circle" size={20} color='#835741' />
                                    <Text style={styleMedicine.type}>Chi tiết</Text>
                                </TouchableOpacity>
                                {user.role === 'patient' ?
                                    <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }} onPress={() => openQuantityModal(item)}>
                                        <FontAwesome name="cart-plus" size={20} color='#835741' />
                                        <Text style={styleMedicine.type}>Thêm vào giỏ</Text>
                                    </TouchableOpacity>
                                    : null}
                            </View>
                        </View>
                    ))}
                </View>


                <TouchableOpacity onPress={moreMedicine}>
                    <Text style={MyStyles.bonusMore}>{more === true ? 'Xem thêm' : ''}</Text>
                </TouchableOpacity>
            </ScrollView>
            {modalVisible && (
                <Modal transparent={true} animationType="fade" visible={modalVisible}>
                    <View style={MyStyles.modalOverlay}>
                        <View style={MyStyles.modalView}>
                            <View style={{ borderWidth: 1, borderColor: '#835741', borderRadius: 5, marginLeft: 220, paddingVertical: 3, paddingHorizontal: 3 }}>
                                <FontAwesome name="close" size={20} style={{ color: '#835741' }} onPress={() => setModalVisible(false)} />
                            </View>
                            <Image source={{ uri: selectedMedicine.image }} style={MyStyles.image} />
                            <Text style={MyStyles.modalTitle}>{selectedMedicine.name}</Text>
                            <Text style={MyStyles.modalTitle}>Chọn số lượng</Text>
                            <View style={MyStyles.quantityContainer}>
                                <TouchableOpacity onPress={() => adjustQuantity(-1)}>
                                    <FontAwesome name="minus-circle" size={20} color="#835741" />
                                </TouchableOpacity>
                                <Text style={MyStyles.quantityText}>{quantity}</Text>
                                <TouchableOpacity onPress={() => adjustQuantity(1)}>
                                    <FontAwesome name="plus-circle" size={20} color="#835741" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={addToCart} style={MyStyles.buttonRecord}>
                                <Text style={MyStyles.closeButtonText}>Thêm vào giỏ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
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
            )}
        </View>

    );

}

export default MedicineList;
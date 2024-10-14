import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../../App";
import MyStyles from "../../styles/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./styles";
import style from "../Notification/style";
import { ActivityIndicator, DataTable } from "react-native-paper";
import { MyUserContext } from "../../configs/Context";
import { Image } from "react-native";

const CartScreen = () => {
    const [cartItems, setCartItems] = useState([]);
    const user = useContext(MyUserContext);
    const { renderCallButton } = useContext(MyContext);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['cart-user']);
            setCartItems(res.data);
            // console.info(res.data)
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tải giỏ hàng");
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const deleteItem = async (item) => {
        setLoading()
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).delete(endpoints['delete-item'](item))
            if (res.status === 200) {
                Alert.alert('VítalCare Clinic', "Đã xóa sản phẩm khỏi giỏ hàng.")
                fetchCart();
            } else {
                Alert.alert("VítalCare Clinic", "Không tìm thấy sản phẩm.")
            }
        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Không tìm thấy sản phẩm.")
        } finally {
            setLoading(false)
        }
    }

    // Hàm để thanh toán hóa đơn
    const handlePayment = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).post(endpoints['cart-invoice']);
            if( res.status === 200){
                Alert.alert("Thành công", "Thanh toán thành công",
                    [
                        {
                          text: "Không",
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => {
                            nav.navigate("InvoiceDetail", { "invoiceId": res.data.invoice_id })
                          },
                        },
                      ],
                      { cancelable: false }
                );
                setCartItems([]);  // Xóa giỏ hàng sau khi thanh toán
            }
        } catch (error) {
            Alert.alert("Lỗi", "Không thể thanh toán");
        }
    };

    return (
        <View>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={() => nav.navigate("MedicineList")}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={[MyStyles.titleList]}>Giỏ Hàng</Text>
                </View>
                <TouchableOpacity onPress={() => renderCallButton()}>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 10 }}>
                <Text style={styles.newsText}>Giỏ Hàng</Text>
                <DataTable>
                    <DataTable.Header style={style.tableHeader}>
                        <DataTable.Title style={style.tableTitle1}>Tên Thuốc</DataTable.Title>
                        <DataTable.Title style={style.tableTitle3}>SL</DataTable.Title>
                        <DataTable.Title style={style.tableTitle2}>Giá</DataTable.Title>
                        <DataTable.Title style={{ flerror: 0.5 }}></DataTable.Title>
                    </DataTable.Header>
                    {cartItems.map((medicine) => (
                        <DataTable.Row key={medicine.id} style={style.tableRow}>
                            <DataTable.Cell style={style.tableTitle1}>{medicine.medicine.name}</DataTable.Cell>
                            <DataTable.Cell style={style.tableCell3}>{medicine.quantity}</DataTable.Cell>
                            <DataTable.Cell style={style.tableTitle2}>{medicine.get_total_price}</DataTable.Cell>
                            <DataTable.Cell style={{ flerror: 0.5 }}>
                                <FontAwesome
                                    name="trash-o"
                                    size={15}
                                    color="#835741"
                                    style={{ marginLeft: 10 }}
                                    onPress={() => deleteItem(medicine.id)}
                                />
                            </DataTable.Cell>

                        </DataTable.Row>
                    ))}
                </DataTable>
                <TouchableOpacity style={styles.closeButton} onPress={handlePayment}>
                    <Text style={styles.closeButtonText}>Thanh Toán</Text>
                </TouchableOpacity>
            </View>
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
};

export default CartScreen;

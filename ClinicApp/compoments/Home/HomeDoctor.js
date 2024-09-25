import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    View, Text, Image, TextInput, StyleSheet, ScrollView,
    Animated, Dimensions, TouchableOpacity, Modal,
    FlatList
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import styles from "./styles";
import { MyUserContext } from "../../configs/Context";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Doctor from "../Doctor/Doctor";
import MyStyles from "../../styles/MyStyles";
import { ActivityIndicator } from "react-native-paper";

const HomeDoctor = () => {
    const nav = useNavigation()
    const user = useContext(MyUserContext);
    const { width } = Dimensions.get('window');
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [patient, setPatient] = useState({});
    const [banners1, setBanners] = useState([])
    const [medicine, setMedicine] = useState([]);
    const [doctor, setDoctor] = useState(null);
    const [nurse, setNurse] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleView = (doctor) => {
        loadDoctorDetail(doctor)
        setShow(true);
    };

    const handleBack = () => {
        setShow(false);
    };

    const loadNew = async () => {
        try {
            let res = await APIs.get(endpoints['new'])
            const newBanners = res.data.map(image => ({ url: image.image }));
            setBanners(newBanners);
        } catch (ex) {
            Alert.alert("Trang chủ", "Bị lỗi.")
        }
    }

    const loadMedicine = async () => {
        try {
            let res = await APIs.get(endpoints['medicine'])
            setMedicine(res.data.results)
        } catch (ex) {
            Alert.alert("Trang chủ", "Bị lỗi khi loading thuốc.")
        }
    }

    const loadInfo = async () => {
        try {
            if (user.role === 'doctor') {
                const token = await AsyncStorage.getItem("token");

                if (!token) {
                    Alert.alert("Error", "No access token found.");
                    return;
                }
                let res = await authApi(token).get(endpoints['doctor-info'])
                setDoctor(res.data)
                console.info(doctor)
            } if (user.role === 'nurse') {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    Alert.alert("Error", "No access token found.");
                    return;
                }
                let res = await authApi(token).get(endpoints['nurse-info'])
                setNurse(res.data)
                console.info(nurse)
            }
        } catch (ex) {
            console.error(ex)
        }
    }

    const loadDoctorDetail = async (doctor) => {
        setLoading(true)
        try{
            let res = await APIs.get(endpoints['doctorDetail'](doctor.id))
            setSelectedDoctor(res.data)
            
        }catch(ex){
            Alert.alert("Thông báo", "Loading thông tin bác sĩ lỗi.")
        }finally{
            setLoading(false);
        }
    }

    

    useEffect(() => {
        loadNew();
        loadMedicine();
        loadInfo()
    }, [user]);

    // useEffect(() => {
    //     if (user && user.id) {
    //         loadInfo()
    //     }
    // }, [user.id, user.role])
    

    const goToNextPage = () => {
        let nextIndex = Math.ceil(scrollX._value / width) + 1;
        if (nextIndex === banners1.length) {
            nextIndex = 0; // Quay lại hình đầu tiên khi đến cuối
        }
        scrollViewRef.current?.scrollTo({
            x: nextIndex * width,
            animated: true,
        });
    };

    const goToPreviousPage = () => {
        scrollViewRef.current?.scrollTo({
            x: (Math.floor(scrollX._value / width) - 1) * width,
            animated: true,
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            goToNextPage();
        }, 5000);

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    
    if (show && selectedDoctor) {
        return <Doctor doctor={selectedDoctor} onBack={handleBack} />;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={{flex: 1}}>
                    {user.role === 'doctor' ? (
                        <Text style={styles.username}>{doctor?.first_name} {doctor?.last_name}</Text>
                    ) : user.role === 'nurse' ? (
                        <Text style={styles.username}>{nurse?.first_name} {nurse?.last_name}</Text>
                    ) :
                        <Text style={styles.username}>{user.username}</Text>
                    }
                    <Text style={styles.email}>{user.email}</Text>
                </View>
                <Image
                    source={{ uri: user.avatar}} // Đường dẫn đến ảnh avatar
                    style={styles.avatar}
                />
            </View>

            <View style={styles.iconGrid}>
                <TouchableOpacity style={styles.iconBox} onPress={() => nav.navigate('Appointment')}>
                    <FontAwesome name='stethoscope' size={25} color="#835741" />
                    <Text>Danh sách</Text>
                    <Text>lịch khám</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBox}>
                    <FontAwesome name='users' size={25} color="#835741" />
                    <Text>Danh sách</Text>
                    <Text>bệnh nhân</Text>
                </TouchableOpacity>
                {user.role === 'doctor' ?
                <TouchableOpacity style={styles.iconBox}
                    onPress={() => handleView(doctor)}>
                    <FontAwesome name='user-md' size={25} color="#835741" />
                    <Text>Thông tin</Text>
                    <Text>bác sĩ</Text>
                </TouchableOpacity>
                : 
                <TouchableOpacity style={styles.iconBox}
                    onPress={() => nav.navigate("Nurse")}>
                    <FontAwesome name='user-md' size={25} color="#835741" />
                    <Text>Thông tin</Text>
                    <Text>y tá</Text>
                </TouchableOpacity>
                }
            </View>

            <View style={{ position: 'relative' }}>
                <TouchableOpacity
                    style={styles.leftArrow}
                    onPress={goToPreviousPage}>
                    <FontAwesome name='chevron-left' size={25} color="white" />
                </TouchableOpacity>

                <Animated.ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                >
                    {banners1.map((banner, index) => (
                        <TouchableOpacity key={index} style={{ width }}>
                            <Image source={{ uri: banner.url }} style={styles.imageBanner} />
                        </TouchableOpacity>
                    ))}
                </Animated.ScrollView>

                <TouchableOpacity
                    style={styles.rightArrow}
                    onPress={goToNextPage}>
                    <FontAwesome name='chevron-right' size={25} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.indicatorContainer}>
                {banners1.map((_, index) => {
                    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.8, 1.4, 0.8],
                        extrapolate: 'clamp',
                    });
                    return <Animated.View key={index} style={[styles.indicator, { transform: [{ scale }] }]} />;
                })}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.categoryText}>Thực phẩm chức năng</Text>
                <TouchableOpacity onPress={() => nav.navigate("MedicineList")}>
                    <Text style={styles.seeAll}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.categoryContainer}>
                {medicine.map(item => (
                    <TouchableOpacity
                        style={styles.medicineBox}
                        onPress={() => {
                            setSelectedMedicine(item);
                            setModalVisible(true);
                        }}
                    >
                        <Image source={{ uri: item.image }} style={styles.drugImage} />
                        <Text style={styles.drugName}>{item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
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
                                <Image source={{ uri: selectedMedicine.image }} style={styles.modalImage} />
                                <Text style={styles.modalTitle}>{selectedMedicine.name}</Text>
                                <Text style={styles.modalText}>Đơn vị: {selectedMedicine.unit}</Text>
                                <Text style={styles.modalText}>Giá: {selectedMedicine.price} VNĐ</Text>
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {loading && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={loading}
                >
                    <View style={MyStyles.loadingContainer}>
                        <View style={MyStyles.overlay} />
                        <View style={MyStyles.logoContainer}>
                            <Image source={{uri: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1726585796/logo1.png'}} style={MyStyles.logo} />
                        </View>
                        <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                </Modal>
            )}
        </ScrollView>
        // </ImageBackground>
    )

}

export default HomeDoctor;
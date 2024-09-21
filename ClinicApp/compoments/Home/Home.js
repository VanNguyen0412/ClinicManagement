import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView, ImageBackground,
     Animated, Dimensions, TouchableOpacity, 
     FlatList,
     Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from "@expo/vector-icons";
import styles from "./styles";
import { Modal } from "react-native";
import { MyUserContext } from "../../configs/Context";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import moment from "moment";

const Home = ({route}) => {
    const nav = useNavigation()
    const { width } = Dimensions.get('window');
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);
    const [open,setOpen] =useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const user = useContext(MyUserContext);
    const [patient, setPatient] = useState({});
    const [banners1, setBanners] = useState([])
    const [medicine, setMedicine] = useState([]);

    const openPatient = () => {
        nav.navigate("CreatePatient")
        setOpen(!open)
    }

    const getPatient = async () => {
        try{
            if (user && user.id) {
                let url = `${endpoints['current-patient']}?user=${user.id}`;
                const res = await APIs.get(url);
                setPatient(res.data);
            }
            // console.info(patient)
        }catch(ex){
            Alert.alert("Trang chủ", "Bị lỗi loading.")
        }
    }
    useEffect(()=>{
        if (user && user.id) {
            getPatient();
        }
    },[user.id])

    const loadNew = async () => {
        try{
            let res = await APIs.get(endpoints['new'])
            const newBanners = res.data.map(image => ({ url: image.image }));
            setBanners(newBanners);
        }catch(ex){
            Alert.alert("Trang chủ", "Bị lỗi.")
        }
    }
    

    const loadMedicine = async () => {
        try{
            // let url = `${endpoints['outlines']}?page=${page}`;
            let res = await APIs.get(endpoints['medicine'])
            setMedicine(res.data.results)
            // console.info(medicine)
        }catch(ex){
            Alert.alert("Trang chủ", "Bị lỗi khi loading thuốc.")
        }
    }

    useEffect(()=> {
        loadNew();
        loadMedicine();
    }, [user]);
    
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


    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => setOpen(!open)}>
                    <Text style={styles.username}>{patient.first_name? `${patient.first_name} ${patient.last_name}` : user.username }</Text>
                    <Text style={styles.email}>{user.email}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nav.navigate('Profile')}>
                    <Image
                    source={{ uri: user.avatar}} // Đường dẫn đến ảnh avatar
                    style={styles.avatar}
                    />
                </TouchableOpacity>
                
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoBox}>
                <Text>Chiều cao</Text>
                <TextInput style={styles.input} placeholder="..." keyboardType="numeric"/>
                </View>
                <View style={styles.infoBox}>
                <Text>Cân nặng</Text>
                <TextInput style={styles.input} placeholder="..." keyboardType="numeric"/>
                </View>
                <View style={styles.infoBox}>
                <Text>BMI</Text>
                <TextInput style={styles.input} placeholder="..." keyboardType="numeric"/>
                </View>
            </View>

            <View style={styles.iconGrid}>
                <TouchableOpacity style={styles.iconBox}>
                    <FontAwesome name='stethoscope' size={25} color="#835741" />
                    <Text>Kết quả</Text>
                    <Text>khám bệnh</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBox} onPress={() => nav.navigate("ListDoctor")}>
                    <FontAwesome name='user-md' size={25} color="#835741" />
                    <Text>Danh sách</Text>
                    <Text> bác sĩ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBox}>
                    <FontAwesome name='heartbeat' size={25} color="#835741" />
                    <Text>Theo dõi</Text>
                    <Text>sức khỏe</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBox}>
                    <FontAwesome name='money' size={25} color="#835741" />
                    <Text>Thanh toán</Text>
                    <Text>hóa đơn</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBox}>
                    <FontAwesome name='file-archive-o' size={25} color="#835741" />
                    <Text>Hồ sơ</Text>
                    <Text>bệnh nhân</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconBox} onPress={() => {nav.navigate("RegisterAppointment")}}>
                    <FontAwesome name='calendar' size={25} color="#835741" />
                    <Text>Đăng ký</Text>
                    <Text>lịch khám</Text>
                </TouchableOpacity>
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
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
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
            {open && (
                <Modal
                animationType="slide"
                transparent={true}
                visible={open}
                onRequestClose={() => {
                    setOpen(!open);
                }}>
                <View style={styles.modalOverlay}>
                <View style={styles.modalPateint}>
                    <View style={{borderWidth: 1, borderColor: '#835741', borderRadius:5, marginLeft: 245, paddingVertical: 3, paddingHorizontal: 3}}>
                    <FontAwesome name="close" size={20} style={{color: '#835741' }} onPress={() => setOpen(false)}/>
                    </View>
                    <TouchableOpacity
                        style={styles.createRecord}
                        onPress={openPatient}>
                        <Text style={styles.closeButtonText}>
                        {patient.first_name? 'Chỉnh Sửa Hồ Sơ' : 'Tạo Hồ Sơ Bệnh Nhân'}
                            </Text>
                            <FontAwesome name="angle-right" size={20} color= '#835741' />
                    </TouchableOpacity>
                    
                </View>
                </View>
            </Modal>
            )}
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
                            <Text style={styles.modalText1}>{selectedMedicine.price}đ / Sản Phẩm</Text>
                            <Text style={styles.modalText}>Ngày hết hạn: {moment(selectedMedicine.exp_date).format('Do MMMM, YYYY')}</Text>
                            <Text style={styles.modalText}>Ngày sản xuất: {moment(selectedMedicine.mfg_date).format('Do MMMM, YYYY')}</Text>
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
            
    </ScrollView>
    // </ImageBackground>
    )

}

export default Home;
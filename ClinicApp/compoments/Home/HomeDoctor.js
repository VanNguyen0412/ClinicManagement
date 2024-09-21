import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView,
     Animated, Dimensions, TouchableOpacity, Modal,
     FlatList} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import styles from "./styles";
import { MyUserContext } from "../../configs/Context";

const HomeDoctor = () => {
    const nav = useNavigation()
    const user = useContext(MyUserContext);
    const { width } = Dimensions.get('window');
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    const medicine = [{
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
        
    ]
    
    const renderItem = ({ item }) => {
        return (
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
        );
    };
    const banners = [
        { url: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032708/1.jpg' },
        { url: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032898/2.jpg' },
        { url: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032954/3.jpg' },
        { url: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721033011/4.jpg' },
        { url: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721033093/5.jpg' }
    ];


    const goToNextPage = () => {
        let nextIndex = Math.ceil(scrollX._value / width) + 1;
        if (nextIndex === banners.length) {
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
        // <ImageBackground source={require('./images/Clinic.png')}>
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.email}>email@example.com</Text>
                </View>
                <Image
                source={require('./images/Clinic.png')} // Đường dẫn đến ảnh avatar
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
                <TouchableOpacity style={styles.iconBox} 
                    onPress={() => nav.navigate("Doctor")}>
                    <FontAwesome name='user-md' size={25} color="#835741" />
                    <Text>Thông tin</Text>
                    <Text>bác sĩ</Text>
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
                        {banners.map((banner, index) => (
                            <TouchableOpacity key={index} style={{ width }} onPress={() => nav.navigate("Home")}>
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
                    {banners.map((_, index) => {
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
            <Text style={styles.seeAll}>Xem tất cả</Text>
            </View>
            <View style={styles.categoryContainer}>
                <FlatList
                    data={medicine}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    numColumns={2} // Hiển thị hai cột
                />
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
            
    </ScrollView>
    // </ImageBackground>
    )

}

export default HomeDoctor;
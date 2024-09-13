import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ScrollView, ImageBackground,
     Animated, Dimensions, TouchableOpacity, 
     FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from "@expo/vector-icons";
import styles from "./styles";
import { Modal } from "react-native";

const Home = () => {
    const nav = useNavigation()
    const { width } = Dimensions.get('window');
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);
    const [open,setOpen] =useState(false)

    const medicine = [{
        name: "Enat 400 IU điều trị và dự phòng tình trạng thiếu vitamin E",
        image: "https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032708/1.jpg",
        },
        {
            name: "Viên uống Blackmores Cholesterol Health hỗ trợ giảm cholesterol (Hộp 60 viên)",
            image: "https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032898/2.jpg",
        },
        {
            name: "Viên uống DHC DHA bổ sung DHA, EPA, hỗ trợ giảm mỡ máu (120 viên)",
            image: "https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032954/3.jpg",
        },
        {
            name: "Viên uống DHC DHA bổ sung DHA, EPA, hỗ trợ giảm mỡ máu (120 viên)",
            image: "https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032954/3.jpg",
        },
        
    ]
    const renderItem = ({ item }) => {
        // Rút ngắn tên thuốc nếu quá dài
        const shortName = item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name;
    
        return (
          <View style={styles.medicineBox}>
            <Image source={{ uri: item.image }} style={styles.drugImage} />
            <Text style={styles.drugName}>{shortName}</Text>
          </View>
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
                <TouchableOpacity onPress={() => setOpen(true)}>
                    <Text style={styles.username}>Tên Người Dùng</Text>
                    <Text style={styles.email}>email@example.com</Text>
                </TouchableOpacity>
                <Image
                source={require('./images/Clinic.png')} // Đường dẫn đến ảnh avatar
                style={styles.avatar}
                />
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoBox}>
                <Text>Chiều cao</Text>
                <TextInput style={styles.input} placeholder="..." />
                </View>
                <View style={styles.infoBox}>
                <Text>Cân nặng</Text>
                <TextInput style={styles.input} placeholder="..." />
                </View>
                <View style={styles.infoBox}>
                <Text>BMI</Text>
                <TextInput style={styles.input} placeholder="..." />
                </View>
            </View>

            <View style={styles.iconGrid}>
                <View style={styles.iconBox}>
                    <FontAwesome name='stethoscope' size={25} color="#835741" />
                    <Text>Kết quả</Text>
                    <Text>khám bệnh</Text>
                </View>
                <View style={styles.iconBox}>
                    <FontAwesome name='user-md' size={25} color="#835741" />
                    <Text>Danh sách</Text>
                    <Text> bác sĩ</Text>
                </View>
                <View style={styles.iconBox}>
                    <FontAwesome name='heartbeat' size={25} color="#835741" />
                    <Text>Theo dõi</Text>
                    <Text>sức khỏe</Text>
                </View>
                <View style={styles.iconBox}>
                    <FontAwesome name='money' size={25} color="#835741" />
                    <Text>Thanh toán</Text>
                    <Text>hóa đơn</Text>
                </View>
                <View style={styles.iconBox}>
                    <FontAwesome name='file-archive-o' size={25} color="#835741" />
                    <Text>Hồ sơ</Text>
                    <Text>bệnh nhân</Text>
                </View>
                <View style={styles.iconBox}>
                    <FontAwesome name='calendar' size={25} color="#835741" />
                    <Text>Đăng ký</Text>
                    <Text>lịch khám</Text>
                </View>
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
                            <View key={index} style={{ width }}>
                                <Image source={{ uri: banner.url }} style={styles.imageBanner} />
                            </View>
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
            {open && (
                <Modal
                animationType="slide"
                transparent={true}
                visible={open}
                onRequestClose={() => {
                    setOpen(!open);
                }}>
                    <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <View style={{borderWidth: 1, borderColor: '#835741', borderRadius:5, marginLeft: 225, paddingVertical: 3, paddingHorizontal: 3}}>
                    <FontAwesome name="close" size={20} style={{color: '#835741' }} onPress={() => setOpen(false)}/>
                    </View>
                    <TouchableOpacity
                        style={styles.createRecord}
                        onPress={() => nav.navigate("CreatePatient")}>
                        <Text style={styles.closeButtonText}>
                            Tạo Hồ Sơ Cá Nhân
                            </Text>
                            <FontAwesome name="angle-right" size={20} />
                    </TouchableOpacity>
                    
                </View>
                </View>
            </Modal>
            )}
            
    </ScrollView>
    // </ImageBackground>
    )

}

export default Home;
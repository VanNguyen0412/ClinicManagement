import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import styles from './styles';
import { FlatList } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import APIs, { endpoints } from '../../configs/APIs';
import { Modal } from 'react-native';
import { ActivityIndicator, Avatar } from 'react-native-paper';
import moment from 'moment';
import { MyUserContext } from '../../configs/Context';
import RatingDetail from './RatingDetail';

const Doctor = ({ doctor, onBack }) => {
    const [showMore, setShowMore] = useState(false);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const [ratings, setRating] = useState({});
    const user = useContext(MyUserContext)
    const [showRating, setShowRating] = useState(false);
    const [doctorId, setDoctorId] = useState(0);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };
    const loadRatingDetail = async () => {
        setLoading(true)
        try {
            let res = await APIs.get(endpoints['doctorRating'](doctor.id))
            setRating(res.data.results)
            // console.log(rating)
        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Loading thông tin đánh giá lỗi.")
            console.log(ex)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRatingDetail();
    }, [doctor.id])

    const RatingItem = ({ item }) => {
        const renderStars = (starCount) => {
            const stars = [];
            for (let i = 1; i <= 5; i++) {
                stars.push(
                    <FontAwesome
                        key={i}
                        name={i <= starCount ? 'star' : 'star-o'}
                        size={16}
                        color="#FFA500"
                    />
                );
            }
            return stars;
        };
        return (
            <View style={styles.card}>

                <Text style={styles.patientName}>{item.patient.first_name} {item.patient.last_name}</Text>
                <View style={styles.starContainer}>{renderStars(item.star)}</View>
                {/* </View> */}
                <Text style={styles.content}>{item.content}</Text>
            </View>
        );
    };

    

    const handleShowRating = (id) => {
        setDoctorId(id)
        setShowRating(true)
    }

    const handleBackRating = () => {
        setShowRating(false)
    }

    if (showRating){
        return <RatingDetail doctorId={doctorId} onBack={handleBackRating} />
    }


    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Thông Tin Bác Sĩ</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>


            <View style={styles.container} key={doctor.id}>
                <ScrollView style={styles.profileContainer}>
                    <View style={styles.infoBox}>
                        <Image
                            source={{ uri: doctor?.user.avatar }} // Thay bằng link hình ảnh bác sĩ
                            style={styles.avatar} />
                        <Text style={styles.doctorName}>BS. {doctor.first_name} {doctor.last_name}</Text>
                        <View style={styles.ratingContainer}>
                            <Rating
                                startingValue={doctor.average_rating}
                                readonly
                                imageSize={20}
                                style={styles.rating}
                            />
                            <Text style={styles.reviewCount}>({doctor.total_ratings})</Text>
                        </View>
                        <View style={styles.details}>
                            <View style={styles.detailItem}>
                                <FontAwesome name="graduation-cap" size={18} style={styles.toggleText} />
                                <Text style={styles.detailText}>{doctor.position} - {doctor.qualifications}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <FontAwesome name="briefcase" size={18} style={styles.toggleText} />
                                <Text style={styles.detailText}>{doctor.experience_years} năm kinh nghiệm</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <FontAwesome name="hospital-o" size={20} style={styles.toggleText} />
                                <Text style={styles.detailText}>PKĐK VítalCare Clinic</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.sectionTitle}>Chuyên khoa</Text>
                    <View style={[styles.margin]}>
                        <FontAwesome name="stethoscope" size={22} color='#8B4513' />
                        <Text style={{fontFamily: 'serif'}} >{doctor.expertise}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Giới thiệu</Text>
                    <Text style={styles.introduction}>{doctor.description}</Text>
                    {showMore && (
                        <><Text style={styles.introduction}>Năm sinh: {moment(doctor.birthdate).format('Do MMMM, YYYY')}.</Text>
                            <Text style={styles.introduction}>
                                Bác sĩ {doctor.last_name}, là một chuyên gia tại {doctor.expertise} với hơn {doctor.experience_years} năm kinh nghiệm.
                                Bác sĩ đã đạt {doctor.qualifications} và hiện là {doctor.position} tại phòng khám.
                                Với kiến thức chuyên môn sâu rộng và bề dày kinh nghiệm, bác sĩ {doctor.last_name}
                                đã đóng góp rất nhiều cho sự phát triển của phòng khám,
                                luôn tận tâm trong việc điều trị và chăm sóc sức khỏe cho bệnh nhân.
                            </Text></>
                    )}
                    <TouchableOpacity onPress={toggleShowMore}>
                        <FontAwesome name={showMore ? 'angle-double-up' : 'angle-double-down'} size={35} style={styles.toggleText} />
                    </TouchableOpacity>
                    <View style={styles.categoryContainer}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.sectionTitle}>Đánh giá</Text>
                            <TouchableOpacity onPress={() => handleShowRating(doctor.id)}>
                                <Text style={styles.seeAll}>Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={ratings}
                            renderItem={({ item }) => <RatingItem item={item} />}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={styles.row}
                        />
                    </View>
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
                )}
            </View>
        </>
    );
};


export default Doctor;
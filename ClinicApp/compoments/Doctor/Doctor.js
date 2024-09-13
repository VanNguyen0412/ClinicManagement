import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import styles from './styles';

const Doctor = () => {
    const [showMore, setShowMore] = useState(false);
    const nav = useNavigation()
    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const doctor = [
        { 
            id: 1, 
            first_name: 'Vũ Quốc', 
            last_name:'Bình', 
            expertise: 'Khoa Thần Kinh', 
            qualifications: 'Tiến sĩ', 
            experience_years: '12', 
            position: 'Phó Chủ nhiệm Khoa',
            birthdate: '1957-09-01',
            description: 'Tiến sĩ - Bác sĩ cao cấp -Thầy thuốc nhân dân Vũ Quốc Bình,' +
            'trưởng thành trong một gia đình truyền thống nghề y; ' +
            'TS Bình đã thi đỗ bác sĩ quân y vào năm 1974 và sau này là Bác sĩ nội trú Nội khoa.'
        }
    ]
    const { first_name, last_name, expertise, qualifications, experience_years, position, birthdate, description } = doctor[0];
    return (
        <>
        <View style={styles.header1}>
                <FontAwesome name="angle-left" size={35} style={{marginTop: 25}} onPress={() => nav.navigate('HomeDoctor')}/>
                <Text style={styles.title}>Thông Tin Bác Sĩ</Text>
        </View>
        <View style={styles.container}>
            <ScrollView style={styles.profileContainer}>
                <View style={styles.infoBox}>
                    <Image
                        source={{ uri: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1721032708/1.jpg' }} // Thay bằng link hình ảnh bác sĩ
                        style={styles.avatar}
                    />
                    <Text style={styles.doctorName}>BS. {first_name} {last_name}</Text>
                    <View style={styles.ratingContainer}>
                        <Rating
                        startingValue={5}
                        readonly
                        imageSize={20}
                        style={styles.rating}
                        />
                        <Text style={styles.reviewCount}>(41)</Text>
                    </View>
                    <View style={styles.details}>
                        <View style={styles.detailItem}>
                            <FontAwesome name="graduation-cap" size={20} style={styles.toggleText} />
                            <Text style={styles.detailText}>{position} - {qualifications}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <FontAwesome name="briefcase" size={20} style={styles.toggleText} />
                            <Text style={styles.detailText}>{experience_years} năm kinh nghiệm</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <FontAwesome name="hospital-o" size={20} style={styles.toggleText} />
                            <Text style={styles.detailText}>PKĐK Dr. Binh Tele_Clinic</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Chuyên khoa</Text>
                <View style={[styles.margin]}>
                    <FontAwesome name="stethoscope" size={22} color='#8B4513' />
                    <Text >{expertise}</Text>
                </View>
                
                <Text style={styles.sectionTitle}>Giới thiệu</Text>
                <Text style={styles.introduction}>{description}</Text>
                {showMore && (
                    <><Text style={styles.introduction}>Năm sinh: {birthdate}.</Text>
                    <Text style={styles.introduction}>
                        Bác sĩ {last_name}, là một chuyên gia tại {expertise} với hơn {experience_years} năm kinh nghiệm.
                        Bác sĩ đã đạt {qualifications} và hiện giữ vị trí {position} tại phòng khám.
                        Với kiến thức chuyên môn sâu rộng và bề dày kinh nghiệm, bác sĩ {last_name}  
                        đã đóng góp rất nhiều cho sự phát triển của phòng khám,
                        luôn tận tâm trong việc điều trị và chăm sóc sức khỏe cho bệnh nhân.
                    </Text></>
                )}
                <TouchableOpacity onPress={toggleShowMore}>
                    <FontAwesome name={showMore ? 'angle-double-up': 'angle-double-down'} size={35} style={styles.toggleText} />
                </TouchableOpacity>
 
            </ScrollView>
        </View>
        </>
    );
};


export default Doctor;
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Modal, Alert, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import MyStyles from '../../styles/MyStyles';
import { MyUserContext } from '../../configs/Context';
import APIs, { endpoints } from '../../configs/APIs';
import { ActivityIndicator } from 'react-native-paper';
import Doctor from './Doctor';

const ListDoctor = () => {
    const nav = useNavigation();
    const [doctors, setDoctor] = useState([]);
    const user1 = useContext(MyUserContext);
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [loading, setLoading] = useState(false);
    const [more, setMore] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [show, setShow] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadDoctor();
        setRefreshing(false);
    };

    const handleView = (doctor) => {
        loadDoctorDetail(doctor)
        setShow(true);
    };

    const handleBack = () => {
        setShow(false);
    };

    const loadDoctorDetail = async (doctor) => {
        setLoading(true)
        try {
            let res = await APIs.get(endpoints['doctorDetail'](doctor.id))
            setSelectedDoctor(res.data)

        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Loading thông tin bác sĩ lỗi.")
        } finally {
            setLoading(false);
        }
    }

    const loadDoctor = async () => {
        setLoading(true)
        try {
            let res = await APIs.get(endpoints['doctor'])
            setDoctor(res.data);
            if (data.length > 0) {
                setSelectedSpecialty(data[0].expertise);
            }
            console.info(selectedSpecialty)
        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Bị lỗi loading.")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDoctor();
    }, [user1]);

    const filteredDoctors = selectedSpecialty === 'all'
        ? doctors
        : doctors.filter(doctor => doctor.expertise === selectedSpecialty);

    const expertises = [...new Set(doctors.map(doctor => doctor.expertise))];

    if (show && selectedDoctor) {
        return <Doctor doctor={selectedDoctor} onBack={handleBack} />;
    }
    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={() => nav.navigate("Home")}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Danh Sách Bác Sĩ</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="filter" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <View style={styles.containerList}>
                <View style={styles.searchContainerList}>
                    <TextInput
                        style={styles.searchInputList}
                        placeholder="Nhập tên bác sĩ cần tìm"
                    />
                    <FontAwesome name="search" size={24} color="#835741" />
                </View>

                <View style={styles.tabsContainerList}>
                    <TouchableOpacity
                        style={selectedSpecialty === 'all' ? styles.tabList : styles.tabInactiveList}
                        onPress={() => setSelectedSpecialty('all')}
                    >
                        <Text style={styles.tabTextList}>Tất cả</Text>
                    </TouchableOpacity>
                    {expertises.map((exp) => (
                        <TouchableOpacity
                            key={exp}
                            style={selectedSpecialty === exp ? styles.tabList : styles.tabInactiveList}
                            onPress={() => setSelectedSpecialty(exp)}

                        >
                            <Text style={styles.tabTextList}>{exp}</Text>
                        </TouchableOpacity>
                    ))}


                </View>


                <ScrollView refreshControl={ // Thêm RefreshControl để làm mới khi kéo xuống
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                    {filteredDoctors.map((doctor) => (
                        <TouchableOpacity style={styles.cardList} key={doctor.id} onPress={() => handleView(doctor)}>
                            <Image source={{ uri: doctor?.user.avatar }} style={styles.avatarList} />
                            <View style={styles.cardInfoList}>
                                <Text style={styles.nameList}>{doctor.first_name} {doctor.last_name}</Text>
                                <View style={styles.ratingRowList}>
                                    <FontAwesome name="star" size={16} color="orange" />
                                    <Text style={styles.ratingList}>{doctor.average_rating}</Text>
                                    <Text style={styles.reviewsList}>({doctor.total_ratings})</Text>
                                </View>
                                <Text style={styles.positionList}>{doctor.position}</Text>
                                <Text style={styles.positionList}>{doctor.expertise}</Text>
                                <Text style={styles.locationList}>{doctor.qualifications}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity>
                        <Text style={MyStyles.bonusMore}>Xem thêm</Text>
                    </TouchableOpacity>
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



export default ListDoctor;

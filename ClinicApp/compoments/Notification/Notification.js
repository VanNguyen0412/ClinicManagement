import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import { FontAwesome } from "@expo/vector-icons";
import { MyUserContext } from '../../configs/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, endpoints } from '../../configs/APIs';
import { Modal } from 'react-native';
import { Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import NotificationDetail from './NotificationDetail';
import { ScrollView } from 'react-native';
import style from './style';

const Notification = () => {
    const [notifications, setNotications] = useState([]);
    const user = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const [refreshing, setRefreshing] = useState(false); // Trạng thái refresh
    const [show, setShow] = useState(false);
    const [noti, setNoti] = useState();



    const getType = (type) => {
        switch (type) {
            case 'medicine':
                return 'Thông báo toa thuốc';
            case 'general':
                return 'Thông báo chung';
            case 'appointment':
                return 'Thông báo lịch khám';
            default:
                return type;
        }
    };

    const loadNotifications = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['list-noti']);
            setNotications(res.data)
            // console.info(notifications)
        } catch (ex) {
            console.error(ex)
            Alert.alert("Thông báo", "Hiện thông tin lỗi");
        } finally {
            setLoading(false)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true); // Bắt đầu refresh
        await loadNotifications();
        setRefreshing(false); // Kết thúc refresh
    };

    useEffect(() => {
        loadNotifications();
    }, [user])

    const handleDetail = (notification) => {
        setNoti(notification.id);
        setShow(true);
    };

    const handleBack = () => {
        onRefresh()
        setShow(false);
    };

    if (show) {
        const notificationId = noti;
        return <NotificationDetail notificationId={notificationId} onBack={handleBack} />;
    }

    return (
        <>
            <View style={MyStyles.headerList}>

                <View>
                    <Text style={[MyStyles.titleList]}>Thông báo</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {notifications.map((item) => (
                    user.role === 'patient' ?
                        <TouchableOpacity onPress={() => handleDetail(item)}>
                            <View key={item.id} style={[style.notificationContainer, item.is_read ? style.read : style.unread]}>
                                <View style={style.header}>
                                    <Text style={style.typeText}>
                                        {item.type === 'medicine' ?
                                            '💊' : '📝'} {getType(item.type)}
                                    </Text>
                                    <Text style={style.dateText}>{new Date(item.created_date).toLocaleDateString()}</Text>
                                </View>
                                <Text style={style.contentText}>{item.content}</Text>
                            </View>
                        </TouchableOpacity>
                        : user.role === 'doctor' ?
                            <TouchableOpacity onPress={() => nav.navigate("Appointment")}>
                                <View key={item.id} style={[style.notificationContainer, item.is_read ? style.read : style.unread]}>
                                    <View style={style.header}>
                                        <Text style={style.typeText}>
                                            {item.type === 'medicine' ?
                                                '💊' : '📝'} {getType(item.type)}
                                        </Text>
                                        <Text style={style.dateText}>{new Date(item.created_date).toLocaleDateString()}</Text>
                                    </View>
                                    <Text style={style.contentText}>{item.content}</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => nav.navigate("Appointment")}>
                                <View key={item.id} style={[style.notificationContainer, item.is_read ? style.read : style.unread]}>
                                    <View style={style.header}>
                                        <Text style={style.typeText}>
                                            {item.type === 'medicine' ?
                                                '💊' : '📝'} {getType(item.type)}
                                        </Text>
                                        <Text style={style.dateText}>{new Date(item.created_date).toLocaleDateString()}</Text>
                                    </View>
                                    <Text style={style.contentText}>{item.content}</Text>
                                </View>
                            </TouchableOpacity>
                ))}
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
            )
            }
        </>

    );
};

export default Notification;

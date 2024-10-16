import React, { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MyUserContext } from '../../configs/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, endpoints } from '../../configs/APIs';
import { Modal } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { MyContext } from '../../App';

const NewDetail = ({ route }) => {
    const { id } = route.params;
    const {renderCallButton } = useContext(MyContext);

    const user = useContext(MyUserContext)
    const nav = useNavigation()
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadDetailNew = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['new-detail'](id))
            setDetail(res.data)
            // console.info(res.data)
        } catch (error) {
            Alert.alert("VítalCare Clinic", "Lỗi Loading")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDetailNew()
    }, [id])

    return (
        <>
            <View style={MyStyles.headerList}>
                {user.role === 'patient' ?
                    <TouchableOpacity onPress={() => nav.navigate("Home")}>
                        <FontAwesome name="arrow-left" size={24} color="#835741" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => nav.navigate("HomeDoctor")}>
                        <FontAwesome name="arrow-left" size={24} color="#835741" />
                    </TouchableOpacity>
                }

                <View>
                    <Text style={MyStyles.titleList}>Chi Tiết Tin Tức</Text>
                </View>
                <TouchableOpacity onPress={() => renderCallButton()}>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {detail === null ?
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
                    </Modal> :
                    <View style={{padding: 10}}>
                        <Image source={{ uri: detail.image }} style={styles.image} />
                        <Text style={styles.title}>{detail.title}</Text>
                        <Text style={styles.content}>{detail.content}</Text>
                        <Image source={{ uri: detail.image2 }} style={styles.image} />
                        <Text style={styles.content}>{detail.content2}</Text>
                        <Image source={{ uri: detail.image3 }} style={styles.image} />
                        <Text style={styles.date}>yanghara</Text>
                        <Text style={styles.date}>{new Date(detail.created_date).toLocaleDateString()}</Text>
                    </View>
                }

            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 10
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 15,
        color: '#333',
        fontFamily: 'serif'

    },
    content: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        fontFamily: 'serif',
        marginBottom: 10
    },
    date: {
        marginTop: 10,
        fontSize: 14,
        color: '#999',
        textAlign: 'right',
        fontFamily: 'serif'

    },
});

export default NewDetail;

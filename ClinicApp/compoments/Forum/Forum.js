import { View, Text, StyleSheet } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import moment from "moment";
import { Modal } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { TextInput } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "react-native";

const Forum = () => {
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleShow = () => {
        setShow(!show)
    }

    const loadForumData = async () => {
        setLoading(true)
        try {
            const response = await APIs.get(endpoints["forum"]); // Giả sử bạn có endpoint để lấy danh sách diễn đàn
            setForums(response.data); // Giả sử dữ liệu về diễn đàn từ API trả về
        } catch (error) {
            console.error("Error loading forum data:", error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        loadForumData();
    }, []);

    const picker = async () =>{
        let {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("ĐĂNG KÝ", "Không tải được ảnh!");
        else {
            let res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            
            if (!res.canceled)
                change(res.assets[0], 'avatar');
        }
    };

    return (
        <>
            <View style={MyStyles.headerList}>
                <View>
                    <Text style={MyStyles.titleList}>Diễn Đàn Câu Hỏi</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.container}>
                {!show && (
                    <TouchableOpacity style={styles.button} onPress={handleShow}>
                        <Text style={styles.buttonText1}>Thêm diễn đàn mới</Text>
                    </TouchableOpacity>
                )}

                {show && (
                    <View>
                        <Text style={styles.label}>Tiêu đề <Text style={{ color: 'red' }}>*</Text>:</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Nhập tiêu đề"
                        />

                        <Text style={styles.label}>Nội dung <Text style={{ color: 'red' }}>*</Text>:</Text>
                        <TextInput
                            style={styles.input}
                            value={content}
                            onChangeText={setContent}
                            placeholder="Nhập nội dung"
                        />
                        <TouchableOpacity onPress={picker}>
                            <Text style={styles.textAvatar}>Chọn hình ảnh</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonRecord} onPress={handleShow}>
                            <Text style={styles.buttonText}>Tạo mới</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {forums.map((forum, index) => (
                    <View key={index} style={styles.forumItem}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: forum.image }} style={styles.avatar} />
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.patientName}>{forum.patient.full_name}</Text>
                            <Text style={{ fontFamily: 'serif', fontSize: 13, marginBottom: 5, }} >{moment(forum.created_date).format('DD MMMM YYYY HH:mm:ss')}</Text>
                            <Text style={styles.titleText}>Tiêu đề: {forum.title}</Text>
                            <Text style={{ fontFamily: 'serif', }} >{forum.content.substring(0, 50)}...</Text>
                        </View>
                    </View>
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
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'serif'

    },
    forumItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 40,
        overflow: 'hidden',
        marginRight: 10,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    patientName: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'serif'

    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'serif'

    },
    moreText: {
        color: '#835741',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10,
        fontFamily: 'serif'

    },
    button: {
        backgroundColor: '#8B4513',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonRecord: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: '60%',
        alignSelf: 'center',
        borderColor: '#835741',
        borderWidth: 0.5,

    },
    buttonText1: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: 'serif'
    },
    buttonText: {
        color: '#835741',
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: 'serif'
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '600',
        fontFamily: 'serif'
    },
    input: {
        borderWidth: 1,
        borderColor: '#8B4513',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontFamily: 'serif',
    },
    textAvatar: {
        fontFamily: 'serif', 
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 10,
        color: '#835741'
    }
});
export default Forum;
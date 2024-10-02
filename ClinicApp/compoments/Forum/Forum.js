import { View, Text, StyleSheet, TextInput, Modal, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import moment from "moment";
import { ActivityIndicator, Menu, PaperProvider } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForumDetail from "./ForumDetail";
import { MyUserContext } from "../../configs/Context";
import styles from "./styles";

const Forum = () => {
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null)
    const [nav, setNav] = useState(false)
    const [detail, setDetail] = useState(null)
    const user = useContext(MyUserContext);
    const [visibleMenus, setVisibleMenus] = useState({});  
    const [update, setUpdate] = useState(false);

    const handleUpdate = async (forumId) => {
        setLoading(true)
        try{
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const formData = new FormData()
            formData.append('title', title)
            formData.append('content', content)
            let res = await authApi(token).patch(endpoints['forum-update'](forumId), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 200){
                Alert.alert("VítalCare Clinic", "Đã chỉnh sửa thành công")
            }else if (res.status === 400){
                Alert.alert("VítalCare Clinic", "Bạn không có quyền thực hiện điều này.")
            }
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

    const handleDelete = async (forumId) => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).delete(endpoints['forum-delete'](forumId))
            if (res.status === 204) {
                Alert.alert("VítalCare Clinic", "Đã xóa diễn đàn thành công.");
                loadForumData();
            } else {
                console.error("Error creating forum:", response.data);
                Alert.alert("Error", "Xóa diễn đàn bị lỗi!!!");
            }
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

    const handleMenuToggle = (index) => {
        setVisibleMenus((prev) => ({
            ...prev,
            [index]: !prev[index],  
        }));
    };
    
    const handleDismissMenu = (index) => {
        setVisibleMenus((prev) => ({
            ...prev,
            [index]: false,  
        }));
    };

    const handleDetail = (forumId) => {
        loadDetail(forumId)
        setNav(!nav)
    }

    const handleBackNav = () => {
        setNav(!nav)
    }

    const handleShow = () => {
        setShow(!show)
    }

    const loadForumData = async () => {
        setLoading(true)
        try {
            const response = await APIs.get(endpoints["forum"]);
            setForums(response.data);
        } catch (error) {
            console.error("Error loading forum data:", error);
        } finally {
            setLoading(false)
        }
    };



    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
                setImage(res.assets[0]);
        }
    };

    const handleCreate = async () => {
        if (!title || !content || !image ){
            Alert.alert("VítalCare Clinic", "Thiếu thông tin. Hãy điền đủ thông tin yêu cầu.")
        }
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const formData = new FormData()
            const filename = image.uri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const fileType = match ? `image/${match[1]}` : `image`;

            // formData.append('image', image)
            if (image) {
                formData.append('image', {
                    uri: image.uri,
                    name: filename,
                    type: fileType
                });
            }
            formData.append('title', title)
            formData.append('content', content)
            let res = await authApi(token).post(endpoints['create-forum'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status === 201) {
                Alert.alert("VítalCare Clinic", "Đã tạo diễn đàn thành công")
                setShow(!show)
                loadForumData()
            }else if (res.status === 400){
                Alert.alert("VítalCare Clinic", "Thiếu thông tin. Hãy điền đủ thông tin yêu cầu.")
            }

        } catch (error) {
            if (error.response) {
                console.error("Network error", error);
            }
        } finally {
            setLoading(false)
        }
    }

    const loadDetail = async (forumId) => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).get(endpoints['forum-detail'](forumId))
            setDetail(res.data)

        } catch (error) {
            if (error.response) {
                console.error(error)
                Alert.alert("VítalCare Clinic", "Bị lỗi khi load thông tin!");
            } else {
                console.error("Network error", error);
                Alert.alert("VítalCare Clinic", "Có lỗi xảy ra, vui lòng thử lại sau")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadForumData();
    }, [user]);


    if (nav && detail) {
        return <ForumDetail detail={detail} onBack={handleBackNav} />
    }

    return (
        <PaperProvider>
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
                            multiline
                            numberOfLines={4}
                            placeholder="Nhập nội dung"
                        />
                        <TouchableOpacity onPress={picker}>
                            <Text style={styles.textAvatar}>{image ? 'Chọn lại hình ảnh': 'Chọn hình ảnh'}</Text>
                        </TouchableOpacity>
                        {image && <Image source={{uri: image.uri}}  style={styles.image}/>}
                        <TouchableOpacity style={styles.buttonRecord} onPress={handleCreate}>
                            <Text style={styles.buttonText}>Tạo mới</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {forums.map((forum, index) => (
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <TouchableOpacity key={index} style={styles.forumItem} onPress={() => handleDetail(forum.id)}>
                            <View style={styles.avatarContainer}>
                                <Image source={{ uri: forum.image }} style={styles.avatar} />
                            </View>
                            <View style={styles.contentContainer}>
                                <Text style={styles.patientName}>{forum.patient.full_name}</Text>
                                <Text style={{ fontFamily: 'serif', fontSize: 13, marginBottom: 5, }} >{moment(forum.created_date).format('DD MMMM YYYY HH:mm:ss')}</Text>
                                <Text style={styles.titleText}>Tiêu đề: {forum.title}</Text>
                                <Text style={{ fontFamily: 'serif', }} >{forum.content.substring(0, 50)}...</Text>
                            </View>

                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.5 }}>
                            <Menu
                                visible={visibleMenus[index]}
                                onDismiss={() => handleDismissMenu(index)}
                                anchor={
                                    <TouchableOpacity onPress={() => handleMenuToggle(index)}>
                                        <FontAwesome name='ellipsis-v' size={20} color='#8B4513' />
                                    </TouchableOpacity>}>
                                <Menu.Item onPress={() => { }} title="Chỉnh sửa" leadingIcon="update" />
                                <Menu.Item onPress={() => handleDelete(index)} title="Xóa" leadingIcon="delete" />
                            </Menu>
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
        </PaperProvider>
    )
}

export default Forum;
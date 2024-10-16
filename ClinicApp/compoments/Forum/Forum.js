import { View, Text, StyleSheet, TextInput, Modal, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import moment from "moment";
import { ActivityIndicator, AnimatedFAB, Icon, Menu, PaperProvider } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForumDetail from "./ForumDetail";
import { MyUserContext } from "../../configs/Context";
import styles from "./styles";
import style from "../HealthMonitoring/style";
import ChatScreen from "../Chat/ChatSreen";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../Chat/firebaseConfig";
import { MyContext } from "../../App";

const Forum = () => {
    const {renderCallButton } = useContext(MyContext);
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
    const [editForumId, setEditForumId] = useState(null); // ID của diễn đàn đang chỉnh sửa
    const [patient, setPatient] = useState({});
    const [chat, setChat] = useState(false);
    const [chatId, setChatId] = useState(0);
    const [chatsList, setChatsList] = useState([]);
    const [viewingChats, setViewingChats] = useState(false);

    const getPatient = async () => {
        try {
            if (user && user.id && user.role === 'patient') {
                let url = `${endpoints['current-patient']}?user=${user.id}`;
                const res = await APIs.get(url);
                setPatient(res.data);
            }
            // console.info(patient)
        } catch (ex) {
            Alert.alert("VítalCare Clinic", "Bạn nên tạo thông tin cá nhân.")
        }
    }
    const handleUpdate = async (forumId) => {
        setLoading(true)
        try {
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

            if (res.status === 200) {
                Alert.alert("VítalCare Clinic", "Đã chỉnh sửa thành công")
                setEditForumId(null)
                loadForumData
            } else if (res.status === 400) {
                Alert.alert("VítalCare Clinic", "Bạn không có quyền thực hiện điều này.")
            }
        } catch (error) {
            console.error(error)
        } finally {
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
            if (res.status === 200) {
                Alert.alert("VítalCare Clinic", "Đã xóa diễn đàn thành công.");
                loadForumData();
                // handleDismissMenu(forumId)
            } else if (res.status === 400) {
                Alert.alert("VítalCare Clinic", "Xóa diễn đàn bị lỗi. Bạn không có quyền xóa diễn đàn này.");
            }
        } catch (error) {
            console.error(error)
        } finally {
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
            // console.info(forums)
        } catch (error) {
            console.error("Error loading forum data:", error);
        } finally {
            setLoading(false)
        }
    };



    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("VítalCare Clinic", "Không tải được ảnh!");
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
        if (!title || !content || !image) {
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
            } else if (res.status === 400) {
                Alert.alert("VítalCare Clinic", "Thiếu thông tin. Hãy điền đủ thông tin yêu cầu.")
            }

        } catch (error) {
            if (error.response || error.response.status === 400) {
                Alert.alert("VítalCare Clinic", "Hình ảnh dung lượng quá lớn!");
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
        getPatient()
    }, [user]);

    const handleEdit = (forum) => {
        if (forum.patient.id === patient.id) {
            setEditForumId(forum.id);
            setTitle(forum.title);
            setContent(forum.content);
        } else {
            Alert.alert("VítalCare Clinic", "Bạn không quyền chỉnh sửa diễn đàn này.")
        }

    };

    const handleCancelEdit = () => {
        setEditForumId(null);
        setTitle('');
        setContent('');
    };

    const handleChat = () => {
        if(user.id === 7 || user.role === 'patient'){
            setChat(true)
        }else{
            Alert.alert("VítalCare Clinic", "Chỉ có Bác Sĩ Bình thực hiện điều này.")
        }
    }

    const handleBackChat = () => {
        setChat(false);
        // setViewingChats(false);
    };

    if (chat) {
        return <ChatScreen onBack={handleBackChat} />;
    }

    if (nav && detail) {
        return <ForumDetail detail={detail} onBack={handleBackNav} />
    }

    // if (viewingChats) {
    //     return (
    //         <FlatList
    //             data={chatsList}
    //             renderItem={({ item }) => (
    //                 <TouchableOpacity onPress={() => setChatId(item.id)}>
    //                     <Text>Trò chuyện với bệnh nhân {item.participants[0]}</Text>
    //                 </TouchableOpacity>
    //             )}
    //             keyExtractor={(item) => item.id}
    //         />
    //     );
    // }


    return (
        <PaperProvider>
            <View style={MyStyles.headerList}>
                <View>
                    <Text style={MyStyles.titleList}>Diễn Đàn Câu Hỏi</Text>
                </View>
                <TouchableOpacity onPress={() => renderCallButton()}>
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
                        {show && (
                            <TouchableOpacity onPress={handleShow}>
                                <FontAwesome name="minus-square-o" size={15} />
                            </TouchableOpacity>
                        )}
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
                            <Text style={styles.textAvatar}>{image ? 'Chọn lại hình ảnh' : 'Chọn hình ảnh'}</Text>
                        </TouchableOpacity>
                        {image && <Image source={{ uri: image.uri }} style={styles.image} />}
                        <TouchableOpacity style={styles.buttonRecord} onPress={handleCreate}>
                            <Text style={styles.buttonText}>Tạo mới</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {forums.map((forum, index) => (
                    <View>
                        {editForumId === forum.id ? (
                            // Nếu ID trùng với ID đang chỉnh sửa, hiển thị TextInput để người dùng sửa
                            <View>

                                <TextInput
                                    style={styles.input}
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Sửa tiêu đề"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={content}
                                    onChangeText={setContent}
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Sửa nội dung"
                                />
                                <TouchableOpacity onPress={() => handleUpdate(forum.id)}>
                                    <Text style={{ fontFamily: 'serif', fontSize: 14, marginBottom: 5, color: '#835741' }}>
                                        Lưu chỉnh sửa</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleCancelEdit}>
                                    <Text style={{ fontFamily: 'serif', fontSize: 14, marginBottom: 5, color: '#835741' }}>
                                        Hủy bỏ</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View key={index} style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <TouchableOpacity style={styles.forumItem} onPress={() => handleDetail(forum.id)}>
                                    <View style={styles.avatarContainer}>
                                        <Image source={{ uri: forum.image }} style={styles.avatar} />
                                    </View>
                                    <View style={styles.contentContainer}>
                                        <Text style={styles.patientName}>{forum.patient.full_name}</Text>
                                        <Text style={{ fontFamily: 'serif', fontSize: 13, marginBottom: 5, }}>{moment(forum.created_date).format('DD MMMM YYYY HH:mm:ss')}</Text>
                                        <Text style={styles.titleText}>Tiêu đề: {forum.title}</Text>
                                        <Text style={{ fontFamily: 'serif' }}>{forum.content.substring(0, 50)}...</Text>
                                    </View>
                                </TouchableOpacity>
                                {/* // Nếu không chỉnh sửa, hiển thị Menu như trước */}
                                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.5 }}>
                                    <Menu
                                        visible={visibleMenus[index]}
                                        onDismiss={() => handleDismissMenu(index)}
                                        anchor={
                                            <TouchableOpacity onPress={() => handleMenuToggle(index)}>
                                                <FontAwesome name='ellipsis-v' size={20} color='#8B4513' />
                                            </TouchableOpacity>
                                        }>
                                        <Menu.Item onPress={() => handleEdit(forum)} title="Chỉnh sửa" leadingIcon="update" />
                                        <Menu.Item onPress={() => handleDelete(forum.id)} title="Xóa" leadingIcon="delete" />
                                    </Menu>
                                </View>
                            </View>

                        )}
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
            <View style={style.containerAdd}>
                <TouchableOpacity style={style.addButton} onPress={handleChat}>
                    <FontAwesome name="comments-o" size={45} color="#fff" />
                </TouchableOpacity>
            </View>

        </PaperProvider>
    )
}

export default Forum;
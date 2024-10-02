import { View, Text, TouchableOpacity, Image, ScrollView, Modal, TextInput, Alert } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, endpoints } from "../../configs/APIs";
import style from "../HealthMonitoring/style";
import styles from "./styles";
import moment from "moment";
import styleRatings from "../Doctor/styleRatings";
import { ActivityIndicator, Menu, PaperProvider } from "react-native-paper";

const ForumDetail = ({ onBack, detail }) => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [create, setCreate] = useState(false)
    const [answers, setAnswers] = useState([])
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

    const getUserRole = (role) => {
        switch (role) {
            case 'doctor':
                return 'Bác Sĩ';
            case 'patient':
                return 'Bệnh Nhân';
            case 'nurse':
                return 'Y Tá';
            case 'admin':
                return 'Quản Trị Viên';
            default:
                return role;
        }
    };

    const handleCreateAnswer = async () => {
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
            let res = await authApi(token).post(endpoints['answer-forum'](detail.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.status === 201) {
                Alert.alert("VítalCare Clinic", "Đã tạo câu trả lời thành công")
                setContent('');
                setTitle('');
                setCreate(false)
                loadAnswer();
            }

        } catch (error) {
            if (error.response) {
                console.error(error)
                Alert.alert("VítalCare Clinic", "Không tìm thấy diễn đàn!");
            } else {
                console.error("Network error", error);
                Alert.alert("VítalCare Clinic", "Có lỗi xảy ra, vui lòng thử lại sau")
            }
        } finally {
            setLoading(false)
        }
    }

    const loadAnswer = async () => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            const response = await authApi(token).get(endpoints["list-answer-forum"](detail.id));
            setAnswers(response.data);
            console.info(answers)
        } catch (error) {
            console.error("Error loading forum data:", error);
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteAnswer = async (forumId, answerId) => {
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }
            let res = await authApi(token).delete(endpoints['delete-answer'](forumId, answerId))
            if (res.status === 204) {
                Alert.alert("VítalCare Clinic", "Đã xóa câu trả lời thành công.");
                loadAnswer();
            } else if (res.status === 403){
                // console.error("Error creating forum:", response.data);
                Alert.alert("VítalCare Clinic", "Bạn không có quyền thực hiện điều này!");
            }
        }catch(error){
            console.error(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAnswer();
    }, [detail])
    return (
        <PaperProvider>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Chi Tiết Diễn Đàn</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <ScrollView key={detail.id} style={{ padding: 12 }}>
                <View style={styles.avatarContainer1}>
                    <Image source={{ uri: detail.image }} style={styles.avatar1} />

                </View>
                <Text style={styles.textTittle} >{detail.title}</Text>
                <Text style={style.content}>{detail.content}</Text>
                <TouchableOpacity onPress={() => setCreate(!create)}>
                    {!create &&
                        <FontAwesome name="plus-square-o" size={25} color='#835741' />}
                </TouchableOpacity>

                {create && (
                    <View>
                        <View style={{ flexDirection: 'row' , justifyContent: 'center'}}>
                            <Text style={style.contentAdd}>Tạo câu trả lời</Text>
                            <TouchableOpacity onPress={() => setCreate(!create)} style={{marginLeft: 15}}>
                                {create &&
                                    <FontAwesome name="minus" size={20} color='#835741' />}
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={style.content}>Nhập tiêu đề</Text>
                            <TextInput
                                style={style.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Nhập tiêu đề ..."
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={style.content}>Nhập nội dung</Text>
                            <TextInput
                                style={style.input}
                                value={content}
                                onChangeText={setContent}
                                multiline
                                numberOfLines={4}
                                placeholder="Nhập nội dung ..."
                            />
                        </View>

                        <TouchableOpacity style={styles.buttonRecord} onPress={handleCreateAnswer}>
                            <Text style={styles.buttonText}>Tạo</Text>
                        </TouchableOpacity>
                    </View>

                )}
                {update && (
                    <View>
                        <View style={{ flexDirection: 'row' , justifyContent: 'center'}}>
                            <Text style={style.contentAdd}>Chỉnh sửa</Text>
                            <TouchableOpacity onPress={() => setUpdate(!update)} style={{marginLeft: 15}}>
                                {update &&
                                    <FontAwesome name="minus" size={20} color='#835741' />}
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={style.content}>Nhập tiêu đề</Text>
                            <TextInput
                                style={style.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Nhập tiêu đề ..."
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={style.content}>Nhập nội dung</Text>
                            <TextInput
                                style={style.input}
                                value={content}
                                onChangeText={setContent}
                                multiline
                                numberOfLines={4}
                                placeholder="Nhập nội dung ..."
                            />
                        </View>

                        <TouchableOpacity style={styles.buttonRecord} onPress={handleUpdate}>
                            <Text style={styles.buttonText}>Cập nhập</Text>
                        </TouchableOpacity>
                    </View>

                )}
                {answers.map((answer, index) => (
                    <View key={answer.id} style={styles.answer}>
                        <View>
                            <View style={styles.avatarContainer2}>
                                <Image source={{ uri: answer.user.avatar }} style={styles.avatar} />
                            </View>
                            <Text style={styleRatings.contentRole}>{getUserRole(answer.user.role)}</Text>
                        </View>

                        <View style={styleRatings.reviewContent}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styleRatings.name}>{answer.user.username}</Text>
                                <Text style={styleRatings.contentDate}>{moment(answer.created_date).format('Do MMMM, YYYY')}</Text>
                            </View>
                            <Text style={styleRatings.content}>{answer.content}</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 15, marginRight: 5 }}>
                            <Menu
                                visible={visibleMenus[index]}
                                onDismiss={() => handleDismissMenu(index)}
                                anchor={
                                    <TouchableOpacity onPress={() => handleMenuToggle(index)}>
                                        <FontAwesome name='ellipsis-v' size={20} color='#8B4513' />
                                    </TouchableOpacity>}>
                                <Menu.Item onPress={() => setUpdate(!update)} title="Chỉnh sửa" leadingIcon="update" />
                                <Menu.Item onPress={() => handleDeleteAnswer(detail.id, answer.id)} title="Xóa" leadingIcon="delete" />
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
export default ForumDetail;
import { useContext, useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, Alert } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";
import { Card, Icon, Button } from "react-native-elements";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import 'moment/locale/vi';
import MyStyles from "../../styles/MyStyles";
import { FontAwesome } from "@expo/vector-icons";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Profile = () => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();
  const [patient, setPatient] = useState({});
  const [doctor, setDoctor] = useState(null);
  const [nurse, setNurse] = useState(null);

  const getPatient = async () => {
    if(user.role === 'patient'){
      try {
        if (user && user.id) {
          let url = `${endpoints['current-patient']}?user=${user.id}`;
          const res = await APIs.get(url);
          setPatient(res.data);
        }
      } catch (ex) {
        console.info(ex)
        Alert.alert("Thông báo", "Bị lỗi loading.")

      }
    }
  }

  useEffect(() => {
    if (user && user.id) {
      getPatient();
    }
  }, [user.id])

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
  const getPosition = (position) => {
    switch (position) {
      case 'payment_nurse':
        return 'Y tá thu ngân';
      case 'doctor_assistant':
        return 'Trợ lý bác sĩ';
      case 'care_nurse':
        return 'Điều dưỡng';
      default:
        return position;
    }
  };
  const loadInfo = async () => {
    try {
      if (user.role === 'doctor') {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          Alert.alert("Error", "No access token found.");
          return;
        }
        let res = await authApi(token).get(endpoints['doctor-info'])
        setDoctor(res.data)
        console.info(doctor)
      } if (user.role === 'nurse') {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No access token found.");
          return;
        }
        let res = await authApi(token).get(endpoints['nurse-info'])
        setNurse(res.data)
        console.info(nurse)
      }
    } catch (ex) {
      console.error(ex)
    }
  }
  useEffect(() => {
    loadInfo()
  }, [user]);

  return (
    <View style={styles.container}>
      {user.role === 'patient' ? <>
        <Card>
          <View style={styles.header1}>
            {user.avatar === null ? <>
              <Image source={require('./images/Clinic2.png')} style={styles.avatar}
              />
            </> : <>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            </>}

            <View style={styles.userInfo1}>
              <Text style={styles.username1}>{patient.first_name ? `${patient.first_name} ${patient.last_name}` : user.username}</Text>
              <Text style={styles.role1}>{getUserRole(user.role)}</Text>
            </View>
          </View>
          <Card.Divider />
          <View style={styles.details}>
            <Text style={styles.detailItem}>Họ và tên: {patient.first_name ? `${patient.first_name} ${patient.last_name}` : user.username}</Text>
            <Text style={styles.detailItem}>Tham gia: {moment(user.date_join).format('Do MMMM, YYYY')}</Text>
            <Text style={styles.detailItem}>Email: {user.email}</Text>
          </View>

          <TouchableOpacity style={[MyStyles.closeButton, MyStyles.flex]}
            onPress={() => dispatch({ type: "logout" })}>
            <FontAwesome name="sign-out" size={25} color='#835741' />
            <Text style={MyStyles.closeButtonText}>Đăng Xuất</Text>
          </TouchableOpacity>
        </Card>
      </>
        : user.role === 'doctor' ? <>
          <Card>
            <View style={styles.header1}>
              {user.avatar === null ? <>
                <Image source={require('./images/Clinic2.png')} style={styles.avatar}
                />
              </> : <>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              </>}

              <View style={styles.userInfo1}>
                <Text style={styles.username1}>{doctor?.first_name} {doctor?.last_name}</Text>
                <Text style={styles.role1}>{getUserRole(user.role)}</Text>
              </View>
            </View>
            <Card.Divider />
            <View style={styles.details}>
              <Text style={styles.detailItem}>Họ và tên: {doctor?.first_name} {doctor?.last_name}</Text>
              <Text style={styles.detailItem}>Tham gia: {moment(user.date_join).format('Do MMMM, YYYY')}</Text>
              <Text style={styles.detailItem}>Email: {user.email}</Text>
            </View>

            <TouchableOpacity style={[MyStyles.closeButton, MyStyles.flex]}
              onPress={() => dispatch({ type: "logout" })}>
              <FontAwesome name="sign-out" size={25} color='#835741' />
              <Text style={MyStyles.closeButtonText}>Đăng Xuất</Text>
            </TouchableOpacity>
          </Card>
        </> : <>
          <Card>
            <View style={styles.header1}>
              {user.avatar === null ? <>
                <Image source={require('./images/Clinic2.png')} style={styles.avatar}
                />
              </> : <>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              </>}

              <View style={styles.userInfo1}>
                <Text style={styles.username1}>{nurse?.first_name} {nurse?.last_name}</Text>
                <Text style={styles.role1}>{getUserRole(user.role)}</Text>
              </View>
            </View>
            <Card.Divider />
            <View style={styles.details}>
              <Text style={styles.detailItem}>Họ và tên: {nurse?.first_name} {nurse?.last_name}</Text>
              <Text style={styles.detailItem}>Tham gia: {moment(user.date_join).format('Do MMMM, YYYY')}</Text>
              <Text style={styles.detailItem}>Chức vụ: {getPosition(nurse?.position)}</Text>
              <Text style={styles.detailItem}>Email: {user.email}</Text>
            </View>

            <TouchableOpacity style={[MyStyles.closeButton, MyStyles.flex]}
              onPress={() => dispatch({ type: "logout" })}>
              <FontAwesome name="sign-out" size={25} color='#835741' />
              <Text style={MyStyles.closeButtonText}>Đăng Xuất</Text>
            </TouchableOpacity>
          </Card>
        </>}


    </View>
  );

}

export default Profile;
import { useContext } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/Context";
import { Card, Icon, Button } from "react-native-elements";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import 'moment/locale/vi';
import MyStyles from "../../styles/MyStyles";
import { FontAwesome } from "@expo/vector-icons";


const Profile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();

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


    return (
        <View style={styles.container}>
            <Card>
            <View style={styles.header1}>
              {user.avatar === null ? <>
                <Image source={require('./images/Clinic2.png')} style={styles.avatar}
              />
              </>:<>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              </>}
            
            <View style={styles.userInfo1}>
                <Text style={styles.username1}>{user.username}</Text>
                <Text style={styles.role1}>{getUserRole(user.role)}</Text>
            </View>
            </View>
                <Card.Divider />
                <View style={styles.details}>
                <Text style={styles.detailItem}>Username: {user.username}</Text>
                <Text style={styles.detailItem}>Tham gia: {moment(user.date_join).format('Do MMMM, YYYY')}</Text>
                <Text style={styles.detailItem}>Email: {user.email}</Text>
                </View>

                <TouchableOpacity style={[MyStyles.closeButton, MyStyles.flex]} 
                onPress={() => dispatch({type: "logout"})}>
                    <FontAwesome name="sign-out" size={25} color='#835741'/>
                    <Text style={MyStyles.closeButtonText}>Đăng Xuất</Text>
                </TouchableOpacity>
            </Card>
            
        </View>
  );
        
}

export default Profile;
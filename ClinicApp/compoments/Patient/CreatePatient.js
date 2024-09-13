import { FontAwesome } from "@expo/vector-icons";
import { View, Text, TextInput } from "react-native";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

const CreatePatient = () => {
    const nav = useNavigation()
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState(null);
    const [phone, setPhone] = useState('');

    return (
        <>
        <View style={styles.header1}>
                <FontAwesome name="angle-left" size={35} style={{marginTop: 25}} 
                onPress={() => nav.navigate("Home")
                }/>
                <Text style={styles.title}>Hồ Sơ Bệnh Nhân</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={{flex:1}}>
                <Text style={styles.label}>Họ <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={first_name}
                    onChangeText={setFirstname}
                    placeholder="Nhập họ"
                />
            </View>
            <View style={{flex:1}}>
                <Text style={styles.label}>Tên <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={last_name}
                    onChangeText={setLastname}
                    placeholder="Nhập tên"
                />
            </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View style={{flex:1}}>
                <Text style={styles.label}>Ngày sinh <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={birthdate}
                    onChangeText={setBirthdate}
                    placeholder="dd/MM/yyyy"
                    
                />
            </View>
            <View style={{flex:1}}>
                <Text style={styles.label}>Giới tính <Text style={{color: 'red'}}>*</Text>:</Text>
                <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <TouchableOpacity
                    style={[styles.option, gender === true && styles.selected]} 
                    onPress={() => setGender(true)}
                >
                    <Text style={styles.optionText}>Nam</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.option, gender === false && styles.selected]} 
                    onPress={() => setGender(false)}
                >
                    <Text style={styles.optionText}>Nữ</Text>
                </TouchableOpacity>
                </View> 
            </View>
            
            </View>
            <View style={{flex:1}}>
                <Text style={styles.label}>Địa chỉ <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Nhập địa chỉ"
                />
            </View>
            <View style={{flex:1}}>
                <Text style={styles.label}>Số điện thoại <Text style={{color: 'red'}}>*</Text>:</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                />
            </View>

            <TouchableOpacity style={styles.button} 
                onPress={() => {}}>
                    <Text style={styles.buttonText1}>Hoàn Thành</Text>
                </TouchableOpacity>
        </ScrollView>
        </>
    )
}
export default CreatePatient;
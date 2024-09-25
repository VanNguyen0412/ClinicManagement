import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import MedicineDetail from "./MedicineDetail";
import styleMedicine from "./styleMedicine";
import { MyUserContext } from "../../configs/Context";
import APIs, { endpoints } from "../../configs/APIs";
import { Modal } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const MedicineList = () => {
    const [show, setShow] = useState(false);
    const nav = useNavigation()
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [medicine, setMedicine] = useState([]);
    const user = useContext(MyUserContext);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleView = (medicine) => {
        loadMedicineDetail(medicine)
        setShow(true);
    };

    const handleBack = () => {
        setShow(false);
    };

    const loadMedicine = async () => {
        setLoading(true);
        try{
            let url = `${endpoints['medicine']}?page=${page}`;
            let res = await APIs.get(url)
            if (res.data.next === null){
                setPage(0);
                setMore(false);
            }
            if (page === 1){
                setMedicine(res.data.results);
            }else{
                setMedicine(current => {
                    return [...current, ...res.data.results];
                });
            }
        }catch(ex){
            Alert.alert("Trang chủ", "Bị lỗi khi loading thuốc.")
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=> {
        loadMedicine();
    }, [page, user]);

    const moreMedicine = () =>{
        setPage(page+1);
    }
    
    const loadMedicineDetail = async (medicine) => {
        setLoading(true)
        try{
            let res = await APIs.get(endpoints['medicineDetail'](medicine.id))
            setSelectedMedicine(res.data)
        }catch(ex){
            Alert.alert("Thông báo", "Loading thông tin thuốc lỗi.")
        }finally{
            setLoading(false);
        }
    }

    if (show && selectedMedicine) {
        return <MedicineDetail medicine={selectedMedicine} onBack={handleBack} />;
    }
    
    return (
        <View style={{marginBottom: 30}}>
            <View style={MyStyles.headerList}>
                {user.role === 'patient'? 
                <TouchableOpacity onPress={() => nav.navigate("Home")}>
                <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => nav.navigate("HomeDoctor")}>
                <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                }
                <View>
                <Text style={MyStyles.titleList}>Thực Phẩm Chức Năng</Text>
                </View>
                <TouchableOpacity>
                <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <View style={styleMedicine.searchContainerList}>
                <TextInput 
                style={styleMedicine.searchInputList} 
                placeholder="Nhập tên thực phẩm cần tìm" 
                />
                <FontAwesome name="search" size={24} color="#835741" />
            </View>
            
            <ScrollView style={styleMedicine.list}>
            
                <View style={{flexDirection: 'row', flexWrap:'wrap'}}>
                    {medicine.map(item => (
                    <View style={styleMedicine.card} key={item.id}>
                    <View style={{alignSelf:'center'}}>
                    <Image source={{ uri: item.image }} style={styleMedicine.image} />
                    </View>
                    <View style={styleMedicine.details}>
                        <Text style={styleMedicine.name}>{item.name.length > 30 ? `${item.name.substring(0, 25)}...` : item.name}</Text>
                        <Text style={styleMedicine.price}>{item.price}đ / SP</Text>
                        <TouchableOpacity style={{flexDirection: 'row',marginTop: 7}} onPress={() => handleView(item)}>
                            <FontAwesome name="info-circle" size={20} color='#835741'/>
                            <Text style={styleMedicine.type}>Chi tiết</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
                 ))}
                </View>
                
           
                <TouchableOpacity onPress={moreMedicine}>
                    <Text style={MyStyles.bonusMore}>{more === true ? 'Xem thêm': ''}</Text>
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
                            <Image source={{uri: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1726585796/logo1.png'}} style={MyStyles.logo} />
                        </View>
                        <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                </Modal>
            )}
        </View>
        
    );
    
}

export default MedicineList;
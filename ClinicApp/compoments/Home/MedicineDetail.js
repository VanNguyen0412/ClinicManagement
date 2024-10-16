import { TouchableOpacity, View, Text, ScrollView, Image } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { FontAwesome } from "@expo/vector-icons";
import styleMedicine from "./styleMedicine";
import { Icon, Paragraph } from "react-native-paper";
import moment from "moment";
import { useContext } from "react";
import { MyContext } from "../../App";

const MedicineDetail = ({ medicine, onBack }) => {
    const {renderCallButton } = useContext(MyContext);

    const getUnitMedicine = (unit) => {
        switch (unit) {
            case 'Viên':
                return 'Dạng bào chế: Viên nén';
            case 'Vỉ':
                return 'Đơn vị đóng gói: Vỉ';
            case 'Chai':
                return 'Dạng bào chế: Dung dịch/Siro';
            case 'Gói':
                return 'Đơn vị đóng gói: Gói';
            default:
                return unit;
        }
    };

    return (
        <>
            <View style={MyStyles.headerList}>
                <TouchableOpacity onPress={onBack}>
                    <FontAwesome name="arrow-left" size={24} color="#835741" />
                </TouchableOpacity>
                <View>
                    <Text style={MyStyles.titleList}>Chi Tiết Thuốc</Text>
                </View>
                <TouchableOpacity onPress={() => renderCallButton()}>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
            <ScrollView>
                <View style={styleMedicine.detailMedicine}>
                    <View style={styleMedicine.imageMedicineBorder}>
                        <Image source={{ uri: medicine.image }} style={styleMedicine.imageMedicine} />
                        <View style={styleMedicine.iso}>
                            <Text style={styleMedicine.isoText}>Sản phẩm chính hãng đã chứng nhận an toàn ISO</Text>
                        </View>
                    </View>
                    <Text style={styleMedicine.medicineName}>{medicine.name}</Text>
                    <Text style={styleMedicine.medicinePrice}>{medicine.price}đ / Sản Phẩm</Text>

                    <View style={[styleMedicine.margin]}>
                        <Text style={styleMedicine.medicineType}>Phân loại sản phẩm</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <FontAwesome name="flask" size={22} color='#8B4513' />
                            <Text style={{ fontFamily: 'serif', marginLeft: 10 }} >{medicine.type}</Text>
                        </View>
                    </View>
                    <View style={[styleMedicine.margin]}>
                        <Text style={styleMedicine.medicineType}>Thông tin sản xuất</Text>
                        <Text style={{ fontFamily: 'serif', marginBottom: 6 }} >
                            <Text style={{ fontWeight: '600', fontSize: 16, }}>Bảo quản: </Text>Để nơi khô ráo, nhiệt độ không quá 30 độ C, tránh ánh sáng.</Text>
                        <Text style={{ fontFamily: 'serif', marginBottom: 6 }} >
                            <Text style={{ fontWeight: '600', fontSize: 16, }}>Ngày hết hạn: </Text>{moment(medicine.exp_date).format('Do MMMM, YYYY')}</Text>
                        <Text style={{ fontFamily: 'serif', marginBottom: 6 }} >
                            <Text style={{ fontWeight: '600', fontSize: 16, }}>Ngày sản xuất: </Text>{moment(medicine.mfg_date).format('Do MMMM, YYYY')}</Text>

                    </View>
                    <View style={styleMedicine.margin}>
                        <Text style={styleMedicine.medicineType}>Mô tả sản phẩm</Text>
                        <Text style={styleMedicine.descriptionMedicine}>{getUnitMedicine(medicine.unit)}</Text>
                        <Text style={styleMedicine.headerDescription}>Công dụng:</Text>
                        <Text style={styleMedicine.descriptionMedicine}>
                            {medicine.uses}
                        </Text>
                        <Text style={styleMedicine.headerDescription}>Cách sử dụng:</Text>
                        <Text style={styleMedicine.descriptionMedicine}>
                            {medicine.howtouse}
                        </Text>
                    </View>

                </View>
            </ScrollView>
        </>
    );
}
export default MedicineDetail;
import { View, Text } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Forum = () => {
    return (
        <View style={MyStyles.headerList}>
                <View>
                    <Text style={MyStyles.titleList}>Diễn Đàn Câu Hỏi</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={24} color="#835741" />
                </TouchableOpacity>
            </View>
    )
}
export default Forum;
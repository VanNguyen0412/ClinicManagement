import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings';
import { ActivityIndicator, Button, Divider, Menu, Provider as PaperProvider  } from 'react-native-paper';
import styleRatings from './styleRatings';
import MyStyles from '../../styles/MyStyles';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const RatingDetail = ({route}) => {
    const nav = useNavigation()
    const user = useContext(MyUserContext)
    const {doctorId} = route.params;
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [visible, setVisible] = useState(false);
    const [ratingList, setRatingList] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadRatingList = async () => {
      setLoading(true);
      try{
          let res = await APIs.get(endpoints['rating-all'](doctorId))
          setRatingList(res.data);
      }catch(ex){
        Alert.alert("Thông báo", "Load thông tin đánh giá lỗi.")
      }finally{
        setLoading(false);
      }
    }

    useEffect(()=> {
      loadRatingList();
    }, [doctorId]);

    const createRating = async () => {
      setLoading(true);

      try{      
          const token = await AsyncStorage.getItem("token");

            if (!token) {
                Alert.alert("Error", "No access token found.");
                return;
            }   
            console.info(token)
          const fromData = new FormData();
          fromData.append('content', reviewText );
          fromData.append('star', rating);
          const response = await authApi(token).post(endpoints['create-rating'](doctorId), fromData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
          if(response.status === 201){
              Alert.alert("Đánh giá", "Tạo đánh giá thành công");
              setRating(0);
              setReviewText('');
              loadRatingList();
          }else if(response.status === 403){
            Alert.alert("Đánh giá", "Bạn chỉ có thể đánh giá một bác sĩ nếu bạn đã hoàn tất cuộc hẹn và có đơn thuốc.");
            setRating(0);
            setReviewText('');
        }
      } catch (error) {
          if (error.response){
              setRating(0);
              setReviewText('');
              // console.error("Error response:", error.response);
              Alert.alert("Đánh giá","Bạn chỉ có thể đánh giá một bác sĩ nếu bạn đã hoàn tất cuộc hẹn và có đơn thuốc!");
          }else {
              console.error("Network error", error);
              Alert.alert("Đánh giá", "Có lỗi xảy ra, vui lòng thử lại sau")
          }
      } finally {
          setLoading(false);
      }
  };


return (
    <PaperProvider>
      <View style={MyStyles.headerList}>
      <TouchableOpacity onPress={() => nav.navigate("ListDoctor")}>
        <FontAwesome name="arrow-left" size={24} color="#835741" />
      </TouchableOpacity>
      <View>
        <Text style={MyStyles.titleList}>Đánh Giá</Text>
      </View>
      <TouchableOpacity>
        <FontAwesome name="phone" size={24} color="#835741" />
      </TouchableOpacity>
    </View>
  <View style={styleRatings.container}>
    <Text style={styleRatings.titleRating}>Viết đánh giá của bạn</Text>
    <AirbnbRating
      count={5}
      defaultRating={0}
      size={20}
      onFinishRating={setRating}
      style={styleRatings.createRating}
    />
    <TextInput
      style={styleRatings.input}
      placeholder="Nhập nội dung đánh giá của bạn tại đây..."
      multiline
      numberOfLines={4}
      value={reviewText}
      onChangeText={setReviewText}
    />
    <TouchableOpacity style={styleRatings.button} onPress={createRating}>
      <Text style={styleRatings.buttonText}>Gửi đánh giá</Text>
    </TouchableOpacity>
  </View>
    <ScrollView>
      {ratingList.map(review => (
        <View style={styleRatings.reviewContainer}>
        <View style={{flexDirection: 'row', flex: 4}}>
          <Image source={{ uri: review.patient.user.avatar }} style={styleRatings.avatar} />
          <View style={styleRatings.reviewContent}>
            <Text style={styleRatings.name}>{review.patient.first_name} {review.patient.last_name}</Text>
              <View style={styleRatings.rating}>
                {Array(review.star).fill().map((_, i) => (
                  <FontAwesome key={i} name="star" size={16} color="gold" />
                ))}
              </View>
              <Text style={styleRatings.contentDate}>{moment(review.created_date).format('Do MMMM, YYYY')}</Text>
              <Text style={styleRatings.content}>{review.content}</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems:'center'}}>
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <TouchableOpacity  onPress={() => setVisible(true)}>
                <FontAwesome name='ellipsis-v' size={23} color='#8B4513'/>
              </TouchableOpacity>}>
          <Menu.Item onPress={() => {}} title="Chỉnh sửa" leadingIcon="update"/>
          <Menu.Item onPress={() => {}} title="Xóa" leadingIcon="delete"/>
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
                  <Image source={{uri: 'https://res.cloudinary.com/dr9h3ttpy/image/upload/v1726585796/logo1.png'}} style={MyStyles.logo} />
              </View>
              <ActivityIndicator size="small" color="#ffffff" />
          </View>
      </Modal>
    )}
  </PaperProvider>
);
};



export default RatingDetail;

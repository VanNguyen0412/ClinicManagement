import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AirbnbRating } from 'react-native-ratings';
import { ActivityIndicator, Button, Divider, Menu, Provider as PaperProvider } from 'react-native-paper';
import styleRatings from './styleRatings';
import MyStyles from '../../styles/MyStyles';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import { MyUserContext } from '../../configs/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { RefreshControl } from 'react-native';

const RatingDetail = ({ route, doctorId, onBack }) => {
  const nav = useNavigation()
  const user = useContext(MyUserContext)
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [ratingList, setRatingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleMenus, setVisibleMenus] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingRating, setEditingRating] = useState(0);
  const [editingReviewText, setEditingReviewText] = useState('');
  const [patient, setPatient] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const getPatient = async () => {
    try {
      if (user && user.id) {
        let url = `${endpoints['current-patient']}?user=${user.id}`;
        const res = await APIs.get(url);
        setPatient(res.data);
      }
      // console.info(patient)
    } catch (ex) {
      Alert.alert("VítalCare Clinic", "Bạn nên tạo thông tin cá nhân.")
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

  const loadRatingList = async () => {
    setLoading(true);
    try {
      let res = await APIs.get(endpoints['rating-all'](doctorId))
      setRatingList(res.data);
      // console.info(ratingList)
    } catch (ex) {
      Alert.alert("VítalCare Clinic", "Load thông tin đánh giá lỗi.")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRatingList();
  }, [doctorId]);

  useEffect(() => {
    getPatient();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRatingList(); 
    setRefreshing(false);
};

  const createRating = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "No access token found.");
        return;
      }
      console.info(token)
      const fromData = new FormData();
      fromData.append('content', reviewText);
      fromData.append('star', rating);
      const response = await authApi(token).post(endpoints['create-rating'](doctorId), fromData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 201) {
        Alert.alert("VítalCare Clinic", "Tạo đánh giá thành công");
        setRating(0);
        setReviewText('');
        loadRatingList();
      }
    } catch (error) {
      if (error.response || error.response.status === 404) {
        setRating(0);
        setReviewText('');
        Alert.alert("VítalCare Clinic", "Bạn chỉ có thể đánh giá một bác sĩ nếu bạn đã hoàn tất cuộc hẹn và có đơn thuốc!");
      }
      else {
        console.error("Network error", error);
        Alert.alert("VítalCare Clinic", "Có lỗi xảy ra, vui lòng thử lại sau")
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async (rating) => {
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "No access token found.");
        return;
      }

      let res = await authApi(token).delete(endpoints['delete-rating'](rating.id))

      if (res.status === 204) {
        Alert.alert("VítalCare Clinic", "Đã xóa đánh giá thành công.")
        loadRatingList()
        handleDismissMenu(rating)
      }

    } catch (error) {
      if (error.response || error.response.status === 404) {
        Alert.alert("VítalCare Clinic", "Đánh giá này không tồn tại hoặc bạn không có quyền chỉnh sửa.")
        handleDismissMenu(rating)
      }
    } finally {
      setLoading(false)
    }
  }
  const handleEditRating = (index, review) => {
    if (review.patient.id === patient.id) {
      setEditingIndex(index);
      setEditingRating(review.star);
      setEditingReviewText(review.content);
      handleDismissMenu(index);
    } else {
      Alert.alert("VítalCare Clinic", "Bạn không quyền chỉnh sửa đánh giá này.")
      handleDismissMenu(index);

    }
  };

  const saveEditedRating = async (reviewId) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found.");
        return;
      }
      const fromData = new FormData();
      fromData.append('content', editingReviewText);
      fromData.append('star', editingRating);

      let response = await authApi(token).patch(endpoints['update-rating'](reviewId), fromData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        Alert.alert("VítalCare Clinic", "Đã cập nhật đánh giá thành công.");
        setEditingIndex(null);
        loadRatingList();
      }
    } catch (error) {
      console.error("Network error", error);
      Alert.alert("VítalCare Clinic", "Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      {user.role === 'patient' ?
        <View style={MyStyles.headerList}>
          <TouchableOpacity onPress={onBack}>
            <FontAwesome name="arrow-left" size={24} color="#835741" />
          </TouchableOpacity>
          <View>
            <Text style={MyStyles.titleList}>Đánh Giá</Text>
          </View>
          <TouchableOpacity>
            <FontAwesome name="phone" size={24} color="#835741" />
          </TouchableOpacity>
        </View>
        :
        <View style={MyStyles.headerList}>
          <TouchableOpacity onPress={onBack}>
            <FontAwesome name="arrow-left" size={24} color="#835741" />
          </TouchableOpacity>
          <View>
            <Text style={MyStyles.titleList}>Đánh Giá</Text>
          </View>
          <TouchableOpacity>
            <FontAwesome name="phone" size={24} color="#835741" />
          </TouchableOpacity>
        </View>
      }
      {editingIndex === null && (
        <View style={styleRatings.container}>
          <Text style={styleRatings.titleRating}>Viết đánh giá của bạn</Text>
          <AirbnbRating
            count={5}
            defaultRating={0}
            size={15}
            onFinishRating={setRating}
            style={styleRatings.createRating}
          />
          <TextInput
            style={styleRatings.input}
            placeholder="Nhập nội dung đánh giá của bạn tại đây..."
            multiline
            numberOfLines={3}
            value={reviewText}
            onChangeText={setReviewText}
          />
          <TouchableOpacity style={styleRatings.button} onPress={createRating}>
            <Text style={styleRatings.buttonText}>Gửi đánh giá</Text>
          </TouchableOpacity>
        </View>
      )

      }

      <ScrollView 
      refreshControl={ // Thêm RefreshControl để làm mới khi kéo xuống
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    }>
        {ratingList.map((review, index) => (
          <View style={styleRatings.reviewContainer} key={index}>
            <View style={{ flexDirection: 'row', flex: 4 }}>
              <Image source={{ uri: review.patient.user.avatar }} style={styleRatings.avatar} />
              <View style={styleRatings.reviewContent}>
                <Text style={styleRatings.name}>{review.patient.first_name} {review.patient.last_name}</Text>

                <Text style={styleRatings.contentDate}>{moment(review.created_date).format('Do MMMM, YYYY')}</Text>
                {editingIndex === index ? (
                  <>
                    <AirbnbRating
                      count={5}
                      defaultRating={editingRating}
                      size={20}
                      onFinishRating={setEditingRating}
                      style={styleRatings.createRating}
                    />
                    <TextInput
                      style={styleRatings.input}
                      placeholder="Chỉnh sửa nội dung đánh giá..."
                      multiline
                      numberOfLines={4}
                      value={editingReviewText}
                      onChangeText={setEditingReviewText}
                    />
                    <TouchableOpacity onPress={() => setEditingIndex(null)}>
                      <Text style={styleRatings.buttonCancel}>Hủy bỏ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styleRatings.button} onPress={() => saveEditedRating(review.id)}>
                      <Text style={styleRatings.buttonText}>Lưu</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View>
                    <View style={styleRatings.rating}>
                      {Array(review.star).fill().map((_, i) => (
                        <FontAwesome key={i} name="star" size={16} color="gold" />
                      ))}
                    </View>
                    <Text style={styleRatings.content}>{review.content}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Menu
                visible={visibleMenus[index]}
                onDismiss={() => handleDismissMenu(index)}
                anchor={
                  <TouchableOpacity onPress={() => handleMenuToggle(index)}>
                    <FontAwesome name='ellipsis-v' size={23} color='#8B4513' />
                  </TouchableOpacity>
                }>
                <Menu.Item onPress={() => handleEditRating(index, review)} title="Chỉnh sửa" leadingIcon="update" />
                <Menu.Item onPress={() => handleDeleteRating(review)} title="Xóa" leadingIcon="delete" />
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
      )}
    </PaperProvider>
  );
};
export default RatingDetail;

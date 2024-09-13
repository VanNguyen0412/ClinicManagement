import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';


const HomeScreen = () => {
  const nav = useNavigation();
  return (
    <ImageBackground style={styles.background} source={require('./images/Clinic.png')}>
     <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => nav.navigate('Login')}>
            <Text style={styles.buttonText}>Đăng Nhập</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => nav.navigate('Register')}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    buttonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '80%',
        marginTop: 580
      },
      button: {
        width: 250,
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: '#835741',
        borderRadius: 5,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        color: '#835741',
        fontSize: 15,
        fontWeight: 'bold',
      },
});

export default HomeScreen;
import { NavigationContainer } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "./configs/Context";
import Login from "./compoments/user/Login";
import HomeScreen from "./compoments/Home/HomeScreen";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "./compoments/user/Register";
import ComfirmUser from "./compoments/user/ConfirmUser";
import Home from "./compoments/Home/Home";
import HomeDoctor from "./compoments/Home/HomeDoctor";
import Appointment from "./compoments/Appointment/Appointment";
import CreateResult from "./compoments/Doctor/CreateResult";
import Doctor from "./compoments/Doctor/Doctor";
import CreatePresciption from "./compoments/Doctor/CreatePresciption";
import CreatePatient from "./compoments/Patient/CreatePatient";
import RegisterAppointment from "./compoments/Appointment/RegisterAppointment";
import ListDoctor from "./compoments/Doctor/ListDoctor";
import RatingDetail from "./compoments/Doctor/RatingDetail";
import MedicineList from "./compoments/Home/MedicineList";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { Text } from "react-native";
import { useContext, useEffect, useReducer, useState } from "react";
import MyUserReducer from "./configs/Reducer";
import Profile from "./compoments/user/Profile";
import HealthRecord from "./compoments/Doctor/HealthRecord";
import Notification from "./compoments/Notification/Notification";
import Forum from "./compoments/Forum/Forum";
import NotificationDetail from "./compoments/Notification/NotificationDetail";
import ProfilePatient from "./compoments/Patient/ProfilePatient";


const Stack = createStackNavigator();


const MyStackMainPatient = () => {
  const user = useContext(MyUserContext);

  return (
    <Stack.Navigator
      initialRouteName="HomeDoctor"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Doctor" component={Doctor} />
      <Stack.Screen name="CreatePatient" component={CreatePatient} />
      <Stack.Screen name="RegisterAppointment" component={RegisterAppointment} />
      <Stack.Screen name="ListDoctor" component={ListDoctor} />
      <Stack.Screen name="RatingDetail" component={RatingDetail} />
      <Stack.Screen name="MedicineList" component={MedicineList} />
      <Stack.Screen name="ProfilePatient" component={ProfilePatient} />

    </Stack.Navigator>
  );
}

const MyStackMainDoctor = () => {
  const user = useContext(MyUserContext);

  return (
    <Stack.Navigator
      initialRouteName="HomeDoctor"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDoctor" component={HomeDoctor} />
      <Stack.Screen name="Appointment" component={Appointment} />
      <Stack.Screen name="CreateResult" component={CreateResult} />
      <Stack.Screen name="HealthRecords" component={HealthRecord} />
      <Stack.Screen name="Doctor" component={Doctor} />
      <Stack.Screen name="CreatePresciption" component={CreatePresciption} />
      <Stack.Screen name="ListDoctor" component={ListDoctor} />
      <Stack.Screen name="RatingDetail" component={RatingDetail} />
      <Stack.Screen name="MedicineList" component={MedicineList} />
    </Stack.Navigator>
  );
}

const MyStackLogin = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ConfirmUser" component={ComfirmUser} />
    </Stack.Navigator>
  );
};


const MyStackNotification = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetail} />
    </Stack.Navigator>
  )
};

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          let iconSize = focused ? 25 : 20; // Tăng kích thước icon khi tab được chọn
          let iconColor = focused ? '#835741' : '#e6c4a8'; // Đổi màu icon khi tab được chọn

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Appoint':
              iconName = 'calendar-check-o';
              break;
            case 'Main':
              iconName = 'question-circle-o';
              break;
            case 'Noti':
              iconName = 'bell-o';
              break;
            case 'More':
              iconName = 'bars';
              break;
            default:
              iconName = 'circle';
          }

          return <FontAwesome name={iconName} size={iconSize} color={iconColor} />;
        },

        headerShown: false,
      })}
    >
      {user.role === 'patient' ?
        <>

          <Tab.Screen
            name="Home"
            component={MyStackMainPatient}
            options={{
              title: 'Trang Chủ',
              tabBarLabel: ({ focused }) => (
                <Text style={{ fontSize: focused ? 14 : 12, color: focused ? '#835741' : '#e6c4a8', fontFamily: 'serif' }}>
                  Trang Chủ
                </Text>
              ),
            }}
          />
          <Tab.Screen
            name="Appoint"
            component={Appointment}
            options={{
              title: 'Lịch Hẹn',
              tabBarLabel: ({ focused }) => (
                <Text style={{ fontSize: focused ? 14 : 12, color: focused ? '#835741' : '#e6c4a8', fontFamily: 'serif' }}>
                  Lịch Hẹn
                </Text>
              ),
            }}
          />
        </> :
        <Tab.Screen
          name="Home"
          component={MyStackMainDoctor}
          options={{
            title: 'Trang Chủ',
            tabBarLabel: ({ focused }) => (
              <Text style={{ fontSize: focused ? 14 : 12, color: focused ? '#835741' : '#e6c4a8', fontFamily: 'serif' }}>
                Trang Chủ
              </Text>
            ),
          }}
        />
      }


      <Tab.Screen
        name="Main"
        component={Forum}
        options={{
          title: 'Diễn Đàn',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: focused ? 14 : 12, color: focused ? '#835741' : '#e6c4a8', fontFamily: 'serif' }}>
              Diễn Đàn
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Noti"
        component={MyStackNotification}
        options={{
          title: 'Thông Báo',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: focused ? 14 : 12, color: focused ? '#835741' : '#e6c4a8', fontFamily: 'serif' }}>
              Thông Báo
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={Profile}
        options={{
          title: 'Khác',
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontSize: focused ? 14 : 12, color: focused ? '#835741' : '#e6c4a8', fontFamily: 'serif' }}>
              Khác
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          {user === null ?
            <MyStackLogin /> :
            <MyTab />
          }
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>


    </NavigationContainer>
  );
}

export default App;

import { NavigationContainer } from "@react-navigation/native";
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

const Stack = createStackNavigator();
const MyStackLogin = () => {
    return (
      <Stack.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ConfirmUser" component={ComfirmUser} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="HomeDoctor" component={HomeDoctor} />
            <Stack.Screen name="Appointment" component={Appointment} />
            <Stack.Screen name="CreateResult" component={CreateResult} />
            <Stack.Screen name="Doctor" component={Doctor} />
            <Stack.Screen name="CreatePresciption" component={CreatePresciption} />
            <Stack.Screen name="CreatePatient" component={CreatePatient} />
        </Stack.Navigator>
    );
}

const MyStackMain = () => {
  return (
      <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: true }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Appointment" component={Appointment} />
          <Stack.Screen name="CreateResult" component={CreateResult} />
          <Stack.Screen name="HomeDoctor" component={HomeDoctor} />
      </Stack.Navigator>
  );
};


const App = () => {
  
  return (
    <NavigationContainer>
          <MyStackLogin />
          
    </NavigationContainer>
  );
}


export default App;

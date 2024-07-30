import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NewsView from "../screens/NewsView";
import HomeScreen from "../screens/HomeScreen";
import NewsCategory from "../screens/NewsCategory";
import SavedScreen from "../screens/SavedScreen";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: {
            height: 60,
            paddingBottom: 15,
            paddingTop: 5,
          } }}>
            <Tab.Screen 
                name="HomeScreen" 
                component={HomeScreen} 
                options={{
                    tabBarIcon: (props) => (
                        <Icon name={props.focused ? "home-circle" : "home"} {...props} />
                    ),
                }}
            />
            <Tab.Screen 
                name="NewsCategory" 
                component={NewsCategory} 
                options={{
                    tabBarIcon: (props) => (
                        <Icon name={props.focused ? "card-multiple" : "card-multiple-outline"} {...props} />
                    ),
                }}
            />
            <Tab.Screen
                name="SavedScreen"
                component={SavedScreen}
                options={{
                    tabBarIcon: (props) => (
                        <Icon name={props.focused ? "content-save" : "content-save-outline"} {...props} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="NewsView" component={NewsView} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;

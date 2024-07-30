import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsView from './NewsView';
import HomeView from './HomeView';

const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="DU NEWS" component={HomeView} />
      <HomeStack.Screen name="NewsView" component={NewsView} />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import GlobalApi from "../Services/GlobalApi";
import { Article, ComponentNavigationProps, NewsData } from "../utils/types";
import CardItems from "../components/CardItems";
import {
  Icon,
  IconButton,
  MD3Colors,
  ProgressBar,
  Searchbar,
} from "react-native-paper";
import Push from "../components/Push";


//notification
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import axios from 'axios';
import * as Device from 'expo-device';


const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const HomeView = (props: ComponentNavigationProps) => {
  const [NewData, setNewData] = useState<NewsData[]>([]);
  const [NewsList, setNewsList] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const animatedWidth = useRef(new Animated.Value(0)).current;


  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const result = (await GlobalApi.getNews()).data;
      setNewData(result);
      setNewsList(result.articles);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchSearchResults = async (query: string) => {
    try {
      setIsLoading(true);
      const result = (await GlobalApi.searchNews(query)).data;
      setNewsList(result.articles);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSearchToggle = () => {
    // setIsSearchBarVisible(!isSearchBarVisible);
    if (isSearchBarVisible) {
      Animated.timing(animatedWidth, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsSearchBarVisible(!isSearchBarVisible));
    } else {
      setIsSearchBarVisible(!isSearchBarVisible);
      Animated.timing(animatedWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      fetchSearchResults(query);
    } else {
      fetchNews();
    }
  };


// Notification attempt 1
// flop

  // Notification attempt 2
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const sendToken = async (token: string) => {
    try {
      setIsLoading(true);
      const result = (await GlobalApi.sendToken(token)).data;
      // console.log(result);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));
    

  // try {
  //   axios.post('http://10.87.137.145:8800/api/users/push-token', { expoPushToken });
  //   console.log('Token sent to backend');
  // } catch (error) {
  //   console.error('Error sending token to backend:', error);
  // }
    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);



async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId = "44661d5a-11fa-4f5b-95d3-7d14dc55f6e1";
        // Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

       // Extract the token without the "ExponentPushToken[" and "]" parts
      if (token.startsWith("ExponentPushToken[")) {
        token = token.replace("ExponentPushToken[", "").replace("]", "");
      }
      // console.log("in the register"+ token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

// Send the token to the server
if (token) {
  sendToken(token);
}
  return token;
}






  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () =>
        isSearchBarVisible ? (
          <Animated.View
          style={[
            styles.searchBarContainer,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "60%"],
              }),
            },
          ]}
        >
            <Searchbar
              placeholder="Search"
              onChangeText={handleSearch}
              value={searchQuery}
              style={styles.searchBar}
            />
            <IconButton
              icon="close"
              iconColor={MD3Colors.primary0}
              size={20}
              onPress={handleSearchToggle}
            />
          </Animated.View>
        ) : (
          <IconButton
            icon="magnify"
            iconColor={MD3Colors.primary0}
            size={20}
            onPress={handleSearchToggle}
          />
        ),
      headerTitle: () => (
        <View style={styles.header}>
<Image source={require("../assets/DUicon.png")} style={styles.icon} />
          <Text>DU NEWS</Text>
          </View>
      ),
      headerTitleStyle: {
        alignSelf: "center",
        textAlign: "center",
        justifyContent: "center",
        flex: 1,
        fontSize: 20,
        fontWeight: "bold",
        color: MD3Colors.primary100,
      },
    });
  }, [props.navigation, isSearchBarVisible, searchQuery]);

  return (
   
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBarContainer}>
        <ProgressBar
          visible={isLoading}
          progress={0.5}
          color={MD3Colors.error50}
        />
      </View>
      {/* <Push/> */}
      
      <FlatList
        style={styles.flatlist}
        keyExtractor={(item) => item.id.toString()}
        data={NewsList}
        renderItem={({ item }) => (
          <CardItems
            navigation={props.navigation}
            source={item.source}
            id={item.id.toString()}
            title={item.title}
            description={item.description}
            url={item.url}
            urlToImage={item.urlToImage}
            publishedAt={item.publishedAt}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default HomeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  progressBarContainer: {
    marginBottom: 10,
  },
  flatlist: {
    flex: 1,
  },
  searchBar: {
    margin: 10,
    flex: 1,
    marginLeft: screenWidth * 0.4,
  },
    searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
   icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

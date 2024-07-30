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
        <Push/>
        <ProgressBar
          visible={isLoading}
          progress={0.5}
          color={MD3Colors.error50}
        />
      </View>
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
    marginLeft: screenWidth * 0.35,
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

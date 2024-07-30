import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList, ScrollView, Dimensions } from "react-native";
import { Button, MD3Colors, ProgressBar } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GlobalApi from "../Services/GlobalApi";
import { Article, ComponentNavigationProps } from "../utils/types";
import CardItems from "../components/CardItems";
import NewsView from './NewsView';

const categoryStack = createNativeStackNavigator();

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const NewsCategory = (props: ComponentNavigationProps) => {
  const [NewsList, setNewsList] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ["News", "Events", "Tender", "Press release"];

  const handlePress = async (category: string) => {
    try {
      setIsLoading(true);
      const result = (await GlobalApi.getByCategory(category)).data;
      setNewsList(result.articles);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const result = (await GlobalApi.getByCategory("news")).data;
      setNewsList(result.articles);
      setIsLoading(false);;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchNews();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBarContainer}>
        {isLoading && (
          <ProgressBar
            indeterminate
            color={MD3Colors.error50}
            style={styles.progressBar}
          />
        )}
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
       <View style={styles.buttonContainer}>
        <ScrollView horizontal contentContainerStyle={styles.buttonScrollView}>
          {categories.map((category, index) => (
            <Button
              style={styles.button}
              labelStyle={styles.buttonLabel}
              key={index}
              mode="contained"
              onPress={() => handlePress(category.toLowerCase())}
            >
              {category}
            </Button>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const CategoryStackScreen = () => {
  return (
    <categoryStack.Navigator>
      <categoryStack.Screen name="Category" component={NewsCategory} />
      <categoryStack.Screen name="NewsView" component={NewsView} />
    </categoryStack.Navigator>
  );
};

export default CategoryStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  progressBarContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  buttonScrollView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
    height: 40,
    backgroundColor: MD3Colors.primary50,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  flatlist: {
    flex: 1,
  },
  progressBar: {
    height: 3,
  },
});

import { FlatList, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useIsFocused } from '@react-navigation/native';
import { Article, ComponentNavigationProps } from '../utils/types';
import CardItems from '../components/CardItems';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsView from './NewsView';

// Retrieve data from AsyncStorage
const getData = async (): Promise<Article[]> => {
  try {
    const value = await AsyncStorage.getItem('@newsData');
    if (value !== null) {
      return JSON.parse(value);
    }
    return [];
  } catch (e) {
    alert("Something went wrong getting saved news");
    return [];
  }
};

// Delete article by ID
const deleteData = async (id: string) => {
  try {
    const existingData: Article[] = await getData();
    const filteredData = existingData.filter((item) => item.id !== id);
    const jsonValue = JSON.stringify(filteredData);
    await AsyncStorage.setItem('@newsData', jsonValue);
    alert("Article removed successfully");
  } catch (e) {
    alert("Something went wrong deleting the saved news");
  }
};

const savedStack = createNativeStackNavigator();

const Saved = (props: ComponentNavigationProps) => {
  const [savedNews, setSavedNews] = useState<Article[]>([]);
  // const focused = useIsFocused();
  const fetchData = async () => {
    const data = await getData();
    setSavedNews(data);
  };
  useEffect(() => {
    fetchData();
  },[]);
  // }, [focused]);

  const deleteHandler = async (id: string) => {
    await deleteData(id);
    // Refresh the list
    const updatedData = await getData();
    setSavedNews(updatedData);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatlist}
        data={savedNews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardItems
            source={item.source || ""}
            id={item.id}
            title={item.title}
            description={item.description}
            type={item.type || ""}
            url={item.url || ""}
            urlToImage={item.urlToImage || ""}
            publishedAt={item.publishedAt}
            navigation={props.navigation}
            handleDelete={() => deleteHandler(item.id)}
          />
        )}
      />
    </View>
  );
};

const SavedStackScreen = () => {
  return (
    <savedStack.Navigator>
      <savedStack.Screen name="Saved" component={Saved} />
      <savedStack.Screen name="NewsView" component={NewsView} />
    </savedStack.Navigator>
  );
};

export default SavedStackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlist: {
    flex: 1,
    width: '100%',
  },
});

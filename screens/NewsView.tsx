import { StyleSheet, View, Share } from "react-native";
import React, { useEffect } from "react";
import { Article, ComponentNavigationProps } from "../utils/types";
import DetailsCard from "../components/DetailsCard";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Save article data to AsyncStorage
const storeData = async (value: Article) => {
  try {
    const existingData: Article[] = (await getData()) || [];
    // Check if the article is already saved
    if (!existingData.find((d) => d.id === value.id)) {
      existingData.push(value);
      const jsonValue = JSON.stringify(existingData);
      await AsyncStorage.setItem("@newsData", jsonValue);
      alert("News article saved successfully");
    } else {
      alert("This article is already saved");
    }
  } catch (e) {
    alert("Something went wrong saving the news");
  }
};

// Retrieve data from AsyncStorage
const getData = async (): Promise<Article[]> => {
  try {
    const value = await AsyncStorage.getItem("@newsData");
    if (value !== null) {
      return JSON.parse(value);
    }
    return [];
  } catch (e) {
    alert("Something went wrong getting saved news");
    return [];
  }
};

const NewsView = (props: ComponentNavigationProps) => {
  const { id, title, source, description, urlToImage, url, publishedAt } = props.route.params as Article;

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() =>
            storeData({
              id,
              source,
              title,
              description,
              urlToImage,
              url,
              publishedAt,
              type: "",
            })
          }
        >
          Save
        </Button>
      ),
    });
  }, [props.navigation, id, title, source, description, urlToImage, url, publishedAt]);

  return (
    <DetailsCard
      title={title}
      source={source}
      description={description}
      urlToImage={urlToImage}
      url={url}
      publishedAt={publishedAt}
    />
  );
};

export default NewsView;

const styles = StyleSheet.create({});

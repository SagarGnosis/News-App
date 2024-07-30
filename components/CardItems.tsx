import React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Share,
} from "react-native";
import { Button, Card, IconButton, MD3Colors, Text } from "react-native-paper";
import { ComponentProps } from "../utils/types";
import * as WebBrowser from "expo-web-browser";

const handlePress = (props: ComponentProps) => {
  props.navigation.navigate("NewsView", {
    id: props.id,
    title: props.title,
    source: props.source,
    description: props.description,
    url: props.url,
    urlToImage: props.urlToImage,
    publishedAt: props.publishedAt,
  });
};

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const cardHeight = screenHeight * 0.21; // Adjust this value to control the height ratio

const CardItems = (props: ComponentProps) => {
  //Sharing News
  const shareNews = () => {
    Share.share({
      message:
        props.title + "\nRead More" + props.description + "\n" + props.url,
    });
  };
  return (
    <Pressable onPress={() => handlePress(props)}>
      <Card mode="elevated" style={styles.card}>
     
        <View style={styles.container}>
          {/* 1 */}
          {props.urlToImage && (
            <Image source={{ uri: props.urlToImage }} style={styles.image} />
          )}

          {/* 2 */}
          <View
            style={[
              styles.content,
              !props.urlToImage && styles.contentFullWidth,
            ]}
          >
            <View style={styles.header}>
              <Text
                numberOfLines={2}
                variant="titleMedium"
                style={styles.title}
              >
                {props.title}
              </Text>
              </View>
              <View>
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                style={styles.description}
              >
                {props.description}
              </Text>
            </View>
            <View style={styles.footer}>
              <Text variant="labelSmall" style={styles.date}>
                {new Date(props.publishedAt).toLocaleDateString()}
              </Text>
              </View>
              <View style={styles.name}>
              <Text variant="labelSmall" style={styles.source}>
                {props.source}
              </Text>
            </View>
          </View>

          {/* //3 */}
          <View style={styles.actions}>
            <IconButton
              icon="link"
              iconColor={MD3Colors.error50}
              size={20}
              onPress={() => WebBrowser.openBrowserAsync(props.url)}
            />
            <IconButton
              icon="share"
              iconColor={MD3Colors.error50}
              size={20}
              onPress={() => shareNews()}
            />
            {props.handleDelete && (
              <Card.Actions style={styles.deleteButtonContainer}>
                <IconButton
                  icon="delete"
                  iconColor={MD3Colors.error50}
                  size={20}
                  onPress={() =>
                    props.handleDelete && props.handleDelete(props.id)
                  }
                />
              </Card.Actions>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

export default CardItems;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "100%",
  },
  card: {
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
    height: cardHeight,
  },

  image: {
    width: screenHeight * 0.13, // Adjust this value to change the image size
    height: cardHeight, // Adjust this value to change the image size
    borderRadius: 8,
    resizeMode: "cover",
  },
  content: {
    height: cardHeight, 
    flex: 1,
    padding: 10,
    alignContent: "space-between",
    flexDirection: "column",
  },
  contentFullWidth: {
    width: "90%",
    alignContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  title: {
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  source: {
    color: "#888",
    flexShrink: 1,
  },
  description: {
    marginBottom: 10,
    overflow: "hidden"
  },
  footer: {
    position: "absolute",
    top: cardHeight - 30,
    right: 10,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    position: "absolute",
    top: cardHeight - 30,
    left: 10,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: "#888",
  },
  actions: {
    flexDirection: "column",
    alignContent: "space-around",
  },
  deleteButtonContainer: {
    alignSelf: "flex-end",
  },
});

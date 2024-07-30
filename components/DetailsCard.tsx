
import { Dimensions, ScrollView, StyleSheet, View , Share, TouchableOpacity} from 'react-native';
import React from 'react';
import { Card, Text, useTheme, FAB } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';


type DetailsCardProps = {
  title: string;
  source: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
}
const DetailsCard = (props: DetailsCardProps) => {
  const theme = useTheme();



  //Sharing News
const  shareNews = ()=>{
  Share.share({
    message : props.title +"\nRead More" + props.description + "\n" + props.url
  })
}

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.primary }]} variant="headlineMedium">
        {props.title}
      </Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface },{ boxShadow: '0px 2px 3.84px 0px rgba(0,0,0,0.25)' }]}>
          {props.urlToImage && <Card.Cover source={{ uri: props.urlToImage }} />}
          <Card.Content>
            <Text variant="labelSmall" textBreakStrategy="highQuality">
              {props.source}
            </Text>
            <Text variant="labelSmall">{props.description}</Text>
            <Text variant="labelSmall">{props.publishedAt}</Text>
            <TouchableOpacity onPress={()=> WebBrowser.openBrowserAsync(props.url)} > 
        <Text style ={{marginTop : 10, color: theme.colors.primary ,fontWeight: "bold", fontSize:15, }} >Read more</Text>
        </TouchableOpacity>
          </Card.Content>
        </Card>
        
      </ScrollView>
      <View style={styles.fabContainer}>
        <FAB
          icon="share"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => shareNews()}
        />
      </View>
    </View>
  );
};

export default DetailsCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingBottom: 80, // To ensure content is scrollable above FABs
  },
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fab: {
    marginLeft: 10,
  },
});

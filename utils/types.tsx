import { NavigationProp, RouteProp} from "@react-navigation/native";
export type NewsData = {
    status: string;
    totalResults: number;
    articles: Article[];
}

export type Article = {
    source:  string;
    id: string;
    title: string;
    description: string;
    type?: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    navigation?: NavigationProp<any>; 

}
export type ComponentProps={  
    source: string;
    id: string;
    title: string;
    description: string;
    type?: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    navigation: NavigationProp<any>; 
    handleDelete?: (id:string)=>void;
  }

export type ComponentNavigationProps = {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
}



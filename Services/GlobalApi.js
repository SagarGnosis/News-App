import { create} from "apisauce";


// define the api
const api = create ({
  baseURL: 'http://10.87.137.145:8800',
  // 'http://192.168.137.200:8800',
    // baseURL: 'http://192.168.169.101:8800', 192.168.137.1

  });

  // const getByCategory = (category) => api.get(`/api/news/category/${category}`)
  const getByCategory = (category) => {
    // console.log(`Fetching news for category: ${category}`);
    return api.get(`/api/news/category/${category}`);
  };
  
  const getNews = () => api.get('/api/news/all');

  const searchNews = (keyword) => {
    // console.log(`Searching news with keyword: ${keyword}`);
    return api.get('/api/news/search', { keyword });
  };

  const sendToken = (token) => {
    // console.log(`Sending token: ${token}`);
    return api.post('/api/users/push-token', { token });
  }


  export default{
    getNews,
    getByCategory,
    searchNews,
    sendToken
  };


  
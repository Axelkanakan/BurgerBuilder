import axios from 'axios';

const instance = axios.create({
    baseURL : 'https://react-my-burger-d4b5c.firebaseio.com/'
});

export default instance;
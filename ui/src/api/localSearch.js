import axios from 'axios';

const SERVER_PORT = 3001;
export default axios.create({
  baseURL: `http://${window.location.hostname}:${SERVER_PORT}` // assumes server running on same host
});

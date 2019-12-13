import axios from 'axios';

// If you run your own server, set the port and host in .env
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT || 3001;
const SERVER_HOST =
  process.env.REACT_APP_SERVER_HOST || window.location.hostname;
export default axios.create({
  baseURL: `http://${SERVER_HOST}:${SERVER_PORT}` // assumes server running on same host
});

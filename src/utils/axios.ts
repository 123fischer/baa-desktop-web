import axios from 'axios';

const baseAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_DOMAIN}`,
});

export default baseAxios;

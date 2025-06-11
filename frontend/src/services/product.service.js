import axios from 'axios';
import mockProducts from '../mocks/mockProducts';

const baseURL = 'http://localhost:3001';

const getProducts = async () => {
  try {
    const response = await axios.get(`${baseURL}/products`);
    return response.data;
  } catch (error) {
    return mockProducts;
  }
};

export default getProducts;

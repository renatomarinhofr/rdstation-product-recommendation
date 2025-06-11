import { useEffect, useState } from 'react';
import getProducts from '../services/product.service';

const useProducts = () => {
  const [preferences, setPreferences] = useState([]);
  const [features, setFeatures] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProducts();
        
        if (!fetchedProducts || !Array.isArray(fetchedProducts) || fetchedProducts.length === 0) {
          console.warn('Nenhum produto retornado do backend ou formato inválido');
          setLoading(false);
          return;
        }
        
        setProducts(fetchedProducts);
        
        const allPreferences = [];
        const allFeatures = [];

        fetchedProducts.forEach((product) => {
          if (product.preferences && Array.isArray(product.preferences)) {
            const productPreferences = product.preferences
              .sort(() => Math.random() - 0.5)
              .slice(0, 2);
            allPreferences.push(...productPreferences);
          }

          if (product.features && Array.isArray(product.features)) {
            const productFeatures = product.features
              .sort(() => Math.random() - 0.5)
              .slice(0, 2);
            allFeatures.push(...productFeatures);
          }
        });

        const uniquePreferences = [...new Set(allPreferences)];
        const uniqueFeatures = [...new Set(allFeatures)];

        setPreferences(uniquePreferences);
        setFeatures(uniqueFeatures);
      } catch (error) {
        console.error('Erro ao obter os produtos:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { preferences, features, products, loading, error };
};

export default useProducts;

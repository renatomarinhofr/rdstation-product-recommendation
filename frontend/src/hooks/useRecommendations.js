import { useState, useEffect } from 'react';
import recommendationService from '../services/recommendation.service';

function useRecommendations(products) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      console.log('Produtos atualizados no useRecommendations:', products);
      setRecommendations(products);
    }
  }, [products]);

  const getRecommendations = (formData) => {
    if (!products || products.length === 0) {
      console.warn('Nenhum produto disponível para recomendação');
      return [];
    }
    
    const newRecommendations = recommendationService.getRecommendations(formData, products);
    setRecommendations(newRecommendations);
    return newRecommendations;
  };

  return { recommendations, getRecommendations, setRecommendations };
}

export default useRecommendations;

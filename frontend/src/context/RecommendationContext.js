import React, { createContext, useState, useContext, useCallback } from 'react';
import recommendationService from '../services/recommendation.service';

export const RecommendationContext = createContext();

const initialFormState = {
  selectedPreferences: [],
  selectedFeatures: [],
  selectedRecommendationType: 'multiple',
};

export const RecommendationProvider = ({ children, initialProducts = [] }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [products, setProducts] = useState(initialProducts);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback((field, value) => {
    setFormData(prevData => ({ ...prevData, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setRecommendations([]);
  }, []);

  const getRecommendations = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = recommendationService.getRecommendations(formData, products);
      setRecommendations(results);
    } catch (err) {
      setError('Erro ao obter recomendações: ' + err.message);
      console.error('Erro ao obter recomendações:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formData, products]);

  const updateProducts = useCallback((newProducts) => {
    setProducts(newProducts);
  }, []);

  const contextValue = {
    formData,
    products,
    recommendations,
    isLoading,
    error,
    handleChange,
    resetForm,
    getRecommendations,
    updateProducts,
  };

  return (
    <RecommendationContext.Provider value={contextValue}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendation = () => {
  const context = useContext(RecommendationContext);
  
  if (!context) {
    throw new Error('useRecommendation must be used within a RecommendationProvider');
  }
  
  return context;
};

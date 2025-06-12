// Form.js

import React from 'react';
import useForm from '../../hooks/useForm';
import { Features, Preferences, RecommendationType } from './Fields';

function Form({ products, onFilter, onReset }) {
  const preferences = products ? [...new Set(products.flatMap(p => p.preferences || []))] : [];
  const features = products ? [...new Set(products.flatMap(p => p.features || []))] : [];
  
  const { formData, handleChange, resetForm } = useForm({
    selectedPreferences: [],
    selectedFeatures: [],
    selectedRecommendationType: 'multiple',
  });
  
  const hasSelectedFilters = formData.selectedPreferences.length > 0 || formData.selectedFeatures.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!products || products.length === 0) {
      console.warn('Nenhum produto disponível para filtrar');
      return;
    }
    
    onFilter(formData);
  };

  const handleReset = () => {
    resetForm();
    
    onReset();
  };

  if (!products || products.length === 0) {
    return <div className="p-4">Carregando opções...</div>;
  }

  return (
    <form
      className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-semibold mb-4">Filtrar produtos</h2>
      
      <Preferences
        preferences={preferences}
        selectedPreferences={formData.selectedPreferences}
        onPreferenceChange={(selected) =>
          handleChange('selectedPreferences', selected)
        }
      />
      <Features
        features={features}
        selectedFeatures={formData.selectedFeatures}
        onFeatureChange={(selected) =>
          handleChange('selectedFeatures', selected)
        }
      />
      <RecommendationType
        selectedRecommendationType={formData.selectedRecommendationType}
        onRecommendationTypeChange={(selected) =>
          handleChange('selectedRecommendationType', selected)
        }
      />
      <div className="flex justify-between mt-4">
        <button 
          type="submit" 
          disabled={!hasSelectedFilters}
          className={`px-4 py-2 rounded ${hasSelectedFilters 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-blue-300 text-white cursor-not-allowed'}`}
        >
          Filtrar produtos
        </button>
        <button 
          type="button" 
          onClick={handleReset}
          disabled={!hasSelectedFilters}
          className={`px-4 py-2 rounded ${hasSelectedFilters 
            ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          Limpar filtros
        </button>
      </div>
    </form>
  );
}

export default Form;

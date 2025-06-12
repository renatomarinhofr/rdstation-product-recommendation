// Fields.js
import React from 'react';

export const Preferences = ({ preferences, selectedPreferences, onPreferenceChange }) => {
  const handlePreferenceChange = (preference) => {
    const updatedPreferences = selectedPreferences.includes(preference)
      ? selectedPreferences.filter(p => p !== preference)
      : [...selectedPreferences, preference];
    
    onPreferenceChange(updatedPreferences);
  };

  return (
    <div className="mb-4">
      <h3 className="font-medium mb-2">Preferências:</h3>
      <div className="space-y-2">
        {preferences.map((preference) => (
          <div key={preference} className="flex items-center">
            <input
              type="checkbox"
              id={`preference-${preference}`}
              checked={selectedPreferences.includes(preference)}
              onChange={() => handlePreferenceChange(preference)}
              className="mr-2"
            />
            <label htmlFor={`preference-${preference}`}>{preference}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Features = ({ features, selectedFeatures, onFeatureChange }) => {
  const handleFeatureChange = (feature) => {
    const updatedFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];
    
    onFeatureChange(updatedFeatures);
  };

  return (
    <div className="mb-4">
      <h3 className="font-medium mb-2">Funcionalidades:</h3>
      <div className="space-y-2">
        {features.map((feature) => (
          <div key={feature} className="flex items-center">
            <input
              type="checkbox"
              id={`feature-${feature}`}
              checked={selectedFeatures.includes(feature)}
              onChange={() => handleFeatureChange(feature)}
              className="mr-2"
            />
            <label htmlFor={`feature-${feature}`}>{feature}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RecommendationType = ({ selectedRecommendationType, onRecommendationTypeChange }) => {
  return (
    <div className="mb-4">
      <h3 className="font-medium mb-2">Tipo de recomendação:</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="radio"
            id="multiple"
            name="recommendationType"
            value="multiple"
            checked={selectedRecommendationType === 'multiple'}
            onChange={() => onRecommendationTypeChange('multiple')}
            className="mr-2"
          />
          <label htmlFor="multiple">Múltiplos produtos</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="single"
            name="recommendationType"
            value="single"
            checked={selectedRecommendationType === 'single'}
            onChange={() => onRecommendationTypeChange('single')}
            className="mr-2"
          />
          <label htmlFor="single">Produto único</label>
        </div>
      </div>
    </div>
  );
};

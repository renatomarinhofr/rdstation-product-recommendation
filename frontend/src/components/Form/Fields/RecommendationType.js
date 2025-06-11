import React from 'react';
import Checkbox from '../../shared/Checkbox';

function RecommendationType({ selectedRecommendationType = 'multiple', onRecommendationTypeChange }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold mb-2">Tipo de Recomendação:</h2>
      <div className="flex items-center">
        <Checkbox
          type="radio"
          name="recommendationType"
          value="single"
          checked={selectedRecommendationType === 'single'}
          onChange={() => onRecommendationTypeChange('single')}
          className="mr-2"
        />
        <label htmlFor="single" className="mr-4">Produto Único</label>
        <Checkbox
          type="radio"
          name="recommendationType"
          value="multiple"
          checked={selectedRecommendationType === 'multiple'}
          onChange={() => onRecommendationTypeChange('multiple')}
          className="mr-2"
        />
        <label htmlFor="multiple">Múltiplos Produtos</label>
      </div>
    </div>
  );
}

export default RecommendationType;

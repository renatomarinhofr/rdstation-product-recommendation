import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecommendationProvider, useRecommendation } from './RecommendationContext';
import mockProducts from '../mocks/mockProducts';

const TestComponent = () => {
  const {
    formData,
    recommendations,
    isLoading,
    error,
    handleChange,
    resetForm,
    getRecommendations,
  } = useRecommendation();

  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'Carregando...' : 'Não carregando'}</div>
      {error && <div data-testid="error-message">{error}</div>}
      
      <div data-testid="preferences-count">{formData.selectedPreferences.length}</div>
      <div data-testid="features-count">{formData.selectedFeatures.length}</div>
      <div data-testid="recommendation-type">{formData.selectedRecommendationType}</div>
      
      <div data-testid="recommendations-count">{recommendations.length}</div>
      
      <button 
        data-testid="add-preference-btn" 
        onClick={() => handleChange('selectedPreferences', [...formData.selectedPreferences, 'Automação de marketing'])}
      >
        Adicionar Preferência
      </button>
      
      <button 
        data-testid="add-feature-btn" 
        onClick={() => handleChange('selectedFeatures', [...formData.selectedFeatures, 'Rastreamento de interações com clientes'])}
      >
        Adicionar Funcionalidade
      </button>
      
      <button 
        data-testid="change-type-btn" 
        onClick={() => handleChange('selectedRecommendationType', 'single')}
      >
        Mudar para Single
      </button>
      
      <button data-testid="reset-btn" onClick={resetForm}>
        Resetar
      </button>
      
      <button data-testid="get-recommendations-btn" onClick={getRecommendations}>
        Obter Recomendações
      </button>
    </div>
  );
};

describe('RecommendationContext', () => {
  test('inicializa com os valores padrão', () => {
    render(
      <RecommendationProvider>
        <TestComponent />
      </RecommendationProvider>
    );
    
    expect(screen.getByTestId('preferences-count')).toHaveTextContent('0');
    expect(screen.getByTestId('features-count')).toHaveTextContent('0');
    expect(screen.getByTestId('recommendation-type')).toHaveTextContent('multiple');
    expect(screen.getByTestId('recommendations-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Não carregando');
  });
  
  test('atualiza o estado do formulário corretamente', () => {
    render(
      <RecommendationProvider>
        <TestComponent />
      </RecommendationProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-preference-btn'));
    expect(screen.getByTestId('preferences-count')).toHaveTextContent('1');
    
    fireEvent.click(screen.getByTestId('add-feature-btn'));
    expect(screen.getByTestId('features-count')).toHaveTextContent('1');
    
    fireEvent.click(screen.getByTestId('change-type-btn'));
    expect(screen.getByTestId('recommendation-type')).toHaveTextContent('single');
  });
  
  test('reseta o formulário corretamente', () => {
    render(
      <RecommendationProvider>
        <TestComponent />
      </RecommendationProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-preference-btn'));
    fireEvent.click(screen.getByTestId('add-feature-btn'));
    
    fireEvent.click(screen.getByTestId('reset-btn'));
    
    expect(screen.getByTestId('preferences-count')).toHaveTextContent('0');
    expect(screen.getByTestId('features-count')).toHaveTextContent('0');
    expect(screen.getByTestId('recommendation-type')).toHaveTextContent('multiple');
    expect(screen.getByTestId('recommendations-count')).toHaveTextContent('0');
  });
  
  test('obtém recomendações corretamente', async () => {
    render(
      <RecommendationProvider initialProducts={mockProducts}>
        <TestComponent />
      </RecommendationProvider>
    );
    
      fireEvent.click(screen.getByTestId('add-preference-btn'));
    fireEvent.click(screen.getByTestId('add-feature-btn'));
    
    fireEvent.click(screen.getByTestId('get-recommendations-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('recommendations-count').textContent).not.toBe('0');
    });
    
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Não carregando');
  });
  
  test('obtém recomendação única quando o tipo é single', async () => {
    render(
      <RecommendationProvider initialProducts={mockProducts}>
        <TestComponent />
      </RecommendationProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-preference-btn'));
    fireEvent.click(screen.getByTestId('add-feature-btn'));
    
    fireEvent.click(screen.getByTestId('change-type-btn'));
    
    fireEvent.click(screen.getByTestId('get-recommendations-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('recommendations-count')).toHaveTextContent('1');
    });
  });
});

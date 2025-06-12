import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecommendationList from './RecommendationList';
import mockProducts from '../../mocks/mockProducts';

describe('RecommendationList Component', () => {
  test('renderiza mensagem quando não há recomendações', () => {
    render(<RecommendationList recommendations={[]} />);
    
    expect(screen.getByText('Nenhuma recomendação disponível.')).toBeInTheDocument();
    expect(screen.getByText('Selecione preferências e funcionalidades para obter recomendações.')).toBeInTheDocument();
  });
  
  test('renderiza mensagem quando recommendations é null ou undefined', () => {
    render(<RecommendationList recommendations={null} />);
    
    expect(screen.getByText('Nenhuma recomendação disponível.')).toBeInTheDocument();
    expect(screen.getByText('Selecione preferências e funcionalidades para obter recomendações.')).toBeInTheDocument();
  });
  
  test('renderiza produtos sem scores corretamente', () => {
    const productsWithoutScores = mockProducts.map(({ id, name, category, preferences, features }) => ({
      id, name, category, preferences, features
    }));
    
    render(<RecommendationList recommendations={productsWithoutScores} />);
    
    expect(screen.getByText('Produtos Recomendados')).toBeInTheDocument();
    
    expect(screen.getByText('RD Station CRM')).toBeInTheDocument();
    expect(screen.getByText('RD Station Marketing')).toBeInTheDocument();
    expect(screen.getByText('RD Conversas')).toBeInTheDocument();
    expect(screen.getByText('RD Mentor AI')).toBeInTheDocument();
    
    expect(screen.queryByText('Mais Recomendado')).not.toBeInTheDocument();
  });
  
  test('renderiza produtos com scores corretamente', () => {
    const productsWithScores = mockProducts.map((product, index) => ({
      ...product,
      score: 4 - index,
      matchedPreferences: product.preferences.slice(0, 1),
      matchedFeatures: product.features.slice(0, 1)
    }));
    
    render(<RecommendationList recommendations={productsWithScores} />);
    
    expect(screen.getByText('Produtos Recomendados')).toBeInTheDocument();
    
    expect(screen.getByText('RD Station CRM')).toBeInTheDocument();
    expect(screen.getByText('RD Station Marketing')).toBeInTheDocument();
    expect(screen.getByText('RD Conversas')).toBeInTheDocument();
    expect(screen.getByText('RD Mentor AI')).toBeInTheDocument();
    
    expect(screen.getByText('Mais Recomendado')).toBeInTheDocument();
    
    expect(screen.getAllByText('Preferências').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByText('Funcionalidades').length).toBeGreaterThanOrEqual(4);
  });
  
  test('exibe preferências e funcionalidades correspondentes destacadas', () => {
    const productsWithMatches = [{
      ...mockProducts[0],
      score: 2,
      matchedPreferences: [mockProducts[0].preferences[0]],
      matchedFeatures: [mockProducts[0].features[0]]
    }];
    
    render(<RecommendationList recommendations={productsWithMatches} />);
    
    const matchedElements = screen.getAllByRole('listitem');
    
    expect(matchedElements.length).toBeGreaterThan(0);
    
    const blueElements = screen.getByText('1', { selector: '.text-blue-600' });
    const purpleElements = screen.getByText('1', { selector: '.text-purple-600' });
    
    expect(blueElements).toBeInTheDocument();
    expect(purpleElements).toBeInTheDocument();
  });
  
  test('calcula corretamente a porcentagem de relevância', () => {
    const product = {
      ...mockProducts[0],
      score: 2,
      matchedPreferences: [mockProducts[0].preferences[0]],
      matchedFeatures: [mockProducts[0].features[0]]
    };
    
    render(<RecommendationList recommendations={[product]} />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});

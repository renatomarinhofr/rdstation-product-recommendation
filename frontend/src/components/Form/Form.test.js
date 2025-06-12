import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Form from './Form';
import mockProducts from '../../mocks/mockProducts';

describe('Form Component', () => {
  const mockOnFilter = jest.fn();
  const mockOnReset = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renderiza corretamente com as preferências e funcionalidades dos produtos', () => {
    render(<Form products={mockProducts} onFilter={mockOnFilter} onReset={mockOnReset} />);
    
    expect(screen.getByRole('heading', { name: 'Filtrar produtos' })).toBeInTheDocument();
    
    expect(screen.getByText('Preferências:')).toBeInTheDocument();
    expect(screen.getByText('Funcionalidades:')).toBeInTheDocument();
    
    expect(screen.getByLabelText('Automação de marketing')).toBeInTheDocument();
    expect(screen.getByLabelText('Integração com chatbots')).toBeInTheDocument();
    expect(screen.getByLabelText('Rastreamento de interações com clientes')).toBeInTheDocument();
  });
  
  test('botões de filtrar e limpar estão desabilitados inicialmente', () => {
    render(<Form products={mockProducts} onFilter={mockOnFilter} onReset={mockOnReset} />);
    
    const filterButton = screen.getByRole('button', { name: 'Filtrar produtos' });
    const resetButton = screen.getByRole('button', { name: 'Limpar filtros' });
    
    expect(filterButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });
  
  test('botões são habilitados quando filtros são selecionados', () => {
    render(<Form products={mockProducts} onFilter={mockOnFilter} onReset={mockOnReset} />);
    
    const preferenceCheckbox = screen.getByLabelText('Automação de marketing');
    fireEvent.click(preferenceCheckbox);
    
    const filterButton = screen.getByRole('button', { name: 'Filtrar produtos' });
    const resetButton = screen.getByRole('button', { name: 'Limpar filtros' });
    
    expect(filterButton).not.toBeDisabled();
    expect(resetButton).not.toBeDisabled();
  });
  
  test('chama onFilter com os dados corretos ao submeter o formulário', () => {
    render(<Form products={mockProducts} onFilter={mockOnFilter} onReset={mockOnReset} />);
    
    const preferenceCheckbox = screen.getByLabelText('Automação de marketing');
    fireEvent.click(preferenceCheckbox);
    
    const featureCheckbox = screen.getByLabelText('Rastreamento de interações com clientes');
    fireEvent.click(featureCheckbox);
    
    const filterButton = screen.getByRole('button', { name: 'Filtrar produtos' });
    fireEvent.click(filterButton);
    
    expect(mockOnFilter).toHaveBeenCalledTimes(1);
    expect(mockOnFilter).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedPreferences: ['Automação de marketing'],
        selectedFeatures: ['Rastreamento de interações com clientes'],
        selectedRecommendationType: 'multiple'
      })
    );
  });
  
  test('chama onReset ao clicar no botão de limpar filtros', () => {
    render(<Form products={mockProducts} onFilter={mockOnFilter} onReset={mockOnReset} />);
    
    const preferenceCheckbox = screen.getByLabelText('Automação de marketing');
    fireEvent.click(preferenceCheckbox);
    
    const resetButton = screen.getByRole('button', { name: 'Limpar filtros' });
    fireEvent.click(resetButton);
    
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
  
  test('limpa as seleções ao clicar no botão de limpar filtros', () => {
    const { rerender } = render(<Form products={mockProducts} onFilter={mockOnFilter} onReset={mockOnReset} />);
    
    const preferenceCheckbox = screen.getByLabelText('Automação de marketing');
    fireEvent.click(preferenceCheckbox);
    
    expect(preferenceCheckbox).toBeChecked();
    
    const resetButton = screen.getByRole('button', { name: 'Limpar filtros' });
    fireEvent.click(resetButton);
    
    rerender(<Form products={mockProducts} onFilter={mockOnFilter} onReset={mockOnReset} />);
    
    const updatedCheckbox = screen.getByLabelText('Automação de marketing');
    expect(updatedCheckbox).not.toBeChecked();
  });
});

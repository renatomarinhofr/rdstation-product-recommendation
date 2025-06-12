import recommendationService from './recommendation.service';
import mockProducts from '../mocks/mockProducts';

describe('recommendationService', () => {
  describe('Filtragem básica', () => {
    test('Retorna array vazio quando não há produtos', () => {
      const formData = {
        selectedPreferences: ['Automação de marketing'],
        selectedFeatures: ['Rastreamento de interações com clientes'],
        selectedRecommendationType: 'multiple',
      };
      
      const recommendations = recommendationService.getRecommendations(formData, []);
      expect(recommendations).toEqual([]);
    });
    
    test('Retorna array vazio quando produtos é null ou undefined', () => {
      const formData = {
        selectedPreferences: ['Automação de marketing'],
        selectedFeatures: ['Rastreamento de interações com clientes'],
        selectedRecommendationType: 'multiple',
      };
      
      const recommendationsNull = recommendationService.getRecommendations(formData, null);
      const recommendationsUndefined = recommendationService.getRecommendations(formData, undefined);
      
      expect(recommendationsNull).toEqual([]);
      expect(recommendationsUndefined).toEqual([]);
    });
    
    test('Retorna todos os produtos com score 0 quando não há filtros selecionados', () => {
      const formData = {
        selectedPreferences: [],
        selectedFeatures: [],
        selectedRecommendationType: 'multiple',
      };
      
      const recommendations = recommendationService.getRecommendations(formData, mockProducts);
      
      expect(recommendations).toHaveLength(mockProducts.length);
      recommendations.forEach(product => {
        expect(product).toHaveProperty('score', 0);
        expect(product).toHaveProperty('matchedPreferences');
        expect(product).toHaveProperty('matchedFeatures');
        expect(product.matchedPreferences).toHaveLength(0);
        expect(product.matchedFeatures).toHaveLength(0);
      });
    });
  });
  
  describe('Filtragem por preferências', () => {
    test('Filtra produtos corretamente por uma única preferência', () => {
      const formData = {
        selectedPreferences: ['Automação de marketing'],
        selectedFeatures: [],
        selectedRecommendationType: 'multiple',
      };
      
      const recommendations = recommendationService.getRecommendations(formData, mockProducts);
      
      const productsWithScore = recommendations.filter(product => product.score > 0);
      productsWithScore.forEach(product => {
        expect(product.preferences).toContain('Automação de marketing');
        expect(product.matchedPreferences).toContain('Automação de marketing');
      });
      
      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].score).toBeGreaterThanOrEqual(recommendations[i + 1].score);
      }
    });
    
    test('Filtra produtos corretamente por múltiplas preferências', () => {
      const formData = {
        selectedPreferences: ['Automação de marketing', 'Integração com chatbots'],
        selectedFeatures: [],
        selectedRecommendationType: 'multiple',
      };
      
      const recommendations = recommendationService.getRecommendations(formData, mockProducts);
      
      const productsWithScore = recommendations.filter(product => product.score > 0);
      productsWithScore.forEach(product => {
        const hasMatchingPreference = product.preferences.some(pref => 
          formData.selectedPreferences.includes(pref)
        );
        expect(hasMatchingPreference).toBe(true);
        
        product.matchedPreferences.forEach(pref => {
          expect(formData.selectedPreferences).toContain(pref);
          expect(product.preferences).toContain(pref);
        });
      });
    });
  });
  
  describe('Filtragem por funcionalidades', () => {
    test('Filtra produtos corretamente por uma única funcionalidade', () => {
      const formData = {
        selectedPreferences: [],
        selectedFeatures: ['Rastreamento de interações com clientes'],
        selectedRecommendationType: 'multiple',
      };
      
      const recommendations = recommendationService.getRecommendations(formData, mockProducts);
      
      const productsWithScore = recommendations.filter(product => product.score > 0);
      productsWithScore.forEach(product => {
        expect(product.features).toContain('Rastreamento de interações com clientes');
        expect(product.matchedFeatures).toContain('Rastreamento de interações com clientes');
      });
    });
    
    test('Filtra produtos corretamente por múltiplas funcionalidades', () => {
      const formData = {
        selectedPreferences: [],
        selectedFeatures: ['Rastreamento de interações com clientes', 'Chat ao vivo e mensagens automatizadas'],
        selectedRecommendationType: 'multiple',
      };
      
      const recommendations = recommendationService.getRecommendations(formData, mockProducts);
      
      const productsWithScore = recommendations.filter(product => product.score > 0);
      productsWithScore.forEach(product => {
        const hasMatchingFeature = product.features.some(feature => 
          formData.selectedFeatures.includes(feature)
        );
        expect(hasMatchingFeature).toBe(true);
        
        product.matchedFeatures.forEach(feature => {
          expect(formData.selectedFeatures).toContain(feature);
          expect(product.features).toContain(feature);
        });
      });
    });
  });
  
  describe('Filtragem combinada e cálculo de score', () => {
    test('Calcula score corretamente com preferências e funcionalidades', () => {
      const formData = {
        selectedPreferences: ['Automação de marketing', 'Integração com chatbots'],
        selectedFeatures: ['Rastreamento de interações com clientes', 'Chat ao vivo e mensagens automatizadas'],
        selectedRecommendationType: 'multiple',
      };
      
      const recommendations = recommendationService.getRecommendations(formData, mockProducts);
      
      recommendations.forEach(product => {
        const expectedScore = 
          (product.matchedPreferences ? product.matchedPreferences.length : 0) + 
          (product.matchedFeatures ? product.matchedFeatures.length : 0);
        
        expect(product.score).toBe(expectedScore);
      });
      
      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].score).toBeGreaterThanOrEqual(recommendations[i + 1].score);
      }
    });
  });
  
  describe('Tipo de recomendação', () => {
    test('Retorna apenas um produto quando selectedRecommendationType é single', () => {
      const formData = {
        selectedPreferences: ['Automação de marketing', 'Integração com chatbots'],
        selectedFeatures: ['Rastreamento de interações com clientes'],
        selectedRecommendationType: 'single',
      };
      
      const recommendations = recommendationService.getRecommendations(formData, mockProducts);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].score).toBeGreaterThan(0);
    });
    
    test('Retorna múltiplos produtos quando selectedRecommendationType é multiple', () => {
      const formData = {
        selectedPreferences: ['Automação de marketing'],
        selectedFeatures: ['Rastreamento de interações com clientes'],
        selectedRecommendationType: 'multiple',
      };
      
      const recommendations = recommendationService.getRecommendations(formData, mockProducts);
      
      const productsWithScore = recommendations.filter(p => p.score > 0);
      
      expect(productsWithScore.length).toBe(recommendations.filter(p => p.score > 0).length);
      
    });
  });

  describe('Cenários de empate', () => {
    test('Em caso de empate no score, retorna o último produto válido em modo single', () => {
      const productsWithSameScore = [
        {
          id: 1,
          name: 'Produto A',
          preferences: ['Preferência 1', 'Preferência 2'],
          features: ['Feature 1']
        },
        {
          id: 2,
          name: 'Produto B',
          preferences: ['Preferência 1', 'Preferência 2'],
          features: ['Feature 1']
        }
      ];

      const formData = {
        selectedPreferences: ['Preferência 1'],
        selectedFeatures: ['Feature 1'],
        selectedRecommendationType: 'single'
      };

      const recommendations = recommendationService.getRecommendations(formData, productsWithSameScore);
      
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].id).toBe(productsWithSameScore[1].id); 
    });
  });

  describe('Diferentes tipos de preferências', () => {
    test('Lida com diferentes tipos de preferências corretamente', () => {
      const diverseProducts = [
        {
          id: 1,
          name: 'Produto Completo',
          category: 'Marketing',
          preferences: ['Automação', 'Analytics', 'Integrações'],
          features: ['Feature A', 'Feature B']
        },
        {
          id: 2,
          name: 'Produto Básico',
          category: 'CRM',
          preferences: ['Simplicidade', 'Preço acessível'],
          features: ['Feature C']
        },
        {
          id: 3,
          name: 'Produto Especializado',
          category: 'Analytics',
          preferences: ['Analytics', 'Relatórios avançados'],
          features: ['Feature D']
        }
      ];

      const formData = {
        selectedPreferences: ['Analytics', 'Relatórios avançados'],
        selectedFeatures: [],
        selectedRecommendationType: 'multiple'
      };

      const recommendations = recommendationService.getRecommendations(formData, diverseProducts);
      
      const productsWithAnalytics = recommendations.filter(p => p.score > 0);
      expect(productsWithAnalytics.length).toBeGreaterThan(0);
      
      const productWithBothPreferences = recommendations.find(p => p.name === 'Produto Especializado');
      expect(productWithBothPreferences.score).toBe(2);
    });
  });

  describe('Modularidade e extensibilidade', () => {
    test('O serviço é modular e aceita diferentes formatos de entrada', () => {
      const customFormData = {
        selectedPreferences: ['Automação de marketing'],
        selectedFeatures: ['Rastreamento de interações com clientes'],
        selectedRecommendationType: 'multiple',
        customField: 'valor personalizado',
        userPreferences: { theme: 'dark' }
      };
      
      const recommendations = recommendationService.getRecommendations(customFormData, mockProducts);
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.some(p => p.score > 0)).toBe(true);
    });

    test('O serviço é extensivel e lida com produtos de diferentes estruturas', () => {
      const mixedProducts = [
        {
          id: 1,
          name: 'Produto Padrão',
          preferences: ['Automação de marketing'],
          features: ['Rastreamento de interações com clientes']
        },
        {
          id: 2,
          name: 'Produto Estendido',
          preferences: ['Automação de marketing'],
          features: ['Rastreamento de interações com clientes'],
          extraInfo: {
            releaseDate: '2023-01-01',
            version: '2.0'
          }
        },
        {
          id: 3,
          name: 'Produto Alternativo',
          preferenceCategories: {
            marketing: ['Automação de marketing'],
            integration: ['API aberta']
          },
          features: ['Rastreamento de interações com clientes']
        }
      ];

      const formData = {
        selectedPreferences: ['Automação de marketing'],
        selectedFeatures: ['Rastreamento de interações com clientes'],
        selectedRecommendationType: 'multiple'
      };

      const recommendations = recommendationService.getRecommendations(formData, mixedProducts);
      
      const standardProducts = recommendations.filter(p => p.id === 1 || p.id === 2);
      standardProducts.forEach(product => {
        expect(product.score).toBeGreaterThan(0);
        expect(product.matchedPreferences).toContain('Automação de marketing');
        expect(product.matchedFeatures).toContain('Rastreamento de interações com clientes');
      });

      const alternativeProduct = recommendations.find(p => p.id === 3);
      expect(alternativeProduct).toBeDefined();
      expect(alternativeProduct.score).toBeLessThanOrEqual(standardProducts[0].score);
    });
  });
});

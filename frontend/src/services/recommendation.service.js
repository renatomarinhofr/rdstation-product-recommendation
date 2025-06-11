
const getRecommendations = (
  formData = { selectedPreferences: [], selectedFeatures: [], selectedRecommendationType: '' },
  products
) => {
  if (!products || !Array.isArray(products)) {
    console.error('Nenhum produto disponível ou formato inválido');
    return [];
  }

  if (products.length === 0) {
    console.warn('Array de produtos está vazio');
    return [];
  }

  if (formData.selectedPreferences.length === 0 && formData.selectedFeatures.length === 0) {
    const productsWithScore = products.map(product => ({
      ...product,
      score: 0,
      matchedPreferences: [],
      matchedFeatures: [],
      totalMatches: 0
    }));
    
    return formData.selectedRecommendationType === 'single' ? [productsWithScore[0]] : productsWithScore;
  }

  const productsWithScores = products.map(product => {
    if (!product || !product.name) {
      console.warn('Produto inválido encontrado:', product);
      return { ...product, score: 0, matchedPreferences: [], matchedFeatures: [], totalMatches: 0 };
    }

    const hasPreferences = product.preferences && Array.isArray(product.preferences);
    const hasFeatures = product.features && Array.isArray(product.features);
    
    const matchedPreferences = hasPreferences 
      ? formData.selectedPreferences.filter(pref => product.preferences.includes(pref))
      : [];
    
    const matchedFeatures = hasFeatures 
      ? formData.selectedFeatures.filter(feature => product.features.includes(feature))
      : [];
    
    const score = matchedPreferences.length + matchedFeatures.length;
    const totalMatches = score;
    
    const totalFilters = formData.selectedPreferences.length + formData.selectedFeatures.length;
    const matchPercentage = totalFilters > 0 ? Math.round((score / totalFilters) * 100) : 0;
    
    return {
      ...product,
      score,
      matchedPreferences,
      matchedFeatures,
      totalMatches,
      matchPercentage
    };
  });

  let recommendedProducts = productsWithScores.filter(product => product.score > 0);
  
  if (recommendedProducts.length === 0) {
    return formData.selectedRecommendationType === 'single' ? [productsWithScores[0]] : productsWithScores;
  }
  
  recommendedProducts.sort((a, b) => b.score - a.score);
  
  if (formData.selectedRecommendationType === 'single') {
    const topProduct = [recommendedProducts[0]];
    return topProduct;
  }

  return recommendedProducts;
};

const recommendationService = { getRecommendations };

export default recommendationService;

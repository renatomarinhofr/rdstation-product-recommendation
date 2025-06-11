import React from 'react';

function RecommendationList({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Nenhuma recomendação disponível.</p>
        <p className="text-gray-500 text-sm">Selecione preferências e funcionalidades para obter recomendações.</p>
      </div>
    );
  }

  const hasScores = recommendations.some(product => 'score' in product);

  const sortedRecommendations = hasScores 
    ? [...recommendations].sort((a, b) => b.score - a.score)
    : recommendations;

  const topProduct = hasScores ? sortedRecommendations[0] : null;
  
  const maxPossibleScore = hasScores && topProduct ? 
    (topProduct.matchedPreferences?.length || 0) + (topProduct.matchedFeatures?.length || 0) : 1;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-6">Produtos Recomendados</h2>
      <div className="grid grid-cols-1 gap-8">
        {sortedRecommendations.map((product) => {
          const isTopProduct = hasScores && topProduct && product.id === topProduct.id;
          
          return (
            <div
              key={product.id}
              className={`border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow ${isTopProduct ? 'ring-2 ring-green-500' : ''}`}
              style={{ borderColor: isTopProduct ? '#10B981' : '', backgroundColor: isTopProduct ? '#f0fdf4' : 'white' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Categoria:</span> {product.category}
                  </p>
                </div>
                
                {isTopProduct && (
                  <div className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                    Mais Recomendado
                  </div>
                )}
              </div>
              
              <div className="border-b border-gray-200 mb-4"></div>
              
              {hasScores && (
                <div className="mb-5">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium mr-2">Relevância:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${isTopProduct ? 'bg-green-500' : 'bg-blue-600'}`}
                        style={{ width: `${(product.score / maxPossibleScore) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold ml-3">
                      {Math.round((product.score / maxPossibleScore) * 100)}%
                    </span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">Preferências</h4>
                  {product.preferences && product.preferences.length > 0 ? (
                    <ul className="space-y-2">
                      {product.preferences.map((pref, index) => {
                        const isMatched = product.matchedPreferences && product.matchedPreferences.includes(pref);
                        return (
                          <li key={index} className="flex items-center">
                            {isMatched ? (
                              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full mr-1">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                {pref}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-600">{pref}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Nenhuma preferência disponível</p>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">Funcionalidades</h4>
                  {product.features && product.features.length > 0 ? (
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => {
                        const isMatched = product.matchedFeatures && product.matchedFeatures.includes(feature);
                        return (
                          <li key={index} className="flex items-center">
                            {isMatched ? (
                              <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full mr-1">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                {feature}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-600">{feature}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Nenhuma funcionalidade disponível</p>
                  )}
                </div>
              </div>
              
              {hasScores && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">Resumo de Correspondências</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <span className="block text-xs text-gray-600">Preferências</span>
                      <div className="flex items-center justify-center mt-1">
                        <span className="text-lg font-bold text-blue-600">{product.matchedPreferences?.length || 0}</span>
                        <span className="text-xs text-gray-500 ml-1">/ {product.preferences?.length || 0}</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <span className="block text-xs text-gray-600">Funcionalidades</span>
                      <div className="flex items-center justify-center mt-1">
                        <span className="text-lg font-bold text-purple-600">{product.matchedFeatures?.length || 0}</span>
                        <span className="text-xs text-gray-500 ml-1">/ {product.features?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecommendationList;

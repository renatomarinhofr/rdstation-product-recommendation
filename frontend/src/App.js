import React, { useEffect } from 'react';
import Form from './components/Form/Form';
import RecommendationList from './components/RecommendationList/RecommendationList';
import useProducts from './hooks/useProducts';
import useRecommendations from './hooks/useRecommendations';
import recommendationService from './services/recommendation.service';

function App() {
  const { products, loading, error } = useProducts();
  const { recommendations, setRecommendations } = useRecommendations(products);

  useEffect(() => {
    if (products && products.length > 0 && !loading) {
      setRecommendations([]);
    }
  }, [products, loading, setRecommendations]);

  const filterProducts = (formData) => {
    if (!products || products.length === 0) {
      console.warn('App: Nenhum produto disponível para filtrar');
      return;
    }
    
    const filteredProducts = recommendationService.getRecommendations(formData, products);    
    setRecommendations(filteredProducts);
  };

  const resetRecommendations = () => {
    setRecommendations([]);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold mb-8">Recomendador de Produtos RD Station</h1>
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-3/4 lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-2 mb-4">
          <p className="text-lg">
            Bem-vindo ao Recomendador de Produtos RD Station. Aqui você pode encontrar uma variedade de produtos da RD Station, cada um projetado para atender às necessidades específicas do seu negócio. De CRM a Marketing, de Conversas a Inteligência Artificial, temos uma solução para ajudar você a alcançar seus objetivos. Use o formulário abaixo para selecionar suas preferências e funcionalidades desejadas e receba recomendações personalizadas de produtos que melhor atendam às suas necessidades.
          </p>
        </div>
        
        {error && (
          <div className="col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Erro ao carregar os produtos. Por favor, tente novamente mais tarde.</p>
          </div>
        )}
        
        {loading ? (
          <div className="col-span-2 flex justify-center items-center">
            <p className="text-lg">Carregando produtos...</p>
          </div>
        ) : (
          <>
            <div>
              <Form 
                products={products} 
                onFilter={filterProducts} 
                onReset={resetRecommendations} 
              />
            </div>
            <div>
              {recommendations && recommendations.length > 0 ? (
                <RecommendationList recommendations={recommendations} />
              ) : (
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Produtos Recomendados</h2>
                  <p className="text-gray-500 italic">Selecione filtros e clique em "Filtrar produtos" para ver recomendações.</p>
                  <p className="text-gray-500 text-sm mt-2">Quanto mais filtros você selecionar, mais personalizada será sua recomendação.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

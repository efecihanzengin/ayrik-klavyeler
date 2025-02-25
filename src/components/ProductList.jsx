import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ProductList = ({ products }) => {
  const { gender, categoryName, categoryId } = useParams();

  // URL'ler için slug oluşturan yardımcı fonksiyon
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // Türkçe karakterleri ve özel karakterleri '-' ile değiştir
      .replace(/-+/g, '-') // Birden fazla '-' karakterini tekli '-' yap
      .replace(/^-|-$/g, ''); // Baştaki ve sondaki '-' karakterlerini kaldır
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <Link 
            to={`/shop/${gender}/${categoryName}/${categoryId}/${createSlug(product.name)}/${product.id}`}
            className="block"
          >
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
              <img
                src={product.images[0].url}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {product.description.slice(0, 50)}...
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900">
                  ₺{product.price.toFixed(2)}
                </p>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 
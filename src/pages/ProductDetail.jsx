import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetail, clearProductDetail } from '../store/actions/productActions';
import { Loader, ArrowLeft } from 'lucide-react';
import { addToCart } from '../store/actions/cartActions';

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector(state => state.product.selectedProduct);
  const fetchState = useSelector(state => state.product.productFetchState);

  useEffect(() => {
    dispatch(fetchProductDetail(productId));

    // Cleanup function - component unmount olduğunda product detayını temizle
    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  if (fetchState === 'FETCHING') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (fetchState === 'FAILED' || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Ürün yüklenirken bir hata oluştu.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Geri dönüş butonu */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Geri Dön
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ürün görseli */}
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <img
            src={product.images[0].url}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Ürün detayları */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="ml-1 text-gray-600">{product.rating.toFixed(1)}</span>
            </div>
            <span className="mx-4 text-gray-300">|</span>
            <span className="text-gray-600">{product.sell_count} satış</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-3xl font-bold text-gray-900">
              ₺{product.price.toFixed(2)}
            </div>
            <div className={`px-4 py-2 rounded ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}
            </div>
          </div>

          <button
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className={`w-full py-3 px-8 rounded-lg text-white font-medium ${
              product.stock > 0 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 
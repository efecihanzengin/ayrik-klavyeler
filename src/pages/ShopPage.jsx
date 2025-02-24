import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/actions/productActions';
import { Loader, Search } from 'lucide-react';
import ProductList from '../components/ProductList';

// Debounce hook'u
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const MemoizedProductList = memo(ProductList);

const SORT_OPTIONS = [
  { value: '', label: 'Varsayılan Sıralama' },
  { value: 'price_asc', label: 'Fiyat (Düşükten Yükseğe)' },
  { value: 'price_desc', label: 'Fiyat (Yüksekten Düşüğe)' },
  { value: 'name_asc', label: 'İsim (A-Z)' },
  { value: 'name_desc', label: 'İsim (Z-A)' },
  { value: 'rating_desc', label: 'Puan (Yüksekten Düşüğe)' },
  { value: 'rating_asc', label: 'Puan (Düşükten Yükseğe)' }
];

const sortProducts = (products, sortOption) => {
  if (!sortOption) return products;

  const [field, direction] = sortOption.split('_');
  
  return [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      default:
        return 0;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
};

const ShopPage = () => {
  const dispatch = useDispatch();
  const { gender, categoryName, categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('filter') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const products = useSelector(state => state.product.productList);
  const total = useSelector(state => state.product.total);
  const fetchState = useSelector(state => state.product.fetchState);

  // Ürünleri getir
  useEffect(() => {
    const getProducts = async () => {
      const params = {};
      
      if (categoryId) {
        params.category = categoryId;
      }

      if (debouncedSearchTerm) {
        params.filter = debouncedSearchTerm;
      }

      if (sortOption) {
        const [field, direction] = sortOption.split('_');
        params.sortBy = field;
        params.sortDir = direction;
      }
      
      await dispatch(fetchProducts(params));
    };

    getProducts();
  }, [dispatch, categoryId, debouncedSearchTerm, sortOption]);

  // URL'i güncelle
  useEffect(() => {
    const params = {};
    
    if (debouncedSearchTerm) {
      params.filter = debouncedSearchTerm;
    }
    
    if (sortOption) {
      params.sort = sortOption;
    }

    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, sortOption, setSearchParams]);

  // Sıralanmış ürünleri hesapla
  const sortedProducts = sortProducts(products, sortOption);

  if (fetchState === 'FETCHING') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Debug bilgisi */}
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <p>Category ID: {categoryId}</p>
        <p>Total Products: {total}</p>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8 text-sm">
        <Link to="/" className="text-gray-500">Home</Link>
        <span className="text-gray-500">/</span>
        {gender && (
          <>
            <span className="text-gray-500 capitalize">{gender}</span>
            <span className="text-gray-500">/</span>
          </>
        )}
        {categoryName && (
          <>
            <span className="text-gray-500 capitalize">{categoryName}</span>
            <span className="text-gray-500">/</span>
          </>
        )}
        <span className="text-gray-900">Shop</span>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sort select */}
        <div className="w-full md:w-64">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full py-2 pl-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        {total} ürün bulundu
      </div>

      {/* Products Grid - Artık sıralanmış ürünleri gönderiyoruz */}
      <MemoizedProductList products={sortedProducts} />
    </div>
  );
};

export default ShopPage; 
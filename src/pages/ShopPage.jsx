import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/actions/productActions';
import { Loader, Search } from 'lucide-react';
import ProductList from '../components/ProductList';
import ReactPaginate from 'react-paginate';

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
  { value: 'price:asc', label: 'Fiyat (Düşükten Yükseğe)' },
  { value: 'price:desc', label: 'Fiyat (Yüksekten Düşüğe)' },
  { value: 'rating:asc', label: 'Puan (Düşükten Yükseğe)' },
  { value: 'rating:desc', label: 'Puan (Yüksekten Düşüğe)' }
];

const sortProducts = (products, sortOption) => {
  if (!sortOption) return products;

  const [field, direction] = sortOption.split(':');
  
  return [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'price':
        comparison = a.price - b.price;
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
  
  // URL'den başlangıç değerlerini al
  const [searchTerm, setSearchTerm] = useState(searchParams.get('filter') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Pagination state'leri
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(0);
  
  const products = useSelector(state => state.product.productList);
  const total = useSelector(state => state.product.total);
  const fetchState = useSelector(state => state.product.fetchState);

  // Toplam sayfa sayısını hesapla
  const pageCount = Math.ceil(total / itemsPerPage);

  // URL'i güncelle
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    // Mevcut parametreleri koru
    if (debouncedSearchTerm) {
      params.set('filter', debouncedSearchTerm);
    } else {
      params.delete('filter');
    }
    
    if (sortOption) {
      params.set('sort', sortOption);
    } else {
      params.delete('sort');
    }

    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, sortOption]);

  // Sayfa değişikliğini handle et
  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
    
    // URL'i güncelle
    const params = new URLSearchParams(searchParams);
    params.set('page', selectedItem.selected + 1);
    setSearchParams(params);
  };

  // URL'den sayfa numarasını al (ilk yüklemede)
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPage(page - 1); // 0-based index için -1
  }, []);

  // Ürünleri getir
  useEffect(() => {
    const getProducts = async () => {
      const params = {
        limit: itemsPerPage,
        offset: currentPage * itemsPerPage
      };
      
      // Kategori varsa ekle
      if (categoryId) {
        params.category = categoryId;
      }

      // Arama filtresi varsa ekle
      if (debouncedSearchTerm) {
        params.filter = debouncedSearchTerm;
      }

      // Sıralama varsa ekle
      if (sortOption) {
        params.sort = sortOption;
      }
      
      await dispatch(fetchProducts(params));
    };

    getProducts();
  }, [dispatch, categoryId, debouncedSearchTerm, sortOption, currentPage]);

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

      {/* Products Grid */}
      <MemoizedProductList products={sortedProducts} />

      {/* Pagination - pageCount > 0 kontrolü ekledik */}
      {pageCount > 0 && (
        <div className="mt-8 flex flex-col items-center">
          <ReactPaginate
            previousLabel="← Önceki"
            nextLabel="Sonraki →"
            pageCount={pageCount}
            onPageChange={handlePageChange}
            forcePage={currentPage}
            containerClassName="flex space-x-1 items-center"
            pageClassName="cursor-pointer transition-colors duration-200"
            pageLinkClassName="px-3 py-2 rounded hover:bg-gray-100 block min-w-[40px] text-center"
            previousClassName="cursor-pointer transition-colors duration-200"
            previousLinkClassName="px-4 py-2 rounded hover:bg-gray-100 block font-medium"
            nextClassName="cursor-pointer transition-colors duration-200"
            nextLinkClassName="px-4 py-2 rounded hover:bg-gray-100 block font-medium"
            activeClassName="!bg-blue-500 text-white hover:!bg-blue-600"
            disabledClassName="opacity-50 cursor-not-allowed pointer-events-none"
            breakClassName="px-3 py-2"
          />
          
          {/* Sayfa bilgisi */}
          <div className="mt-4 text-sm text-gray-600">
            Gösterilen: {currentPage * itemsPerPage + 1} - {Math.min((currentPage + 1) * itemsPerPage, total)} / Toplam: {total} ürün
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage; 
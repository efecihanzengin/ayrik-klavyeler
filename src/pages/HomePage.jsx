import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from '../components/ProductCard';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../store/actions/productActions';

const HomePage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.product.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // En yüksek rating'e sahip 5 kategoriyi al
  const topCategories = [...categories]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true
  };

  const slides = [
    {
      id: 1,
      title: "Yeni Sezon Koleksiyonu",
      subtitle: "2024 YAZ SEZONU",
      description: "En trend parçalarla stilinizi yenileyin, özel indirimlerle şıklığı yakalayın",
      buttonText: "Koleksiyonu Keşfet",
      bgImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "İndirim Fırsatları",
      subtitle: "SEZON SONU",
      description: "Seçili ürünlerde %50'ye varan indirimlerle gardırobunuzu yenileyin",
      buttonText: "Alışverişe Başla",
      bgImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Özel Tasarım Parçalar",
      subtitle: "LİMİTLİ KOLEKSİYON",
      description: "Benzersiz tasarımlarla tarzınızı yansıtın, sınırlı sayıda üretilen parçaları kaçırmayın",
      buttonText: "Hemen İncele",
      bgImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="flex flex-col">
      <div className="slider-container relative">
        <Slider {...sliderSettings}>
          {slides.map((slide) => (
            <div key={slide.id} className="relative h-[500px] md:h-[600px]">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              >
                <div className="absolute inset-0 bg-black/50">
                  <div className="container mx-auto px-4 h-full flex flex-col justify-center text-white max-w-4xl">
                    <h2 className="text-5xl md:text-7xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-xl md:text-2xl mb-4">{slide.subtitle}</p>
                    <p className="text-lg mb-8 max-w-xl">{slide.description}</p>
                    <button className="bg-orange-500 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-orange-600 transition-colors w-fit">
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Top Categories Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Top Categories</h2>
        
        {/* Mobile görünüm için */}
        <div className="flex flex-col gap-6 md:hidden">
          {topCategories.map((category) => (
            <Link 
              key={category.id}
              to={`/shop/${category.gender === 'k' ? 'kadin' : 'erkek'}/${category.code.split(':')[1]}/${category.id}`}
              className="relative h-64 group overflow-hidden rounded-lg shadow-md"
            >
              <img 
                src={category.img}
                alt={category.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-bold">{category.title}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{category.rating.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Desktop görünüm için */}
        <div className="hidden md:grid md:grid-cols-5 md:gap-6">
          {topCategories.map((category) => (
            <Link 
              key={category.id}
              to={`/shop/${category.gender === 'k' ? 'kadin' : 'erkek'}/${category.code.split(':')[1]}/${category.id}`}
              className="relative h-64 group overflow-hidden rounded-lg shadow-md"
            >
              <img 
                src={category.img}
                alt={category.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-bold">{category.title}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{category.rating.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

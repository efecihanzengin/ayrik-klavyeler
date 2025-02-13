import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
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
      title: "Fresh Groceries",
      subtitle: "DELIVERY SERVICE",
      description: "We deliver fresh groceries to your doorstep daily",
      buttonText: "Start Now",
      bgImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Quality Products",
      subtitle: "BEST PRICES",
      description: "Find the best quality products at affordable prices",
      buttonText: "Shop Now",
      bgImage: "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=2070&auto=format&fit=crop"
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
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors w-fit">
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Product Categories */}
      <div className="container mx-auto px-4 space-y-8 mt-12">
        {/* Category 1 */}
        <div className="flex flex-col space-y-4">
          <p className="text-gray-500">Your Space</p>
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Unique Life</h3>
            <a href="#" className="text-gray-500">Explore Items</a>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35" 
            alt="Unique Life" 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        {/* Category 2 */}
        <div className="flex flex-col space-y-4">
          <p className="text-gray-500">Ends Today</p>
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Elements Style</h3>
            <a href="#" className="text-gray-500">Explore Items</a>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1449339854873-750e6913301b" 
            alt="Elements Style" 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        {/* Category 3 */}
        <div className="flex flex-col space-y-4">
          <p className="text-gray-500">Ends Today</p>
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Elements Style</h3>
            <a href="#" className="text-gray-500">Explore Items</a>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1432139555190-58524dae6a55" 
            alt="Elements Style" 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

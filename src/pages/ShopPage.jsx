import { Link } from 'react-router-dom';

const ShopPage = () => {
  const categories = [
    {
      id: 1,
      title: "CLOTHS",
      itemCount: "5 items",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35"
    },
    {
      id: 2,
      title: "CLOTHS",
      itemCount: "9 items",
      image: "https://images.unsplash.com/photo-1449339854873-750e6913301b"
    },
    {
      id: 3,
      title: "CLOTHS",
      itemCount: "8 items",
      image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55"
    },
    {
      id: 4,
      title: "CLOTHS",
      itemCount: "7 items",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35"
    },
    {
      id: 5,
      title: "CLOTHS",
      itemCount: "6 items",
      image: "https://images.unsplash.com/photo-1449339854873-750e6913301b"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8 text-sm">
        <Link to="/" className="text-gray-500">Home</Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-900">Shop</span>
      </div>

      {/* Categories Grid */}
      <div className="flex flex-col gap-4 md:grid md:grid-cols-5 md:gap-6">
        {categories.map((category) => (
          <div key={category.id} className="relative h-[300px] group cursor-pointer">
            <img 
              src={category.image} 
              alt={category.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
              <h3 className="text-2xl font-bold">{category.title}</h3>
              <p className="text-sm mt-2">{category.itemCount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage; 
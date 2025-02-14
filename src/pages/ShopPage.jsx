import { Link } from 'react-router-dom';
import { useState } from 'react';

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

  // 36 adet ürün oluşturmak için yardımcı fonksiyon
  const generateProducts = () => {
    const productTemplates = [
      {
        title: "Graphic Design Hoodie",
        department: "English Department",
        price: "$16.48",
        salePrice: "$6.48",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
        colors: ["blue", "green", "red", "brown"]
      },
      {
        title: "Basic Tee",
        department: "Fashion Department",
        price: "$19.99",
        salePrice: "$9.99",
        image: "https://images.unsplash.com/photo-1449339854873-750e6913301b",
        colors: ["blue", "black", "gray", "white"]
      },
      {
        title: "Summer Shirt",
        department: "Casual Collection",
        price: "$24.99",
        salePrice: "$12.99",
        image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55",
        colors: ["yellow", "blue", "green", "pink"]
      }
    ];

    return Array.from({ length: 36 }, (_, index) => ({
      id: index + 1,
      ...productTemplates[index % productTemplates.length],
      title: `${productTemplates[index % productTemplates.length].title} ${Math.floor(index / 3) + 1}`
    }));
  };

  const products = generateProducts();

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

      {/* Ürünler Başlık ve Filtreler */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-12 mb-6">
        <p className="text-sm text-gray-500 mb-4 md:mb-0">Showing all 36 results</p>
        <div className="flex gap-4">
          <select className="border p-2 rounded">
            <option>Popularity</option>
            <option>Latest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
        </div>
      </div>

      {/* Ürünler Grid */}
      <div className="flex flex-col gap-6 md:grid md:grid-cols-4 md:gap-8">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col">
            <div className="relative group">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full aspect-[3/4] object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {product.colors.map((color, index) => (
                  <button 
                    key={index}
                    className={`w-4 h-4 rounded-full border border-gray-300`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-bold">{product.title}</h3>
              <p className="text-gray-500 text-sm">{product.department}</p>
              <div className="flex justify-center gap-2 mt-2">
                <span className="text-gray-400 line-through">{product.price}</span>
                <span className="text-blue-500">{product.salePrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button className="px-4 py-2 border rounded">Prev</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">1</button>
        <button className="px-4 py-2 border rounded">2</button>
        <button className="px-4 py-2 border rounded">3</button>
        <button className="px-4 py-2 border rounded">Next</button>
      </div>
    </div>
  );
};

export default ShopPage; 
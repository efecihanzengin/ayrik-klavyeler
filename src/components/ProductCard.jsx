const ProductCard = ({ title, subtitle, image, link }) => {
  return (
    <div className="flex flex-col space-y-4 flex-1">
      <p className="text-gray-500">{subtitle}</p>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">{title}</h3>
        <a href={link} className="text-gray-500 hover:text-gray-700">Explore Items</a>
      </div>
      <img 
        src={image} 
        alt={title} 
        className="w-full h-[300px] object-cover rounded-lg"
      />
    </div>
  );
};

export default ProductCard;

import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/tshirts/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <img src={product.image} className="w-full h-64 object-cover rounded" alt={product.name} />
      <h1 className="text-2xl font-semibold mt-4">{product.name}</h1>
      <p className="text-lg">${product.price}</p>
      <p>Colors: {product.colors}</p>
      <p>Sizes: {product.sizes}</p>
      <Link to={`/customize/${product.id}`} className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Customize
      </Link>
    </div>
  );
}

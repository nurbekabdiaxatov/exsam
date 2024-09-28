import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        setError("Mahsulotni olishda xatolik: " + error.message);
        toast.error("Mahsulotni olishda xatolik: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
      <p>
        <strong>Tavsif:</strong> {product.description}
      </p>
      <p>
        <strong>Narxi:</strong> ${product.price}
      </p>
      <p>
        <strong>Brend:</strong> {product.brand}
      </p>
      <p>
        <strong>Kategoriyasi:</strong> {product.category}
      </p>
      {/* Add more fields as necessary */}
    </div>
  );
}

export default ProductDetail;

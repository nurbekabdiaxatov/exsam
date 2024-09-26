import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/products");

        // Extract products from response.data.data
        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          console.error("Noto'g'ri formatdagi ma'lumot keldi:", response.data);
          setProducts([]); // Reset to an empty array on incorrect format
        }
      } catch (error) {
        console.error("Ma'lumotlarni olishda xatolik:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      const newProduct = {
        name,
        description,
        price: parseFloat(price),
        brand,
        category,
      };

      await axiosInstance.post("/products", newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the product list after adding a new product
      const updatedProducts = await axiosInstance.get("/products");

      // Extract products from response.data.data
      if (updatedProducts.data && Array.isArray(updatedProducts.data.data)) {
        setProducts(updatedProducts.data.data);
      } else {
        console.error(
          "Noto'g'ri formatdagi ma'lumot keldi:",
          updatedProducts.data
        );
        setProducts([]); // Reset to an empty array on incorrect format
      }

      // Clear the form inputs
      setName("");
      setDescription("");
      setPrice("");
      setBrand("");
      setCategory("");
    } catch (error) {
      console.error("Mahsulot qo'shishda xatolik:", error);
    }
  };

  return (
    <div>
      <h1>Yangi mahsulot qo'shish</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mahsulot nomi:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tavsif:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Narx:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0" // Ensure price is a positive number
          />
        </div>
        <div>
          <label>Brend:</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Kategoriya:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <button type="submit">Mahsulot qo'shish</button>
      </form>
    </div>
  );
}

export default Home;

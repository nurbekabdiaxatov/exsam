import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Button, Table } from "flowbite-react";

function Home() {
  const [products, setProducts] = useState([]); // State for products
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // State for editing a product
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/products");

        // Extract products from response.data.data
        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          throw new Error("Noto'g'ri formatdagi ma'lumot keldi.");
        }
      } catch (error) {
        setError("Ma'lumotlarni olishda xatolik: " + error.message);
      } finally {
        setLoading(false); // End loading state
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

      if (editingProduct) {
        // Update the product
        await axiosInstance.put(`/products/${editingProduct.id}`, newProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditingProduct(null); // Reset editing state
      } else {
        // Add a new product
        await axiosInstance.post("/products", newProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Refresh the product list after adding or updating a product
      const updatedProducts = await axiosInstance.get("/products");
      if (updatedProducts.data && Array.isArray(updatedProducts.data.data)) {
        setProducts(updatedProducts.data.data);
      } else {
        throw new Error("Noto'g'ri formatdagi ma'lumot keldi.");
      }

      // Clear the form inputs
      setName("");
      setDescription("");
      setPrice("");
      setBrand("");
      setCategory("");
    } catch (error) {
      setError("Mahsulot qo'shishda/xatolik: " + error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setBrand(product.brand);
    setCategory(product.category);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Mahsulotni o'chirmoqchimisiz?")) {
      try {
        const token = localStorage.getItem("access_token");
        await axiosInstance.delete(`/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Refresh the product list after deletion
        const updatedProducts = await axiosInstance.get("/products");
        if (updatedProducts.data && Array.isArray(updatedProducts.data.data)) {
          setProducts(updatedProducts.data.data);
        } else {
          throw new Error("Noto'g'ri formatdagi ma'lumot keldi.");
        }
      } catch (error) {
        setError("Mahsulotni o'chirishda xatolik: " + error.message);
      }
    }
  };

  if (loading) {
    return <div>Yuklanmoqda...</div>; // Loading feedback
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
      </h1>
      {error && <div style={{ color: "red" }}>{error}</div>}{" "}
      {/* Display error */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div>
          <label>Mahsulot nomi:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label>Tavsif:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
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
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label>Brend:</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label>Kategoriya:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="border rounded-md p-2 w-full"
          />
        </div>
        <Button type="submit" className="mt-4">
          {editingProduct ? "Mahsulotni yangilash" : "Mahsulot qo'shish"}
        </Button>
      </form>
      <h2 className="text-lg font-bold mb-2">Mahsulotlar ro'yxati</h2>
      {products.length === 0 ? (
        <p>Hech qanday mahsulot mavjud emas.</p>
      ) : (
        <Table className="w-full">
          <Table.Head>
            <Table.HeadCell>Mahsulot nomi</Table.HeadCell>
            <Table.HeadCell>Tavsif</Table.HeadCell>
            <Table.HeadCell>Narx</Table.HeadCell>
            <Table.HeadCell>Brend</Table.HeadCell>
            <Table.HeadCell>Kategoriya</Table.HeadCell>
            <Table.HeadCell>Amallar</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {products.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.description}</Table.Cell>
                <Table.Cell>{product.price.toFixed(2)} so'm</Table.Cell>
                <Table.Cell>{product.brand}</Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={() => handleEdit(product)}
                    className="mr-2"
                    color="purple"
                  >
                    Tahrirlash
                  </Button>
                  <Button onClick={() => handleDelete(product.id)} color="red">
                    O'chirish
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}

export default Home;

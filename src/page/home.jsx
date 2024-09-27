import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Button, Table, Modal } from "flowbite-react";
import { HiSearch, HiOutlinePencilAlt, HiTrash } from "react-icons/hi";
import { toast } from "react-hot-toast";

function Home() {
  const [products, setProducts] = useState([]); // State for products
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // State for editing a product
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [filterCategory, setFilterCategory] = useState(""); // Filter by category

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/products");
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
        user_id: editingProduct ? editingProduct.user_id : 1, // user_id ni o'zgartirmaslik
      };

      if (editingProduct) {
        await axiosInstance.put(`/products/${editingProduct.id}`, newProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Mahsulot yangilandi!"); // Toast notification
        setEditingProduct(null); // Reset editing state
      } else {
        await axiosInstance.post("/products", newProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Yangi mahsulot qo'shildi!"); // Toast notification
      }

      const updatedProducts = await axiosInstance.get("/products");
      if (updatedProducts.data && Array.isArray(updatedProducts.data.data)) {
        setProducts(updatedProducts.data.data);
      } else {
        throw new Error("Noto'g'ri formatdagi ma'lumot keldi.");
      }

      // Clear the form inputs
      clearForm();
    } catch (error) {
      setError("Mahsulot qo'shishda/xatolik: " + error.message);
    }
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setBrand("");
    setCategory("");
    setModalOpen(false); // Close the modal
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setBrand(product.brand);
    setCategory(product.category);
    setModalOpen(true); // Open modal for editing
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
        toast.success("Mahsulot o'chirildi!"); // Toast notification

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

  // Filter products based on the search term and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
      </h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Mahsulotni qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border rounded-md p-2 ml-2"
        >
          <option value="">Kategoriya bo'yicha filtrlash</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          {/* Add more categories as needed */}
        </select>
        <Button onClick={() => setModalOpen(true)} className="ml-2">
          Yangi mahsulot qo'shish
        </Button>
      </div>

      {/* Modal for adding/updating product */}
      <Modal show={modalOpen} onClose={clearForm}>
        <Modal.Header>
          {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
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
                min="0"
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
            <div className="mt-4">
              <Button type="submit">
                {editingProduct ? "Yangilash" : "Qo'shish"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Products Table */}
      <Table>
        <Table.Head>
          <Table.HeadCell>Mahsulot nomi</Table.HeadCell>
          <Table.HeadCell>Tavsif</Table.HeadCell>
          <Table.HeadCell>Narx</Table.HeadCell>
          <Table.HeadCell>Brend</Table.HeadCell>
          <Table.HeadCell>Kategoriya</Table.HeadCell>
          <Table.HeadCell>Amallar</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {filteredProducts.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>{product.description}</Table.Cell>
              <Table.Cell>{product.price}</Table.Cell>
              <Table.Cell>{product.brand}</Table.Cell>
              <Table.Cell>{product.category}</Table.Cell>
              <Table.Cell>
                <button className="mr-2" onClick={() => handleEdit(product)}>
                  <HiOutlinePencilAlt />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(product.id)}
                >
                  <HiTrash />
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default Home;

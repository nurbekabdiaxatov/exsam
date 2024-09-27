import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Button, Table, Modal } from "flowbite-react";
import { HiOutlinePencilAlt, HiTrash } from "react-icons/hi";
import { toast } from "sonner"; // Sonner dan toast
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/products");
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        throw new Error("Noto'g'ri formatdagi ma'lumot keldi.");
      }
    } catch (error) {
      handleTokenError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenError = (error) => {
    if (error.response && error.response.status === 401) {
      if (window.confirm("Token eskirgan. Yangilash kerakmi?")) {
        refreshToken();
      }
    } else {
      setError("Ma'lumotlarni olishda xatolik: " + error.message);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await axiosInstance.post("/auth/refresh-token", {
        refresh_token: refreshToken,
      });
      localStorage.setItem("access_token", response.data.access_token);
      toast.success("Token yangilandi!");
      fetchData();
    } catch (error) {
      setError("Tokenni yangilashda xatolik: " + error.message);
    }
  };

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
        user_id: editingProduct ? editingProduct.user_id : 1,
      };

      if (editingProduct) {
        await axiosInstance.put(`/products/${editingProduct.id}`, newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Mahsulot yangilandi!");
        setEditingProduct(null);
      } else {
        await axiosInstance.post("/products", newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Yangi mahsulot qo'shildi!");
      }

      fetchData();
      clearForm();
    } catch (error) {
      handleTokenError(error);
    }
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setBrand("");
    setCategory("");
    setEditingProduct(null); // Formani tozalaganda, tahrirlash holatini ham tozalash kerak
    setModalOpen(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product); // Tahrirlash holatini o'rnatish
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setBrand(product.brand);
    setCategory(product.category);
    setModalOpen(true); // Modalni ochish
  };

  const handleDelete = async (id) => {
    if (window.confirm("Mahsulotni o'chirmoqchimisiz?")) {
      try {
        const token = localStorage.getItem("access_token");
        await axiosInstance.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Mahsulot o'chirildi!");
        fetchData();
      } catch (error) {
        handleTokenError(error);
      }
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">
        {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
      </h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Mahsulotni qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-[#1e293b]"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border rounded-md p-2 ml-2 focus:outline-none focus:ring focus:ring-[#1e293b]"
        >
          <option value="">Kategoriya bo`yicha filtrlash</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          {/* Add more categories as needed */}
        </select>
        <Button onClick={() => setModalOpen(true)} className="ml-2">
          New Card
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
              <label className="font-semibold">Mahsulot nomi:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 20))} // Limit to 20 characters
                required
                className="border rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-[#1e293b]"
              />
            </div>
            <div>
              <label className="font-semibold">Tavsif:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="border rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-[#1e293b]"
              />
            </div>
            <div>
              <label className="font-semibold">Narx:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                className="border rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-[#1e293b]"
              />
            </div>
            <div>
              <label className="font-semibold">Brend:</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                className="border rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-[#1e293b]"
              />
            </div>
            <div>
              <label className="font-semibold">Kategoriya:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="border rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-[#1e293b]"
              />
            </div>
            <div className="mt-6">
              <Button type="submit" className="w-full ">
                {editingProduct ? "Yangilash" : "Qo'shish"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Table>
        <Table.Head>
          <Table.HeadCell>Nom</Table.HeadCell>
          <Table.HeadCell>Tavsif</Table.HeadCell>
          <Table.HeadCell>Narx</Table.HeadCell>
          <Table.HeadCell>Brend</Table.HeadCell>
          <Table.HeadCell>Kategoriya</Table.HeadCell>
          <Table.HeadCell>Amallar</Table.HeadCell>
        </Table.Head>
        {loading ? (
          <p className="mr">Yuklanmoqda...</p>
        ) : (
          <Table.Body className="divide-y">
            {filteredProducts.map((product) => (
              <Table.Row key={product.id}>
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.description}</Table.Cell>
                <Table.Cell>{product.price} so'm</Table.Cell>
                <Table.Cell>{product.brand}</Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>
                  <div className="flex">
                    <Button onClick={() => handleEdit(product)}>
                      <HiOutlinePencilAlt />
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      className="ml-2"
                    >
                      <HiTrash />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        )}
      </Table>
    </div>
  );
}

export default Home;

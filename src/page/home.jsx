import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Button, Table, Modal } from "flowbite-react";
import { HiOutlinePencilAlt, HiTrash } from "react-icons/hi";
import { toast } from "sonner"; // Sonner dan toast
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2"; // Bar chartni import qilish
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    setEditingProduct(null);
    setModalOpen(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setBrand(product.brand);
    setCategory(product.category);
    setModalOpen(true);
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

  // Kategoriya bo'yicha mahsulotlar sonini hisoblash
  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Total Price Calculation
  const calculateTotalPrice = () => {
    return paginatedProducts
      .reduce((total, product) => total + product.price, 0)
      .toFixed(2);
  };

  // Bar diagramma uchun ma'lumotlar
  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Mahsulotlar soni",
        data: Object.values(categoryCounts),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

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

      {/* Total Price Display */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">
          Umumiy suma: ${calculateTotalPrice()}
        </h2>
      </div>

      {/* Modal for adding/updating product */}
      <Modal show={modalOpen} onClose={clearForm}>
        <Modal.Header>
          {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold">Nom:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-md p-2 w-full mt-1"
                required
              />
            </div>
            <div className="mt-2">
              <label className="font-semibold">Tavsif:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded-md p-2 w-full mt-1"
                required
              />
            </div>
            <div className="mt-2">
              <label className="font-semibold">Narxi:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border rounded-md p-2 w-full mt-1"
                required
              />
            </div>
            <div className="mt-2">
              <label className="font-semibold">Brend:</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="border rounded-md p-2 w-full mt-1"
              />
            </div>
            <div className="mt-2">
              <label className="font-semibold">Kategoriyasi:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded-md p-2 w-full mt-1"
              />
            </div>
            <Button type="submit" className="mt-4">
              Saqlash
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Bar chart */}
      <Bar data={chartData} options={{ responsive: true }} />

      {/* Table for displaying products */}
      <Table className="mt-4">
        <Table.Head>
          <Table.HeadCell>Nom</Table.HeadCell>
          <Table.HeadCell>Tavsif</Table.HeadCell>
          <Table.HeadCell>Narxi</Table.HeadCell>
          <Table.HeadCell>Brend</Table.HeadCell>
          <Table.HeadCell>Kategoriyasi</Table.HeadCell>
          <Table.HeadCell>Amallar</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center">
                Yuklanmoqda...
              </Table.Cell>
            </Table.Row>
          ) : (
            paginatedProducts.map((product) => (
              <Table.Row
                key={product.id}
                onClick={() => handleProductClick(product.id)}
              >
                <Table.Cell>{product.name}</Table.Cell>
                <Table.Cell>{product.description}</Table.Cell>
                <Table.Cell>{product.price}</Table.Cell>
                <Table.Cell>{product.brand}</Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(product);
                    }}
                  >
                    <HiOutlinePencilAlt className="text-blue-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                  >
                    <HiTrash className="text-red-500" />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {/* Pagination controls */}
      <div className="flex justify-between mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Oldingi
        </Button>
        <span className="self-center">
          Sahifa {currentPage} / {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Keyingi
        </Button>
      </div>
    </div>
  );
}

export default Home;

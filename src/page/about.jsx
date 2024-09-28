import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Button, Table, Modal } from "flowbite-react";
import { HiOutlinePencilAlt, HiTrash } from "react-icons/hi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


function About() {
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

  // Define an array of brands
  const brands = [
    "Apple",
    "Dell",
    "HP",
    "Lenovo",
    "Acer",
    "Asus",
    "Microsoft",
    "Razer",
    "Samsung",
    "LG",
    "Toshiba",
    "MSI",
    // Add more brands as needed
  ];

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
    setBrand(product.brand); // Fix brand setting here
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



  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );


  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md ">
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
          className="border rounded-md p-2 w-full focus:outline-none border_select"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border rounded-md p-2 ml-2 focus:outline-none border_select"
        >
          <option value="">Kategoriya bo`yicha filtrlash</option>
          <option value="Laptop - Apple">Laptop - Apple</option>
          <option value="Laptop - Dell">Laptop - Dell</option>
          <option value="Laptop - HP">Laptop - HP</option>
          <option value="Laptop - Lenovo">Laptop - Lenovo</option>
          <option value="Laptop - Acer">Laptop - Acer</option>
          <option value="Laptop - Asus">Laptop - Asus</option>
          <option value="Laptop - Microsoft">Laptop - Microsoft</option>
          <option value="Laptop - Razer">Laptop - Razer</option>
          <option value="Laptop - Samsung">Laptop - Samsung</option>
          <option value="Laptop - LG">Laptop - LG</option>
          <option value="Laptop - Toshiba">Laptop - Toshiba</option>
          <option value="Laptop - MSI">Laptop - MSI</option>
          {/* Add more categories as needed */}
        </select>
        <Button onClick={() => setModalOpen(true)} className="ml-2">
          New Card
        </Button>
      </div>

      <Modal show={modalOpen} onClose={clearForm}>
        <Modal.Header>
          {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2">Nomi</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-md p-2 w-full border_select"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Tavsifi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded-md p-2 w-full border_select"
                required
              ></textarea>
            </div>
            <div>
              <label className="block mb-2">Narxi</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border rounded-md p-2 w-full border_select"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Brend</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="border rounded-md p-2 w-full border_select"
                required
              >
                <option value="">Brendni tanlang</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Kategoriya</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded-md p-2 w-full border_select"
                required
              >
                <option value="">Kategoriya bo`yicha filtrlash</option>
                <option value="Laptop - Apple">Laptop - Apple</option>
                <option value="Laptop - Dell">Laptop - Dell</option>
                <option value="Laptop - HP">Laptop - HP</option>
                <option value="Laptop - Lenovo">Laptop - Lenovo</option>
                <option value="Laptop - Acer">Laptop - Acer</option>
                <option value="Laptop - Asus">Laptop - Asus</option>
                <option value="Laptop - Microsoft">Laptop - Microsoft</option>
                <option value="Laptop - Razer">Laptop - Razer</option>
                <option value="Laptop - Samsung">Laptop - Samsung</option>
                <option value="Laptop - LG">Laptop - LG</option>
                <option value="Laptop - Toshiba">Laptop - Toshiba</option>
                <option value="Laptop - MSI">Laptop - MSI</option>
                {/* Add more categories as needed */}
              </select>
            </div>
            <Button type="submit" className="mt-4">
              Saqlash
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Table className="mt-6">
        <Table.Head>
          <Table.HeadCell>Nomi</Table.HeadCell>
          <Table.HeadCell>Tavsifi</Table.HeadCell>
          <Table.HeadCell>Narxi</Table.HeadCell>
          <Table.HeadCell>Brend</Table.HeadCell>
          <Table.HeadCell>Kategoriya</Table.HeadCell>
          <Table.HeadCell>Harakatlar</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {paginatedProducts.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell onClick={() => handleProductClick(product.id)}>
                {product.name}
              </Table.Cell>
              <Table.Cell>{product.description}</Table.Cell>
              <Table.Cell>${product.price}</Table.Cell>
              <Table.Cell>{product.brand}</Table.Cell>
              <Table.Cell>{product.category}</Table.Cell>
              <Table.Cell className="flex">
                <Button
                  onClick={() => handleEdit(product)}
                  className="mr-2"
                  color="light"
                >
                  <HiOutlinePencilAlt />
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
                  color="light"
                  className="text-red-600"
                >
                  <HiTrash />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <div className="flex justify-between mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Oldingi
        </Button>
        <span>
          Sahifa {currentPage} / {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Keyingi
        </Button>
      </div>
    </div>
  );
}

export default About;

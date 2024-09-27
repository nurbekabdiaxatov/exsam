import { useState, useEffect } from "react";
import { Button, Table, Modal } from "flowbite-react";
import { HiOutlinePencilAlt, HiTrash } from "react-icons/hi";
import { toast } from "react-hot-toast";

const usersData = [
  {
    username: "Nurbek",
    password: "nurbek",
    type: "user",
    id: 1,
  },
  {
    id: 2,
    type: "admin",
    username: "admin",
    password: "admin",
  },
  {
    id: 3,
    type: "fn22",
    username: "fn22",
    password: "final-exam",
  },
];

function Users() {
  const [users, setUsers] = useState(usersData);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("user");
  const [editingUser, setEditingUser] = useState(null);

  const clearForm = () => {
    setUsername("");
    setPassword("");
    setType("user");
    setEditingUser(null);
    setModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      // Update existing user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? { ...user, username, password, type }
            : user
        )
      );
      toast.success("Foydalanuvchi yangilandi!");
    } else {
      // Add new user
      const newUser = {
        id: users.length + 1,
        username,
        password,
        type,
      };
      setUsers((prev) => [...prev, newUser]);
      toast.success("Yangi foydalanuvchi qo'shildi!");
    }
    clearForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUsername(user.username);
    setPassword(user.password);
    setType(user.type);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Foydalanuvchini o'chirmoqchimisiz?")) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("Foydalanuvchi o'chirildi!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Foydalanuvchilar</h1>
      <Button onClick={() => setModalOpen(true)} className="mb-4">
        Yangi Foydalanuvchi
      </Button>

      {/* Modal for adding/updating user */}
      <Modal show={modalOpen} onClose={clearForm}>
        <Modal.Header>
          {editingUser
            ? "Foydalanuvchini tahrirlash"
            : "Yangi foydalanuvchi qo'shish"}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="font-semibold">Foydalanuvchi nomi:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-[#1e293b]"
              />
            </div>
            <div>
              <label className="font-semibold">Parol:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-[#1e293b]"
              />
            </div>
            <div>
              <label className="font-semibold">Rol:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-[#1e293b]"
              >
                <option value="user">Foydalanuvchi</option>
                <option value="admin">Admin</option>
                <option value="fn22">fn22</option>
              </select>
            </div>
            <div className="mt-6">
              <Button
                type="submit"
                className="w-full "
              >
                {editingUser ? "Yangilash" : "Qo'shish"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Users Table */}
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Foydalanuvchi nomi</Table.HeadCell>
          <Table.HeadCell>Rol</Table.HeadCell>
          <Table.HeadCell>Amallar</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {users.map((user) => (
            <Table.Row
              key={user.id}
              className="hover:bg-gray-200 cursor-pointer"
            >
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>{user.type}</Table.Cell>
              <Table.Cell className="flex text-center">
                <HiOutlinePencilAlt
                  className="text-[#1e293b] cursor-pointer"
                  onClick={() => handleEdit(user)}
                />
                <HiTrash
                  className="text-red-600 cursor-pointer ml-2"
                  onClick={() => handleDelete(user.id)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default Users;

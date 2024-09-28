import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  // Jami narxni hisoblash
  const totalSum = products.reduce(
    (acc, product) => acc + (product.price || 0),
    0
  );

  // Chart Data for Bar Chart
  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Mahsulotlar soni (Bar Chart)",
        data: Object.values(categoryCounts),
        backgroundColor: "rgb(21, 94, 117)",
      },
    ],
  };

  // Chart Data for Line Chart
  const lineChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Mahsulotlar soni (Line Chart)",
        data: Object.values(categoryCounts),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Chart Data for Pie Chart
  const pieChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Mahsulotlar soni (Pie Chart)",
        data: Object.values(categoryCounts),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Mahsulotlar statistikasi</h2>
        <p className="text-xl font-semibold">
          Jami mahsulotlar: {products.length}
        </p>
        <p className="text-xl font-semibold">
          Jami narx: {totalSum.toFixed(2)} $
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="flex flex-col md:flex-row md:gap-4 mt-4 ">
          <div className="bg-white p-4 rounded-lg shadow-md flex-1">
            <h3 className="font-semibold text-lg">Line Chart</h3>
            <Line data={lineChartData} options={{ responsive: true }} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex-1">
            <h3 className="font-semibold text-lg">Pie Chart</h3>
            <Pie data={pieChartData} options={{ responsive: true }} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Bar Chart</h3>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

export default Home;

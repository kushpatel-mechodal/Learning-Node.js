import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const productData = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        setError(error.message);
      }
    };
    productData();
  }, []);
  return (
    <>
      <div className="container">
        <h1>Product App</h1>
        <p>Total Products: {products.length}</p>

        {products.map((product) => (
          <div key={product.id}>
            <p>{product.modal}</p>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;

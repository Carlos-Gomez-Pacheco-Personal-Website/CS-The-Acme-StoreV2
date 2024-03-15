import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Fetch products from the server
    fetch("/api/products")
      .then((response) => response.json())
      .then(setProducts);
  }, []);

  const handleRegister = async () => {
    // Register user
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      console.log("Registration successful");
      const data = await response.json();
      setToken(data.token);
    }
  };

  const handleLogin = async () => {
    // Login user
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      console.log("Login successful");
      const data = await response.json();
      setToken(data.token);
    }
  };

  return (
    <div className="App">
      <h1>Store</h1>
      {!token ? (
        <div className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h2>{product.name}</h2>
              {/* Add more product details here */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

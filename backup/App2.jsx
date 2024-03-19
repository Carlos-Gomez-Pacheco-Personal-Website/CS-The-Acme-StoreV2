import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then(setProducts);
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await fetch(`/api/users/${userId}/favorites`, {
        headers: {
          "Content-Type": "application/json",
          authorization: window.localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (response.ok) {
        setFavorites(json);
      }
    };
    if (userId) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [userId]);

  const handleRegister = async () => {
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
      setUserId(data.id);
    }
  };

  const handleCreateProduct = async () => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newProductName }),
    });
    if (response.ok) {
      const newProduct = await response.json();
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setNewProductName("");
    } else {
      console.error("Failed to create product");
    }
  };

  const handleAddFavorite = async (userId, productId) => {
    const response = await fetch(`/api/users/${userId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productId }),
    });
    if (response.ok) {
      const data = await response.json();
      setFavorites([...favorites, data]);
    }
  };

  const handleRemoveFavorite = async (userId, favoriteId) => {
    const response = await fetch(
      `/api/users/${userId}/favorites/${favoriteId}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      setFavorites(favorites.filter((favorite) => favorite.id !== favoriteId));
    }
  };

  const handleLogout = () => {
    setUsername("");
    setPassword("");
    setProducts([]);
    setFavorites([]);
    console.log("Logout successful");
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
        <div>
          <input
            type="text"
            placeholder="New product name"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
          <button onClick={handleCreateProduct}>Create Product</button>
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <h2>{product.name}</h2>
                {favorites.some(
                  (favorite) => favorite.product_id === product.id
                ) ? (
                  <button onClick={() => handleRemoveFavorite(product.id)}>
                    Remove from Favorites
                  </button>
                ) : (
                  <button onClick={() => handleAddFavorite(product.id)}>
                    Add to Favorites
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;

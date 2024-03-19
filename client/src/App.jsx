// import PropTypes from "prop-types";
// import { useState, useEffect } from "react";
// import "./App.css";

// function App() {
//   const [products, setProducts] = useState([]);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [token, setToken] = useState(null);
//   const [favorites, setFavorites] = useState([]);
//   const [newProductName, setNewProductName] = useState("");
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     // Fetch products from the server
//     fetch("/api/products")
//       .then((response) => response.json())
//       .then(setProducts);
//   }, []);

//   const handleRegister = async () => {
//     // Register user
//     const response = await fetch("/api/users", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     });
//     if (response.ok) {
//       console.log("Registration successful");
//       const data = await response.json();
//       setToken(data.token);
//     }
//   };

//   const handleLogin = async () => {
//     // Login user
//     const response = await fetch("/api/auth", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username, password }),
//     });
//     if (response.ok) {
//       console.log("Login successful");
//       const data = await response.json();
//       setToken(data.token);
//       setUserId(data.id); // Store the user's ID
//     }
//   };

//   const handleCreateProduct = async () => {
//     const response = await fetch("/api/products", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name: newProductName }),
//     });
//     if (response.ok) {
//       const newProduct = await response.json();
//       setProducts((prevProducts) => [...prevProducts, newProduct]);
//       setNewProductName("");
//     } else {
//       console.error("Failed to create product");
//     }
//   };

//   const handleToggleFavorite = async (productId) => {
//     if (favorites.includes(productId)) {
//       // If the product is already a favorite, remove it from favorites
//       await fetch(`/api/users/${userId}/favorites/${productId}`, {
//         method: "DELETE",
//       });
//     } else {
//       // If the product is not a favorite, add it to favorites
//       await fetch(`/api/users/${userId}/favorites`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ product_id: productId }),
//       });
//     }
//     // Update favorites
//     fetchFavorites();
//   };

//   const fetchFavorites = async () => {
//     const response = await fetch(`/api/users/${userId}/favorites`);
//     if (response.ok) {
//       const data = await response.json();
//       setFavorites(data.map((favorite) => favorite.product_id)); // assuming the favorite object has a product_id property
//     } else {
//       console.error("Failed to fetch favorites");
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Store</h1>
//       {!token ? (
//         <div className="auth-form">
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button onClick={handleRegister}>Register</button>
//           <button onClick={handleLogin}>Login</button>
//         </div>
//       ) : (
//         <div>
//           <input
//             type="text"
//             placeholder="New product name"
//             value={newProductName}
//             onChange={(e) => setNewProductName(e.target.value)}
//           />
//           <button onClick={handleCreateProduct}>Create Product</button>
//           <div className="product-list">
//             {products.map((product) => (
//               <div key={product.id} className="product-item">
//                 <h2>{product.name}</h2>
//                 <button onClick={() => handleToggleFavorite(product.id)}>
//                   {favorites.includes(product.id)
//                     ? "Remove from Favorites"
//                     : "Add to Favorites"}
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

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
    // Fetch products from the server
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
      setUserId(data.id); // Store the user's ID
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
                {favorites.includes(product.id) ? (
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

// const handleAddFavorite = async (userId, productId) => {
//   const response = await fetch(`/api/users/${userId}/favorites`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ product_id: productId }),
//   });
//   if (response.ok) {
//     const data = await response.json();
//     setFavorites([...favorites, data]);
//   }
// };

// const handleRemoveFavorite = async (userId, favoriteId) => {
//   const response = await fetch(`/api/users/${userId}/favorites/${favoriteId}`, {
//     method: "DELETE",
//   });
//   if (response.ok) {
//     setFavorites(favorites.filter((favorite) => favorite.id !== favoriteId));
//   }
// };

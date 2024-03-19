const {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  createFavorite,
  destroyFavorite,
  authenticate,
  // userWithToken,
} = require("./db");

const express = require("express");
const app = express();
app.use(express.json());

//for deployment only
const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

// // Middleware to authenticate user by token
// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       throw new Error("No token provided");
//     }
//     const user = await userWithToken(token);
//     if (!user) {
//       throw new Error("Invalid token");
//     }
//     req.user = user;
//     next();
//   } catch (ex) {
//     next(ex);
//   }
// };

// Api routes authenticate user by token

app.post("/api/auth", async (req, res, next) => {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  } catch (ex) {
    next(ex);
  }
});

app.get(
  "/api/me", //authMiddleware,
  async (req, res, next) => {
    try {
      res.send(req.user);
    } catch (ex) {
      next(ex);
    }
  }
);

// Api users routes
app.get(
  "/api/users", //authMiddleware,
  async (req, res, next) => {
    try {
      res.send(await fetchUsers());
    } catch (ex) {
      next(ex);
    }
  }
);

app.post("/api/users", async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).send(user);
  } catch (ex) {
    next(ex);
  }
});

app.get(
  "/api/products", //authMiddleware,
  async (req, res, next) => {
    try {
      res.send(await fetchProducts());
    } catch (ex) {
      next(ex);
    }
  }
);

app.post("/api/products", async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).send(product);
  } catch (ex) {
    next(ex);
  }
});

app.get(
  "/api/users/:id/favorites", //authMiddleware,
  async (req, res, next) => {
    try {
      res.send(await fetchFavorites(req.params.id));
    } catch (ex) {
      next(ex);
    }
  }
);

app.post(
  "/api/users/:id/favorites", //authMiddleware,
  async (req, res, next) => {
    try {
      res.status(201).send(
        await createFavorite({
          user_id: req.params.id,
          product_id: req.body.product_id,
        })
      );
    } catch (ex) {
      next(ex);
    }
  }
);

app.delete(
  "/api/users/:userId/favorites/:id",
  //authMiddleware,
  async (req, res, next) => {
    try {
      await destroyFavorite({ user_id: req.params.userId, id: req.params.id });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  const [moe, lucy, larry, ethyl, dancing, singing, plateSpinning, juggling] =
    await Promise.all([
      createUser({ username: "moe", password: "moe_pw" }),
      createUser({ username: "lucy", password: "lucy_pw" }),
      createUser({ username: "larry", password: "larry_pw" }),
      createUser({ username: "ethyl", password: "ethyl_pw" }),
      createProduct({ name: "dancing" }),
      createProduct({ name: "singing" }),
      createProduct({ name: "plate spinning" }),
      createProduct({ name: "juggling" }),
    ]);

  console.log(await fetchUsers());
  console.log(await fetchProducts());

  const favorites = await Promise.all([
    createFavorite({ user_id: moe.id, product_id: dancing.id }),
    createFavorite({ user_id: moe.id, product_id: singing.id }),
    createFavorite({ user_id: ethyl.id, product_id: plateSpinning.id }),
    createFavorite({ user_id: ethyl.id, product_id: juggling.id }),
  ]);
  console.log(await fetchFavorites(moe.id));
  await destroyFavorite({ user_id: moe.id, id: favorites[0].id });
  console.log(await fetchFavorites(moe.id));

  console.log(`curl localhost:3000/api/users/${ethyl.id}/favorites`);

  console.log(
    `curl -X POST localhost:3000/api/users/${ethyl.id}/favorites -d '{"product_id": "${dancing.id}"}' -H 'Content-Type:application/json'`
  );
  console.log(
    `curl -X DELETE localhost:3000/api/users/${ethyl.id}/favorites/${favorites[3].id}`
  );

  console.log("data seeded");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};
init();

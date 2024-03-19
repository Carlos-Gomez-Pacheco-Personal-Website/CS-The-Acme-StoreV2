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
} = require("./db");

const express = require("express");
const app = express();
app.use(express.json());

const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

app.post("/api/auth", async (req, res, next) => {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/me", async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users", async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).send(user);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/products", async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).send(product);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:id/favorites", async (req, res, next) => {
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
});

app.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
  try {
    await destroyFavorite({ user_id: req.params.userId, id: req.params.id });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};
init();

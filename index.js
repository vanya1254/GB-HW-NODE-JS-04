const express = require("express");
const fs = require("fs");
const path = require("path");

const { idSchema, userSchema } = require("./validation/schema");
const { checkBody, checkParams } = require("./validation/validator");

const app = express();
const port = 3000;
const pathDB = path.join(__dirname, "db.json");

app.use(express.json());

app.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync(pathDB, "utf-8"));

  res.send(data);
});

app.get("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathDB, "utf-8")).users;

  res.send(users);
});

app.get("/users/:id", checkParams(idSchema), (req, res) => {
  const users = JSON.parse(fs.readFileSync(pathDB, "utf-8")).users;
  const user = users.find((user) => user.id === Number(req.params.id));

  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send({ user: null });
  }
});

app.post("/users", checkBody(userSchema), (req, res) => {
  const data = JSON.parse(fs.readFileSync(pathDB, "utf-8"));
  let id = data.users[data.users.length - 1].id;
  id += 1;

  const user = { id, href: `http://localhost:3000/users/${id}`, ...req.body };
  data.users.push(user);

  fs.writeFileSync(pathDB, JSON.stringify(data, null, 2));

  res.status(200).send(user);
});

app.put(
  "/users/:id",
  checkBody(userSchema),
  checkParams(idSchema),
  (req, res) => {
    const data = JSON.parse(fs.readFileSync(pathDB, "utf-8"));
    const user = data.users.find((user) => user.id === Number(req.params.id));

    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.login = req.body.login;
      user.password = req.body.password;
      user.age = req.body.age;

      fs.writeFileSync(pathDB, JSON.stringify(data, null, 2));

      res.status(200).send(user);
    } else {
      res.status(404).send({ user: null });
    }
  }
);

app.delete("/users/:id", checkParams(idSchema), (req, res) => {
  const data = JSON.parse(fs.readFileSync(pathDB, "utf-8"));
  const user = data.users.find((user) => user.id === Number(req.params.id));

  if (user) {
    const userById = data.users.indexOf(user);
    data.users.splice(userById, 1);

    fs.writeFileSync(pathDB, JSON.stringify(data, null, 2));

    res.status(200).send(user);
  } else {
    res.status(404).send({ user: null });
  }
});

app.use((req, res) => {
  res.status(404).send({ message: "Not Found Page" });
});

app.listen(port);

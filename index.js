import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "Tarupost@200129",
  port: 5432,
});

let lastId = 3;

// Middleware
db.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Write your code here//

//CHALLENGE 1: GET All posts
app.get("/posts", async (req, res) => {
  const result = await db.query("SELECT * FROM blogs");
  res.json(result.rows);
});

app.get("/user/posts/:username", async (req, res) => {
  const auth = req.params.username;
  console.log(auth);
  const result = await db.query("SELECT * FROM blogs WHERE author = $1", [
    auth,
  ]);
  console.log(result.rows);
  res.json(result.rows);
});
//CHALLENGE 2: GET a specific post by id
app.get("/posts/:id", async (req, res) => {
  const givenId = parseInt(req.params.id);
  const result = await db.query("SELECT * FROM blogs WHERE id = $1", [givenId]);
  res.json(result.rows[0]);
});
//CHALLENGE 3: POST a new post
app.post("/posts/:username", async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const author = req.params.username;
  console.log(title, content, author);

  await db.query("INSERT INTO blogs (title,content,author) VALUES ($1,$2,$3)", [
    title,
    content,
    author,
  ]);
  res.sendStatus(200);
});
//CHALLENGE 4: PATCH a post when you just want to update one parameter

app.patch("/posts/:id", async (req, res) => {
  const givenId = parseInt(req.params.id);
  try {
    await db.query("UPDATE blogs SET title = $1, content = $2 WHERE id = $3", [
      req.body.title,
      req.body.content,
      givenId,
    ]);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete("/posts/:id", async (req, res) => {
  const givenId = parseInt(req.params.id);
  const response = await db.query("DELETE FROM blogs where id = $1", [givenId]);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});

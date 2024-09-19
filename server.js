import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "blog",
  password: "Tarupost@200129",
  port: 5432,
});

db.connect();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let current_user;
// Route to render the main page
app.get("/", async (req, res) => {
  res.render("login.ejs");
});

app.post("/api/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, typeof password);
  try {
    const response = await db.query(
      "SELECT password FROM users WHERE username = $1",
      [username]
    );
    const result = response.rows[0];
    const saved_password = result.password;
    console.log(1, result, saved_password);
    if (saved_password === password) {
      current_user = username;
      res.redirect("/feed");
    } else {
      console.log("Passowrd you entered was incorrect.");
    }
  } catch (err) {
    console.log("Error", err.stack);
    res.render("login.ejs");
  }
});

app.get("/api/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      password,
    ]);
    current_user = username;
    res.redirect("/feed");
  } catch (err) {
    res.render("register.ejs");
    console.log(err);
  }
});
app.get("/feed", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render("feed.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});
// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/home", async (req, res) => {
  console.log(1, current_user);
  const response = await axios.get(`${API_URL}/user/posts/${current_user}`);
  res.render("index.ejs", { posts: response.data });
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(
      `${API_URL}/posts/${current_user}`,
      req.body
    );
    res.redirect("/feed");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/home");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/home");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

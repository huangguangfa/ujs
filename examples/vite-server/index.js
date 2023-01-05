import { createServer as createViteServer } from "vite";
import express from "express";
import http from "http";

const app = express();

const vite = await createViteServer({
  server: { middlewareMode: true },
});

app.use(vite.middlewares);

const server = http.createServer(app);
const port = 9000;

server.listen(port, async () => {
  console.log("localhost:9000");
});

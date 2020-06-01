import express, { response } from "express";

const app = express();

app.get("/users", (request, response) => {
  return response.json({ msg: "ok2" });
});

app.listen(3333);

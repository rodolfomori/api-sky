import { Router } from "express";
import express from "express";
import UserController from "./app/controllers/UserController";

// const routes = new Router();
const routes = express.Router();

routes.post("/users", UserController.store);

export default routes;

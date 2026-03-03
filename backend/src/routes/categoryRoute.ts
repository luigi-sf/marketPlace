import { Router } from "express";
import { CategoryController } from "../controller/categoryController";

const router = Router();
const controller = new CategoryController();

router.get("/", controller.list.bind(controller));

export default router;

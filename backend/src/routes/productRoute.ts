import { Router } from "express";
import { ProductController } from "../controller/productController";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { upload } from "../config/multer";

const router = Router();
const controller = new ProductController();

router.use(authMiddleware);

router.get("/", controller.getAll.bind(controller));

router.post(
  "/", authorize('ADMIN','SELLER'),
  upload.single("image"),
  controller.create.bind(controller)
);

router.get("/me",authorize('ADMIN','SELLER'), controller.getMyProducts.bind(controller));

router.patch("/:id/edit",authorize('ADMIN','SELLER'), controller.patchProduct.bind(controller));

router.get("/:id",authorize('ADMIN'), controller.getById.bind(controller));

router.delete(
  "/:id",
  controller.delete.bind(controller)
);

export default router;
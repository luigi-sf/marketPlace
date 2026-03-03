import { Router } from "express";
import { SellerProfileController } from "../controller/sellerProfileController";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();
const controller = new SellerProfileController()

router.use(authMiddleware);

router.post("/", controller.create.bind(controller));

router.get("/", controller.getAll.bind(controller));

router.get("/me", authorize('ADMIN','SELLER'), controller.getMyStore.bind(controller));



    router.put(
  "/me",authorize('SELLER'),  controller.updateMyStore.bind(controller));

  router.get(
  "/:id",authorize('ADMIN'),  controller.getById.bind(controller));


  router.put(
  "/:id",authorize('ADMIN'),  controller.update.bind(controller));



router.get(
  "/:id",authorize('ADMIN'), controller.getById.bind(controller));


router.delete(
  "/:id", controller.delete.bind(controller));

export default router

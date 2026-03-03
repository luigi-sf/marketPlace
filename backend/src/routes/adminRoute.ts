import { Router } from "express";
import { AdminController } from "../controller/adminDashboard";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { get } from "node:http";

const router = Router();
const controller = new AdminController();

router.use(authMiddleware);

router.get("/", authorize('ADMIN'), controller.dashboard.bind(controller));
router.get('/activeUsers', authorize('ADMIN'), controller.listUsers.bind(controller))
router.get('/viewProducts', authorize('ADMIN'), controller.listProducts.bind(controller))
router.get("/pending", (req, res, next) => {
    console.log("🟢 ROTA pending foi chamada!");
    next();
}, controller.getPending.bind(controller));
router.patch('/desactiveUser/:id', authorize('ADMIN'), controller.deactivate.bind(controller))
router.delete('/deleteProducts/:id', authorize('ADMIN'), controller.deleteProduct.bind(controller))


export default router;
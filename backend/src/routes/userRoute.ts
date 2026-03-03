import { Router } from "express";
import { UserController } from "../controller/userController";
import { authMiddleware } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";


const router = Router();
const controller = new UserController()


router.post('/', controller.create);
router.get('/', controller.list);

router.use(authMiddleware);

router.get('/:id',authorize('ADMIN'),controller.getById);
router.put('/:id',authorize('ADMIN'), controller.update);
router.delete('/:id', controller.remove);

export default router
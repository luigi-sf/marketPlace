import { NextFunction,Response,Request } from "express";
import { categoryService } from "../service/categoryService";
import { success } from "../utils/response";


export class CategoryController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoryService.list();
      return success (res,data)
    } catch (err) {
      next(err);
    }
  }
}

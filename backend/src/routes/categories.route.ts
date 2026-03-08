import { Router} from "express";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { createCategories, getAllCategories } from "../controllers/categories.controller.ts";

const categoryRouter = Router()

//create category
categoryRouter.post('/', authMiddleware, createCategories)

//get category
categoryRouter.get('/', authMiddleware, getAllCategories)

export default categoryRouter

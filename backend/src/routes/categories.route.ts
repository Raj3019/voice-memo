import { Router} from "express";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { createCategories, deleteCategory, getAllCategories, updateCategories } from "../controllers/categories.controller.ts";

const categoryRouter = Router()

//create category
categoryRouter.post('/', authMiddleware, createCategories)

//get category
categoryRouter.get('/', authMiddleware, getAllCategories)

//update category
categoryRouter.patch('/:categoryId', authMiddleware, updateCategories)

//delete category
categoryRouter.delete('/:categoryId', authMiddleware, deleteCategory)

export default categoryRouter

import type { Request, Response } from "express";
import { createCategories as createCategoriesService } from "../services/categories.service.ts";
import { getCategories as getCategoryService } from "../services/categories.service.ts";

export const createCategories = async(req: Request, res: Response) =>{
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({message: "Unauthorized"})
    }

    const {categoryName} = req.body

    const category = await createCategoriesService(userId, categoryName)

    return res.status(201).json({message: "Created Category Successfully", category})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Error creating category", error})
  }
}

export const getAllCategories = async (req:Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({message: "Unauthorized"})
    }

    const allCategories = await getCategoryService(userId)

    return res.status(200).json({message: "Categories fetched successfully", allCategories})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Unable to fetch categories", error})
  }
}
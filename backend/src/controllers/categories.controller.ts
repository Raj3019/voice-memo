import type { Request, Response } from "express";
import { createCategories as createCategoriesService } from "../services/categories.service.ts";
import { getCategories as getCategoryService } from "../services/categories.service.ts";
import { updateCategories as updateCategoryService } from "../services/categories.service.ts";
import { deleteCategory as deleteCategoryService } from "../services/categories.service.ts";

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


export const updateCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const categoryId = req.params.categoryId as string

    if (!userId) {
      return res.status(401).json({message: "Unauthorized"})
    }

    if (!categoryId) {
      return res.status(400).json({message: "Category ID is required"})
    }

    const { categoryName } = req.body
    const update = await updateCategoryService(userId, categoryId, categoryName)

    if (update.length === 0) {
      return res.status(404).json({ message: "Category not found or doesn't belong to you" })
    }

    return res.status(200).json({ message: "Category updated successfully", update: update[0] })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Unable to update category", error })
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const categoryId = req.params.categoryId as string

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" })
    }

    const deleted = await deleteCategoryService(userId, categoryId)

    if (deleted.length === 0) {
      return res.status(404).json({ message: "Category not found or doesn't belong to you" })
    }

    return res.status(200).json({ message: "Category deleted successfully" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Unable to delete category", error })
  }
}

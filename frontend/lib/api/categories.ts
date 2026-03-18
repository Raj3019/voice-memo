import { apiClient } from "@/lib/api/client";
import { slugifyCategoryName } from "@/lib/api/utils";
import type { Category } from "@/lib/types";

type CategoryRow = {
  id: string;
  categoryName: string;
  createdAt: string;
};

type CategoriesResponse = {
  allCategories: CategoryRow[];
};

const CATEGORY_CACHE_TTL_MS = 60_000;
let categoriesCache: Category[] | null = null;
let categoriesCacheAt = 0;
let categoriesPromise: Promise<Category[]> | null = null;

function normalizeCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.categoryName,
    slug: slugifyCategoryName(row.categoryName),
    createdAt: row.createdAt,
  };
}

export async function getCategories() {
  const now = Date.now();
  if (categoriesCache && now - categoriesCacheAt < CATEGORY_CACHE_TTL_MS) {
    return categoriesCache;
  }

  if (!categoriesPromise) {
    categoriesPromise = apiClient
      .get<CategoriesResponse>("/api/category")
      .then((response) => {
        const normalized = response.data.allCategories.map(normalizeCategory);
        categoriesCache = normalized;
        categoriesCacheAt = Date.now();
        return normalized;
      })
      .finally(() => {
        categoriesPromise = null;
      });
  }

  return categoriesPromise;
}

export async function createCategory(categoryName: string) {
  const { data } = await apiClient.post<{ category: CategoryRow }>("/api/category", {
    categoryName,
  });

  invalidateCategoryCache();
  return normalizeCategory(data.category);
}

export async function updateCategory(categoryId: string, categoryName: string) {
  const { data } = await apiClient.patch<{ update: CategoryRow }>(`/api/category/${categoryId}`, {
    categoryName,
  });

  invalidateCategoryCache();
  return normalizeCategory(data.update);
}

export async function deleteCategory(categoryId: string) {
  await apiClient.delete(`/api/category/${categoryId}`);
  invalidateCategoryCache();
}

export function invalidateCategoryCache() {
  categoriesCache = null;
  categoriesCacheAt = 0;
  categoriesPromise = null;
}

import { SavedRecipe } from "@/types/savedRecipe";

const STORAGE_KEY = "dr_cannabis_recipes";

export function saveRecipe(recipe: SavedRecipe): void {
  const recipes = getAllRecipes();
  recipes.push(recipe);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function getAllRecipes(): SavedRecipe[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function deleteRecipe(id: string): void {
  const recipes = getAllRecipes().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function getRecipeById(id: string): SavedRecipe | null {
  return getAllRecipes().find(r => r.id === id) || null;
}

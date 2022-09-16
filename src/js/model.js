import { API_URL, RES_PER_PAGE } from "./config";
import { getJson } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const init = () => {
  const bookmarksStorage = localStorage.getItem("bookmarks");
  bookmarksStorage && (state.bookmarks = JSON.parse(bookmarksStorage));
};

export const loadRecipe = async (id) => {
  try {
    const data = await getJson(`${API_URL}/${id}`);

    let { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async (query) => {
  try {
    state.search.query = query;

    const data = await getJson(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
      };
    });

    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultPage = (page = state.search.page) => {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = (newServings) => {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const saveBookmarks = () => {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = (recipe) => {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  saveBookmarks();
};

export const deleteBookmark = (id) => {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  saveBookmarks();
};

// Development IIFE
// (() => {
//   localStorage.clear("bookmarks");
// })();

init();

import "core-js/stable";
import "regenerator-runtime/runtime";

import { MODAL_CLOSE_SEC } from "./config.js";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import searchResultsView from "./views/searchResultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

if (module.hot) {
  module.hot.accept();
}

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

const controlRecipes = async () => {
  const id = window.location.hash.slice(1);
  if (!id) return;

  recipeView.renderSpinner();

  searchResultsView.update(model.getSearchResultPage());
  bookmarksView.update(model.state.bookmarks);

  try {
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(`${error} 🤷‍♂️`);
  }
};

const controlSearchResults = async () => {
  searchResultsView.renderSpinner();

  try {
    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    searchResultsView.render(model.getSearchResultPage());
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(`${error} 🤷‍♂️`);
  }
};

const controlPagination = (page) => {
  searchResultsView.render(model.getSearchResultPage(page));
  paginationView.render(model.state.search);
};

const controlServings = (servings) => {
  model.updateServings(servings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe)
    : model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

controlAddRecipe = async (newRecipe) => {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(`${error} 🤷‍♂️`);
    addRecipeView.renderError(error.message);
  }
};

init();

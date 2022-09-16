import "core-js/stable";
import "regenerator-runtime/runtime";

import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import searchResultsView from "./views/searchResultsView.js";
import paginationView from "./views/paginationView.js";

if (module.hot) {
  module.hot.accept();
}

const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

const controlRecipes = async () => {
  const id = window.location.hash.slice(1);
  if (!id) throw new Error("No recipe ID found");

  recipeView.renderSpinner();

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

init();

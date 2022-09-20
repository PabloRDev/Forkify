import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { MODAL_CLOSE_SEC } from './config.js'
import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import searchResultsView from './views/searchResultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'
import shoppingListView from './views/shoppingListView.js'
/**
 * Hot Module Replacement (HMR)
 */
if (module.hot) {
  module.hot.accept()
}
/**
 * Init: Set handlers functions to views methods
 */
const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
  shoppingListView.addHandlerShoppingList(controlShoppingList)
}
/**
 * Control function: pass id to model and data of recipe to update recipeView
 * @param {string} id
 */
const controlRecipes = async () => {
  const id = window.location.hash.slice(1)

  if (!id) return

  recipeView.renderSpinner()

  searchResultsView.update(model.getSearchResultsPage())
  bookmarksView.update(model.state.bookmarks)

  try {
    await model.loadRecipe(id)
    recipeView.render(model.state.recipe)
  } catch (error) {
    recipeView.renderError()
    console.error(`${error} 🤷‍♂️`)
  }
}
/**
 * Control function: pass query to model and data of search results to render searchResultsView and paginationView
 */
const controlSearchResults = async () => {
  searchResultsView.renderSpinner()

  try {
    const query = searchView.getQuery()
    if (!query) return

    await model.loadSearchResults(query)
    searchResultsView.render(model.getSearchResultsPage())
    paginationView.render(model.state.search)
  } catch (error) {
    console.error(`${error} 🤷‍♂️`)
  }
}
/**
 * Control function: pass page to model and data of pagination to render searchResultsView and paginationView
 * @param {number} page
 */
const controlPagination = (page) => {
  searchResultsView.render(model.getSearchResultsPage(page))
  paginationView.render(model.state.search)
}
/**
 * Control function: pass servings to model and data of recipe to update recipeView
 * @param {number} servings
 */
const controlServings = (servings) => {
  model.updateServings(servings)
  recipeView.update(model.state.recipe)
}
/**
 * Control function: pass data of recipe bookmarked to model, update bookmarksView and pass data of bookmarks to update bookmarksView
 */
const controlAddBookmark = () => {
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe)
    : model.deleteBookmark(model.state.recipe.id)

  recipeView.update(model.state.recipe)
  bookmarksView.render(model.state.bookmarks)
  model.addShoppingList(model.state.bookmarks)
}
/**
 * Control function: pass data of bookmarks to render bookmarksView
 */
const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks)
}
/**
 *  Control function: pass data of new recipe to model, recipeView and addRecipeView; set actions post upload
 * @param {object} newRecipe
 */
const controlAddRecipe = async (newRecipe) => {
  try {
    addRecipeView.renderSpinner()

    await model.uploadRecipe(newRecipe)
    recipeView.render(model.state.recipe)
    addRecipeView.renderSuccess()
    bookmarksView.render(model.state.bookmarks)
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    setTimeout(() => {
      addRecipeView.toggleWindow()
      addRecipeView.render(model.state.recipe)
    }, MODAL_CLOSE_SEC * 1000)
  } catch (error) {
    console.error(`${error} 🤷‍♂️`)
    addRecipeView
      .renderError(error.message)
    setTimeout(() => {
      addRecipeView.render(model.state.recipe)
    }, MODAL_CLOSE_SEC * 1000)
  }
}

const controlShoppingList = () => {
  const shoppingList = model.state.shoppingList
  model.addShoppingList(model.state.bookmarks)
  shoppingListView.render(shoppingList)
}

init()

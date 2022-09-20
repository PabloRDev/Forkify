/* eslint-disable no-undef */
/* eslint-disable no-useless-catch */
import { API_URL, RES_PER_PAGE, API_KEY } from './config'
import { AJAX } from './helpers'

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1
  },
  bookmarks: []
}
/**
 * Init: Load bookmarks from local storage and set them to state.bookmarks
 */
const init = () => {
  const bookmarksStorage = localStorage.getItem('bookmarks')
  bookmarksStorage && (state.bookmarks = JSON.parse(bookmarksStorage))
}
/**
  * Load a recipe from the API and store it in state.recipe
 * @param {number} id of the recipe
 * @throws {Error}
 */
export const loadRecipe = async (id) => {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`)

    state.recipe = _formatRecipeObject(data)
    _setBookmarked(id)
  } catch (error) { throw error }
}
/**
 * Load search results from the API and store them in state.search.results
 * @param {string} query
 * @throws {Error}
 */
export const loadSearchResults = async (query) => {
  try {
    state.search.query = query

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`)

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key })
      }
    })
  } catch (error) { console.error(error) }
}
/**
 * Get results for the current page
 * @param {number} page
 * @returns page results
 */
export const getSearchResultsPage = (page = state.search.page) => {
  const start = (page - 1) * state.search.resultsPerPage
  const end = page * state.search.resultsPerPage

  return state.search.results.slice(start, end)
}
/**
 * Update ingredients quantities by a new number of servings and set in state.recipe.servings
 * @param {number} newServings
 */
export const updateServings = (newServings) => {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings
  })

  state.recipe.servings = newServings
}
/**
 * Add a recipe to bookmarks and store it in state.bookmarks
 * @param {object} recipe
 */
export const addBookmark = (recipe) => {
  state.bookmarks.push(recipe)

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true
  _saveBookmarks()
}
/**
 * Delete a recipe from bookmarks and set state.recipe.bookmarked to false
 * @param {number} id
 */
export const deleteBookmark = (id) => {
  const index = state.bookmarks.findIndex((el) => el.id === id)
  state.bookmarks.splice(index, 1)

  if (id === state.recipe.id) state.recipe.bookmarked = false
  _saveBookmarks()
}

export const uploadRecipe = async (newRecipe) => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ing) => {
        const ingArr = ing[1].split(',').map((el) => el.trim())
        if (ingArr.length !== 3) {
          throw new Error(
            'Wrong ingredient format! Please use the correct format.'
          )
        }

        const [quantity, unit, description] = ingArr

        return { quantity: quantity ? +quantity : null, unit, description }
      })

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    }

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe)

    state.recipe = _formatRecipeObject(data)
    addBookmark(state.recipe)
  } catch (error) { throw error }
}
// Helpers //
/**
 * Format recipe object
 * @param {object} data
 * @returns recipe formatted object
 */
const _formatRecipeObject = (data) => {
  const { recipe } = data.data
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key })
  }
}
/**
 * Set state.recipe.bookmarked to true if the recipe is bookmarked
 * @param {number} id
 */
const _setBookmarked = (id) => {
  const bookmarked = state.bookmarks.some(bookmark => bookmark.id === id)

  bookmarked ? state.recipe.bookmarked = true : state.recipe.bookmarked = false
}
/**
 * Save bookmarks to local storage
 * @todo: save bookmarks to an API
 */
const _saveBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

init()

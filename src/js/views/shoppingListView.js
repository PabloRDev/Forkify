import icons from 'url:../../img/icons.svg'

import View from './View'

class ShoppingListView extends View {
  _parentElement = document.querySelector('.shopping_list')
  _btn = document.querySelector('.shopping__btn')
  _errorMessage = 'No shopping items yet! To add ingredients, bookmark some recipe.'

  addHandlerShoppingList (handler) {
    this._btn.addEventListener('click', (e) => {
      e.preventDefault()
      handler()
    })
  }

  _generateMarkup () {
    return `
      <div class="recipe__ingredients">
          <h2 class="heading--2">Shopping List</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.map(this._generateMarkupShoppingList).join('')}
          </ul>
        </div>`
  }

  _generateMarkupShoppingList (ing) {
    return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              
              <div class="recipe__description">
                <span class="recipe__unit">${ing}</span>
              </div>
            </li>
        `
  }
}

export default new ShoppingListView()

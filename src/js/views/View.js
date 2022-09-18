import icons from 'url:../../img/icons.svg'

export default class View {
  _data
  _parentElement
  _errorMessage
  _message
  /**
 * Set data object and render it to the DOM by markup
 * @param {Object} data
 * @param {Boolean} render
 */
  render (data, render = true) {
    const arrEmpty = Array.isArray(data) && data.length === 0
    if (!data || arrEmpty) return this.renderError()

    this._data = data
    const markup = this._generateMarkup()

    if (!render) return markup

    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  /**
 * Re-render only the changed part of the DOM
 * @param {Object} data
 */
  update (data) {
    this._data = data

    const newMarkup = this._generateMarkup()
    const newDOM = document.createRange().createContextualFragment(newMarkup)

    const newElements = Array.from(newDOM.querySelectorAll('*'))
    const curElements = Array.from(this._parentElement.querySelectorAll('*'))

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent
      }

      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        )
      }
    })
  }

  /**
 * Render spinner to the DOM
 */
  renderSpinner () {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
  `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  /**
 * Render error message to the DOM
 * @param {string} message
 */
  renderError (message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  /**
 * Render success message to the DOM
 * @param {string} message
 */
  renderSuccess (message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  // Helpers //
  /**
 * Clear the inner HTML of the parent element
 */
  _clear () {
    this._parentElement.innerHTML = ''
  }
}

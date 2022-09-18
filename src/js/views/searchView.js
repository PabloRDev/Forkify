class SearchView {
  _parentElement = document.querySelector('.search')
  _inputElement = this._parentElement.querySelector('.search__field')
  /**
 * Get the search query from the input field
 * @returns {String} Search query
 */
  getQuery () {
    const query = this._inputElement.value
    this._clearInput()

    return query
  }

  /**
 *  Execute the handler function when 'submit' event is fired on the form
 * @param {Function} handler Controller function: controlSearchResults()
 */
  addHandlerSearch (handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault()
      handler()
    })
  }

  // Helpers //
  /**
 * Clear the input field
 */
  _clearInput () {
    this._inputElement.value = ''
  }
}

export default new SearchView()

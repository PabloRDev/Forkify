class SearchView {
  _parentElement = document.querySelector('.search')
  _inputElement = this._parentElement.querySelector('.search__field')

  getQuery () {
    const query = this._inputElement.value
    this._clearInput()

    return query
  }

  addHandlerSearch (handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault()
      handler()
    })
  }

  _clearInput () {
    this._inputElement.value = ''
  }
}

export default new SearchView()

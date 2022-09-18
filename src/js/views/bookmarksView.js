import View from './View'
import previewView from './previewView'

class SearchResultsView extends View {
  _parentElement = document.querySelector('.bookmarks__list')
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)'
  _message = ''
  /**
 * Execute the handler function when 'click' event is fired on the bookmark button
 * @param {Function} handler
 */
  addHandlerRender (handler) {
    window.addEventListener('load', handler)
  }

  // Helpers //
  /**
 * Set the markup by rendering the preview view
 * @returns {string} preview markup
 */
  _generateMarkup () {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join('')
  }
}

export default new SearchResultsView()

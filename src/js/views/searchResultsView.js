import View from './View'
import previewView from './previewView'

class SearchResultsView extends View {
  _parentElement = document.querySelector('.results')
  _errorMessage = 'No recipes found for your query! Please try again :)'
  /**
 * Set the markup by rendering the preview view
 * @returns {string} preview markup
 */
  _generateMarkup () {
    return this._data
      .map((result) => previewView.render(result, false))
      .join('')
  }
}

export default new SearchResultsView()

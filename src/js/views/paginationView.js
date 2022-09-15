import icons from "url:../../img/icons.svg";

import View from "./View";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    console.log(this);
    return 1;
  }
}

export default new PaginationView();

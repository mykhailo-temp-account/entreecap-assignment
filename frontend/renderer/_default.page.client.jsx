export {render}

import {render as renderSolid} from 'solid-js/web'

let disposePreviousPage = undefined

async function render(pageContext) {
  const {Page} = pageContext

  if (disposePreviousPage) {
    disposePreviousPage()
  }

  disposePreviousPage = renderSolid(() => <Page/>, document.getElementById('root'))
}

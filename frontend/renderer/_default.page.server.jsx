export {render}

import {escapeInject} from 'vite-plugin-ssr/server'

function render(pageContext) {
  let {documentProps} = pageContext.exports

  let title = documentProps.title

  return escapeInject`<!DOCTYPE html>
    <html>
        <head>
            <meta charSet="UTF-8"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>${title}</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        </head>
      <body>
        <div id="root"></div>
      </body>
    </html>  `
}
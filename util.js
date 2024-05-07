/* eslint import/prefer-default-export: off */
const { URL } = require('url')
const path = require('path')

function resolveHtmlPath(htmlFileName) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 4343;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

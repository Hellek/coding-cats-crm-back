# О проекте
## Настройки окружения
При `HAS_AUTH_SERVICE=true` необходимо настроить `ALLOWED_ORIGINS` например `ALLOWED_ORIGINS=["http://localhost:8080"]`

# Deploying to Heroku
`heroku create coding-cats-crm-back` - "подключить" текущий проект к Heroku
`git push heroku main`
`heroku open`

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

### Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)

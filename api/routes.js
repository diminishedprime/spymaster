const addRoute = (app, verb, path, handler) => {
  return app[verb](path, (req, res) => {
    handler(req)
      .then((result) => res.send(result))
      .catch((err) => {
        const status = err.status || 500,
              message = err.message || 'Something went wrong'
        res.status(status).send(message)
      })
  })
}

const delay = (millis, value) => {
  return new Promise((resolve, _) => {
    setTimeout(() => resolve(value), millis)
  })
}

const addRoutes = (app) => {
  // Add real routes here
  addRoute(app, 'get', '/hi', (_) => {
    return delay(1000, 'hi')
  })
}

export default addRoutes

'use strict'

const fs = require('fs')
const path = require('path')
// const http = require('http')
// const config = require('config');
const console = require('tracer').colorConsole()
const Joi = require('joi')
const cors = require('cors')

const ConfigSchema = require('./lib/configSchema')
const express = require('express')

let app = express()
let swaggerTools = require('swagger-tools')
let jsyaml = require('js-yaml')

let spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8')
let swaggerDoc = jsyaml.safeLoad(spec)

let options
// let config

let setOptions = (controllers) => {
  if (!options) {
    options = {
      controllers: controllers
    }
  }
}

let init = async (middleware, config) => {
  app.set('view engine', 'pug')
  app.use(cors())

  app.use(middleware.swaggerMetadata())
  app.use(middleware.swaggerValidator({validateResponse: false}))

  app.use(middleware.swaggerRouter(options))

  if (config.swagger) {
    app.use(middleware.swaggerUi())
  }

  app.get('/', (req, res) => {
    res.render('index')
  })
}

let validate = (config) => {
  return Joi.validate(config, ConfigSchema)
}

let prepare = (service, config) => {
  let controllers = {
    Default_showNumberInfo: service.showNumberInfo
  }
  setOptions(controllers)

  swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
    let res = validate(config)
    if (res.error) {
      console.log(res.error)
      process.exit(1)
    }
    init(middleware, config)
  })
}

module.exports = () => {
  return {app, prepare}
}

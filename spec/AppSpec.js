const hippie = require('hippie-swagger')
const SwaggerParser = require('swagger-parser')
const fs = require('fs')
const path = require('path')
const jsyaml = require('js-yaml')

const Finder = require('./../lib/finder')
const FinderService = require('./../controllers/FinderService')

let dereferencedSwagger, app, resourceMock

const config = {
  swagger: false,
  port: 3000,
  timeout: 12000,
  mongo: {
    connectionString: 'mongodb://mongodb/number-archer',
    collection: 'regions'
  }
}

describe('App', () => {
  beforeEach((done) => {
    let spec = fs.readFileSync(path.join(__dirname, './../api/swagger.yaml'), 'utf8')
    let swaggerDoc = jsyaml.safeLoad(spec)

    let parser = new SwaggerParser()
    parser.dereference(swaggerDoc, (err, derefSwagger) => {
      dereferencedSwagger = derefSwagger
      done()
    })
  })

  it('good exec full number', (done) => {
    let resourceMock = require('./../spec/models/resourceMock')
    let Resource = resourceMock.getGoodModel()

    let service = FinderService(Resource, Finder)
    let numberArcher = require('./../index')()

    numberArcher.prepare(service, config)
    let app = numberArcher.app

    hippie(app, dereferencedSwagger)
      .get('/number/{number}')
      .pathParams({number: '89135292926'})
      .expectStatus(200)
      .end((err, res, body) => {
        if (err) {
          console.log('err', err)
          done(err)
        } else {
          console.log('all good:', body)
          done()
        }
      })
  })

  it('good exec number with +7', (done) => {
    let resourceMock = require('./../spec/models/resourceMock')
    let Resource = resourceMock.getGoodModel()

    let service = FinderService(Resource, Finder)
    let numberArcher = require('./../index')()

    numberArcher.prepare(service, config)
    let app = numberArcher.app

    hippie(app, dereferencedSwagger)
      .get('/number/{number}')
      .pathParams({number: '+79135292926'})
      .expectStatus(200)
      .end((err, res, body) => {
        if (err) {
          console.log('err', err)
          done(err)
        } else {
          console.log('all good:', body)
          done()
        }
      })
  })

  it('good exec number length 10', (done) => {
    let resourceMock = require('./../spec/models/resourceMock')
    let Resource = resourceMock.getGoodModel()

    let service = FinderService(Resource, Finder)
    let numberArcher = require('./../index')()

    numberArcher.prepare(service, config)
    let app = numberArcher.app

    hippie(app, dereferencedSwagger)
      .get('/number/{number}')
      .pathParams({number: '9135292926'})
      .expectStatus(200)
      .end((err, res, body) => {
        if (err) {
          console.log('err', err)
          done(err)
        } else {
          console.log('all good:', body)
          done()
        }
      })
  })


  it('dont exec number length 12 without +', (done) => {
    let resourceMock = require('./../spec/models/resourceMock')
    let Resource = resourceMock.getGoodModel()

    let service = FinderService(Resource, Finder)
    let numberArcher = require('./../index')()

    numberArcher.prepare(service, config)
    let app = numberArcher.app

    hippie(app, dereferencedSwagger)
      .get('/number/{number}')
      .pathParams({number: '989135292926'})
      .expectStatus(404)
      .end((err, res, body) => {
        if (err) {
          console.log('err', err)
          done()
        } 
      })
  })

})

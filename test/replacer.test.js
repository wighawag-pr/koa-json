const request = require('supertest')
const Koa = require('koa')

const json = require('..')

describe('replacer', () => {
  it('should default to null', (done) => {
    const app = new Koa()

    app.use(json())

    app.use((ctx) => {
      ctx.body = { foo: 'bar' }
    })

    request(app.listen())
      .get('/')
      .expect('{\n  "foo": "bar"\n}', done)
  })



  it('should affect output when set', (done) => {
    const app = new Koa()

    app.use(json({ replacer: (k,v) => typeof v === 'string' ? 'hello world': v}))

    app.use((ctx) => {
      ctx.body = { foo: 'bar' }
    })

    request(app.listen())
      .get('/')
      .expect('{\n  "foo": "hello world"\n}', done)
  })

  it('without it conversion of bigint fails', (done) => {
    const app = new Koa()

    app.use(json())

    app.use((ctx) => {
      ctx.body = { foo: 999999999999999999999n }
    })

    request(app.listen())
      .get('/')
      .expect(500, done)
  })

  it('should allow conversion of bigint', (done) => {
    const app = new Koa()

    app.use(json({ replacer: (k,v) => typeof v === 'bigint' ? v.toString() : v}))

    app.use((ctx) => {
      ctx.body = { foo: 999999999999999999999n }
    })

    request(app.listen())
      .get('/')
      .expect('{\n  "foo": "999999999999999999999"\n}', done)
  })

})

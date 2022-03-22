const request = require('supertest')
const {expect} = require('chai')
const app = require('../app')

describe('DISCORD BOT', () => {
    describe('GET /', () => {
        it('should get 200', (done) => {
            request(app).get('/').expect(200, done)
        })

        it('should get generic message', (done) => {
            request(app).get('/').end((err, res) => {
                const resObject = JSON.parse(res.text)

                expect(resObject).to.be.an('object')
                expect(resObject.message).to.equal('discord bot')
                done()
            })
        })
    })

    describe('GET /listen', () => {
        it('should get 200', (done) => {
            request(app).get('/listen').expect(200, done)
        })

        it('should get listen response', (done) => {
            request(app).get('/listen').end((err, res) => {
                const body = JSON.parse(res.text)

                expect(body).to.have.property('message').with.lengthOf(3)
                expect(body.message).to.satisfy((message) => {
                    if (message === 'Ready' || message === 'Not Ready') {
                        return true
                    }
                    return false
                })
            })
            done()
        })
    })

    describe('GET /register-commands', () => {
        it('should get 200', (done) => {
            request(app).get('/register-commands').expect(200, done)
        })

        it('should register commands', (done) => {
            request(app).get('/register-commands').end((err, res) => {
                const body = JSON.parse(res.text)

                expect(body).to.be.an('object')
                expect(body).to.have.a.property('message')
                expect(body.message).to.equal('Successfully registered application commands.')
            })
            done()
        })
    })

    describe('GET /send-notifications', () => {
        it('should get 200', (done) => {
            request(app).get('/send-notifications').expect(200, done)
        })

        it('should send notifications', (done) => {
            request(app).get('/send-notifications').end((err, res) => {
                const body = JSON.parse(res.text)

                expect(body).to.be.an('object')
                expect(body).to.have.a.property('message')
            })
            done()
        })
    })
})

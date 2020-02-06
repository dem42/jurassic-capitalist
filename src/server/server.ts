import express from 'express'
import { createServer } from 'http'
import socketio from 'socket.io'
import path from 'path'
import process from 'process'

import Business from '../shared/business'
import Player from '../shared/player'

const app = express()
const http = createServer(app)
const io = socketio(http)

console.log("????")

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'html', 'index.html'))
})

app.get('/css/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'css', 'style.css'))
})

app.get('/bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'bundle.js'))
})

io.on('connection', socket => {
    console.log('a user connected')
    socket.on('update-business', (businessDto: Business) => {
        console.log(`updated: ${JSON.stringify(businessDto)}`)        
    })
})

const port = process.env.PORT || 3000
http.listen(port, () => {
    console.log(`listening on *:${port}`)
})
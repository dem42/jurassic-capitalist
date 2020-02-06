import express from 'express'
import { createServer } from 'http'
import socketio from 'socket.io'
import path from 'path'
import process from 'process'

const app = express()
const http = createServer(app)
const io = socketio(http)

console.log("????")

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'html', 'index.html'))
})

app.get('/bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'bundle.js'))
})

io.on('connection', socket => {
    console.log('a user connected')
    socket.on('click', (msg) => {
        console.log(`times clicked ${msg}`)
        socket.emit('click-ack')
    })
})

const port = process.env.PORT || 3000
http.listen(port, () => {
    console.log(`listening on *:${port}`)
})
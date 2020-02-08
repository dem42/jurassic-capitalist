import express from 'express';
import { createServer } from 'http';
import socketio from 'socket.io';
import path from 'path';
import process from 'process';

import Persistance from './persistance';
import Business from '../shared/business';
import Player from '../shared/player';
import defaultData from './default_game_data';

const app = express();
const http = createServer(app);
const io = socketio(http);

console.log("Game server started");

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'html', 'index.html'));
});

app.get('/css/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'css', 'style.css'));
});

app.get('/bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'bundle.js'));
});

io.on('connection', socket => {
    console.log('a user connected');
    socket.emit("connected")
    socket.on('update-business', (businessDto: Business) => {
        console.log(`updated: ${JSON.stringify(businessDto)}`);
    })
    socket.on("login", (username: string) => {
        const persistance = new Persistance(username);
        
        let player: Player;
        let businesses: Business[];
        if (persistance.existsUser()) {
            [player, businesses] = persistance.getPlayerAndBusinesses();
        } else {
            player = defaultData.initialPlayer;
            businesses = defaultData.initialBusinesses;
        }
        
        socket.on("sync", (player: Player, businesses: Business[]) => {            
            persistance.save(player, businesses);
        });

        socket.emit("loggedIn", player, businesses);
    });
});

const port = process.env.PORT || 3000
http.listen(port, () => {
    console.log(`listening on *:${port}`)
})
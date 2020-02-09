import express from 'express';
import { createServer } from 'http';
import socketio from 'socket.io';
import path, { PlatformPath } from 'path';
import process from 'process';

import Persistance from './persistance';
import Business from '../shared/business';
import Player from '../shared/player';
import defaultData from './default_game_data';
import offlineEarnings from './offline_earnings';

const app = express();
const http = createServer(app);
const io = socketio(http);

console.log("Game server started");

function addStaticFileRoute(route: string, filePath: string) {
    app.get(route, (req, res) => {
        res.sendFile(filePath);
    });
}

const staticsDir = path.join(__dirname, '..', '..', 'dist');
addStaticFileRoute('/', path.join(staticsDir, 'html', 'index.html'));
addStaticFileRoute('/css/style.css', path.join(staticsDir, 'css', 'style.css'));
addStaticFileRoute('/bundle.js', path.join(staticsDir, 'bundle.js'));
addStaticFileRoute('/res/isla_nubla_small.png', path.join(staticsDir, 'res', 'isla_nubla_small.png'));
addStaticFileRoute('/res/raptor.png', path.join(staticsDir, 'res', 'raptor.png'));
addStaticFileRoute('/res/triceratops.png', path.join(staticsDir, 'res', 'triceratops.png'));
addStaticFileRoute('/res/diplodocus.png', path.join(staticsDir, 'res', 'diplodocus.png'));
addStaticFileRoute('/res/trex.png', path.join(staticsDir, 'res', 'trex.png'));


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

        const serverTime = new Date().getTime() / 1000.0;
        const offlineMoney = offlineEarnings(serverTime, businesses);
        if (offlineMoney > 0) {
            player.cash += offlineMoney;
            persistance.save(player, businesses);
        }
        socket.emit("loggedIn", player, businesses, serverTime, offlineMoney);
    });
});

const port = process.env.PORT || 3000
http.listen(port, () => {
    console.log(`listening on *:${port}`)
})
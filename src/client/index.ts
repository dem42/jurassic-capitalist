import io from 'socket.io-client';
import Business from '../shared/business';
import Player from '../shared/player';
import GameClient from './game';
import { setDivActive } from './utils';

const socket = io();

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");
    let gameClient: GameClient;
    let gameLoop: NodeJS.Timeout;

    socket.on("connected", () => {
        setDivActive("#connecting", false);

        setDivActive("#login", true);
        const loginForm = document.querySelector("#login > form") as HTMLFormElement;
        loginForm.onsubmit = (evnt: Event) => {
            evnt.preventDefault(); 
            const usernameValue = (document.getElementById("usernameInput") as HTMLInputElement).value;            
            socket.emit("login", usernameValue);
        };        
    });

    socket.on("loggedIn", (player: Player, businesses: Business[], serverTimeS: number, offlineEarnings: number) => {
        setDivActive("#login", false);

        setDivActive("#dashboard", true);

        if (offlineEarnings > 0) {
            console.log(`Your businesses earned ${offlineEarnings} while you were offline.`);
        }

        gameClient = new GameClient(player, businesses, socket, serverTimeS);
        gameLoop = setInterval(gameClient.gameLoop, gameClient.frameTime * 1000);
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
        setDivActive("#dashboard", false);
        setDivActive("#login", true);
        clearInterval(gameLoop);
    });
});
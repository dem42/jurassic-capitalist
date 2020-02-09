import io from 'socket.io-client';
import Business from '../shared/business';
import Player from '../shared/player';
import GameClient from './game';
import { setDivActive, formatMoney } from './utils';

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
            const userLabel = document.querySelector("#userLabel");
            if (userLabel != null) {
                userLabel.textContent = usernameValue;
            }
            socket.emit("login", usernameValue);
        };        
    });

    function startGame(player: Player, businesses: Business[], serverTimeS: number) {
        setDivActive("#dashboard", true);
        gameClient = new GameClient(player, businesses, socket, serverTimeS);        
        gameLoop = setInterval(gameClient.gameLoop, gameClient.frameTime * 1000);
    }

    socket.on("loggedIn", (player: Player, businesses: Business[], serverTimeS: number, offlineEarnings: number) => {
        setDivActive("#login", false);

        if (offlineEarnings > 0) {
            const msg = `Your businesses earned $${formatMoney(offlineEarnings)} while you were offline.`;
            console.log();            
            setDivActive("#offlineMsg", true);
            const msgBlock = document.querySelector("#earningsMsg");
            if (msgBlock != null) {
                msgBlock.textContent = msg; 
            }
            document.querySelector("#offlineMsg button")?.addEventListener("click", () => {
                setDivActive("#offlineMsg", false);
                startGame(player, businesses, serverTimeS);    
            });
        } else {
            startGame(player, businesses, serverTimeS);
        }
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
        setDivActive("#dashboard", false);
        setDivActive("#login", true);
        clearInterval(gameLoop);
    });
});
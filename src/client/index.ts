import io from 'socket.io-client';

import Business from '../shared/business';
import Player from '../shared/player';
import Manager from '../shared/manager';
import { BusinessOperateSystem, BuyingSystem, ManagerSystem } from './systems';
import { reprTime } from './utils';
import { BusinessView, createBusinessHtml, renderBusiness, PlayerView, createPlayerHtml, renderPlayer, ManagerSelectionView, createManagersHtml, renderManagersList } from './views';

const businesses = [
    new Business("Dino Eggs", 1, 1, 1, new Manager(100)),
    new Business("Raptors", 100, 5, 100, new Manager(1000)),
    new Business("Triceratops", 1000, 30, 1000, new Manager(10_000)),
    new Business("T-Rex", 10_000, 120, 10_000, new Manager(100_000)),
];
const player = new Player(1000000);

const buyingSystem = new BuyingSystem();
const businessTimerSystem = new BusinessOperateSystem();
const managersSystem = new ManagerSystem();

let playerModelView: [Player, PlayerView];
let businessModelView: [Business[], BusinessView[]];
let managersView: ManagerSelectionView;

console.log("Hello world");

const socket = io();

const fps = 30;
const frameTime = 1 / fps;


function initGame() {
    const playerHtml = createPlayerHtml(player);
    const playerHolder = document.querySelector("#player");
    playerHolder?.append(playerHtml.moneyText);
    playerModelView = [player, playerHtml];

    const businessesHtml = businesses.map(bus => createBusinessHtml(player, bus));    
    const businessHolder = document.querySelector("#businesses");
    businessModelView = [businesses, businessesHtml];    
    businessHolder?.append(...businessesHtml.map(bv => bv.block)); 
    
    const managersHolder = document.querySelector("#managersContent");
    managersView = createManagersHtml(player, businesses);
    managersHolder?.appendChild(managersView.managersList);
}

function render() {    
    renderPlayer(playerModelView[0], playerModelView[1]);
    for (let i=0; i<businessModelView[0].length; i++) {
        renderBusiness(businessModelView[0][i], businessModelView[1][i]);
    }
    renderManagersList(businesses, managersView);
}

function gameLoop() {    
    businessTimerSystem.process(frameTime, player, businesses);
    buyingSystem.process(frameTime, player, businesses);
    managersSystem.process(frameTime, player, businesses);
    render();
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");

    initGame();
    setInterval(gameLoop, frameTime * 1000);
});
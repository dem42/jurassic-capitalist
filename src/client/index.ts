import io from 'socket.io-client';

import Business from '../shared/business';
import Player from '../shared/player';
import { BusinessTimerSystem } from './systems';
import { reprTime } from './utils';

const businesses = [
    new Business("Dino Eggs", 1, 1, 1),
    new Business("Raptors", 100, 5, 100),
    new Business("Triceratops", 1000, 30, 1000),
    new Business("T-Rex", 10_000, 120, 10_000),
];

const player = new Player(1);

const businessTimerSystem = new BusinessTimerSystem();

let businessModelView: [Business[], BusinessView[]];

console.log("Hello world");

interface BusinessView {
    block: Node,
    btn: Node,
    timerText: Node,
}

const socket = io();
let clickCount = 0;

const fps = 30;
const frameTime = 1 / fps;

const renderBusinessHtml = (business: Business) : BusinessView => {
    const buttonBlock = document.createElement('div');
    
    const timerTxt = document.createElement('span');
    timerTxt.textContent = reprTime(business.getRemainingBuildTime());

    const btn = document.createElement('button');
    btn.textContent = `name: ${business.name}. owned: ${business.numOwned}`;
    btn.addEventListener("click", () => {
        console.log("clicked");
        business.incrementOwned();
        business.startBuilding();            
    });

    buttonBlock.appendChild(btn);
    buttonBlock.appendChild(timerTxt);

    return {
        block: buttonBlock,
        btn: btn,
        timerText: timerTxt
    };
}

function initGame() {
    const businessesHtml = businesses.map(renderBusinessHtml);    
    const businessHolder = document.querySelector("#businesses");
    businessModelView = [businesses, businessesHtml];    
    businessHolder?.append(...businessesHtml.map(bv => bv.block));
}

function renderBusiness(business: Business, businessView: BusinessView) {    
    businessView.timerText.textContent = reprTime(business.getRemainingBuildTime());
}

function render() {    
    for (let i=0; i<businessModelView[0].length; i++) {
        renderBusiness(businessModelView[0][i], businessModelView[1][i]);
    }
}

function gameLoop() {    
    businessTimerSystem.process(frameTime, businesses);
    render();
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");

    initGame();
    setInterval(gameLoop, frameTime * 1000);
});
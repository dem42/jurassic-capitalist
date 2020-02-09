import Business from '../../shared/business';
import { reprTime, formatMoney } from '../utils';
import GameState from '../game_state';
import Player from '../../shared/player';

export interface BusinessView {
    block: Node;
    operateTxt: HTMLDivElement;
    btnBuy: HTMLButtonElement;
    timerBlock: HTMLDivElement;
}

export const renderBusiness = (player: Player, business: Business, businessView: BusinessView) => {    
    businessView.timerBlock.textContent = `Earnings: $${formatMoney(business.getEarnings())}`;
    businessView.timerBlock.setAttribute("style", `width: ${100 - business.getRemainingOperateTimeAsPercentage()}%`);
    businessView.operateTxt.innerHTML = `${business.getLabelText()}`;    
    businessView.btnBuy.textContent = `Buy: 1 for $${formatMoney(business.getBuyPrice())}`;
    businessView.btnBuy.className = business.getBuyPrice() <= player.cash ? "" : "disabled";
    businessView.btnBuy.disabled = business.getBuyPrice() > player.cash;
}

export const createBusinessHtml = (gameState: GameState, business: Business) : BusinessView => {    
    const buttonBlock = document.createElement('div');
    buttonBlock.className = 'businessElem';
    buttonBlock.id = `${business.divId}`;
       
    const timerBlock = document.createElement('div'); 
    timerBlock.className = 'timer';
    timerBlock.textContent = `Earnings: $${formatMoney(business.getEarnings())}`;
    timerBlock.setAttribute('style', `width: ${100 - business.getRemainingOperateTimeAsPercentage()}%`);

    const btnOperate = document.createElement('div');
    btnOperate.className = 'btnOperate';    
    btnOperate.addEventListener('click', () => {
        if (business.numOwned > 0 && !business.isOperating) {
            business.startOperating(gameState.timeS);
            gameState.isDirty = true;
        }
    });
    const operateTxt = document.createElement('div');
    operateTxt.className = "businessLabel";
    operateTxt.textContent = `${business.name}. owned: ${business.numOwned}`;
    btnOperate.appendChild(operateTxt);

    const btnBuy = document.createElement('button');
    btnBuy.textContent = `Buy: 1 for $${formatMoney(business.getBuyPrice())}`;
    btnBuy.addEventListener('click', () => {
        if (gameState.player.cash >= business.getBuyPrice()) {
            business.isBuyBusinessClicked = true;
            gameState.isDirty = true;
        }
    });

    buttonBlock.appendChild(btnOperate);
    buttonBlock.appendChild(btnBuy);
    buttonBlock.appendChild(timerBlock);

    return {
        block: buttonBlock,
        operateTxt: operateTxt,
        btnBuy: btnBuy,
        timerBlock: timerBlock
    };
}
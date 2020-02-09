import Business from '../../shared/business';
import { reprTime } from '../utils';
import GameState from '../game_state';

export interface BusinessView {
    block: Node;
    operateTxt: HTMLDivElement;
    btnBuy: Node;
    timerBlock: HTMLDivElement;
}

export const renderBusiness = (business: Business, businessView: BusinessView) => {    
    businessView.timerBlock.textContent = `Earnings: $${business.getEarnings()}`;
    businessView.timerBlock.setAttribute("style", `width: ${100 - business.getRemainingOperateTimeAsPercentage()}%`);
    businessView.operateTxt.innerHTML = `${business.getLabelText()}`;    
    businessView.btnBuy.textContent = `Buy: 1 for $${business.getBuyPrice()}`;
}

export const createBusinessHtml = (gameState: GameState, business: Business) : BusinessView => {    
    const buttonBlock = document.createElement('div');
    buttonBlock.className = 'businessElem';
    buttonBlock.id = `${business.divId}`;
       
    const timerBlock = document.createElement('div'); 
    timerBlock.className = 'timer';
    timerBlock.textContent = `Earnings: $${business.getEarnings()}`;
    timerBlock.setAttribute('style', `width: ${100 - business.getRemainingOperateTimeAsPercentage()}%`);

    const btnOperate = document.createElement('div');
    btnOperate.className = 'btnOperate';    
    btnOperate.addEventListener('click', () => {
        if (business.numOwned > 0) {
            business.startOperating(gameState.timeS);
            gameState.isDirty = true;
        }
    });
    const operateTxt = document.createElement('div');
    operateTxt.className = "businessLabel";
    operateTxt.textContent = `${business.name}. owned: ${business.numOwned}`;
    btnOperate.appendChild(operateTxt);

    const btnBuy = document.createElement('button');
    btnBuy.textContent = `Buy: 1 for $${business.getBuyPrice()}`;
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
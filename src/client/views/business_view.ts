import Business from '../../shared/business';
import { reprTime } from '../utils';
import GameState from '../game_state';

export interface BusinessView {
    block: Node;
    btnOperate: Node;
    btnBuy: Node;
    timerText: Node;
}

export const renderBusiness = (business: Business, businessView: BusinessView) => {
    businessView.timerText.textContent = reprTime(business.getRemainingOperateTime());
    businessView.btnOperate.textContent = `name: ${business.name}. owned: ${business.numOwned}`;
    businessView.btnBuy.textContent = `buy ${business.getBuyPrice()}`;
}

export const createBusinessHtml = (gameState: GameState, business: Business) : BusinessView => {    
    const buttonBlock = document.createElement('div');
    
    const timerTxt = document.createElement('span');
    timerTxt.textContent = reprTime(business.getRemainingOperateTime());

    const btnOperate = document.createElement('button');
    btnOperate.textContent = `name: ${business.name}. owned: ${business.numOwned}`;
    btnOperate.addEventListener("click", () => {
        if (business.numOwned > 0) {
            business.startOperating(gameState.timeS);
            gameState.isDirty = true;
        }
    });

    const btnBuy = document.createElement('button');
    btnBuy.textContent = `buy ${business.getBuyPrice()}`;
    btnBuy.addEventListener("click", () => {
        if (gameState.player.cash >= business.getBuyPrice()) {
            business.isBuyBusinessClicked = true;
            gameState.isDirty = true;
        }
    });

    buttonBlock.appendChild(btnOperate);
    buttonBlock.appendChild(btnBuy);
    buttonBlock.appendChild(timerTxt);

    return {
        block: buttonBlock,
        btnOperate: btnOperate,
        btnBuy: btnBuy,
        timerText: timerTxt
    };
}
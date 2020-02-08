import Business from '../shared/business';
import Player from '../shared/player';
import { reprTime } from './utils';

export interface BusinessView {
    block: Node;
    btnOperate: Node;
    btnBuy: Node;
    timerText: Node;
}

export const renderBusiness = (business: Business, businessView: BusinessView) => {
    businessView.timerText.textContent = reprTime(business.getRemainingBuildTime());
    businessView.btnOperate.textContent = `name: ${business.name}. owned: ${business.numOwned}`;
    businessView.btnBuy.textContent = `buy ${business.getBuyPrice()}`;
}

export const createBusinessHtml = (player: Player, business: Business) : BusinessView => {
    const buttonBlock = document.createElement('div');
    
    const timerTxt = document.createElement('span');
    timerTxt.textContent = reprTime(business.getRemainingBuildTime());

    const btnOperate = document.createElement('button');
    btnOperate.textContent = `name: ${business.name}. owned: ${business.numOwned}`;
    btnOperate.addEventListener("click", () => {
        if (business.numOwned > 0) {
            business.startOperating();
        }
    });

    const btnBuy = document.createElement('button');
    btnBuy.textContent = `buy ${business.getBuyPrice()}`;
    btnBuy.addEventListener("click", () => {
        if (player.cash >= business.getBuyPrice()) {
            console.log("buying");
            business.isBuyBusinessClicked = true;
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

export interface PlayerView {
    moneyText: Node;
}

export const createPlayerHtml = (player: Player) : PlayerView => {
    const moneyText = document.createElement('div');
    moneyText.textContent = `$${player.cash.toString()}`;
    return {
        moneyText: moneyText
    };
}

export const renderPlayer = (player: Player, playerView: PlayerView) => {
    playerView.moneyText.textContent = `$${player.cash.toString()}`;
}

export interface ManagerSelectionView {
    managersList: HTMLUListElement;
    managerEntries: HTMLLIElement[];
}

export const createManagersHtml = (player: Player, businesses: Business[]) : ManagerSelectionView => {
    const managersList = document.createElement('ul') as HTMLUListElement;
    const managerEntries: HTMLLIElement[] = [];
    
    for (let business of businesses) {        
        const managerEntry = document.createElement('li');        
        managerEntry.textContent = `${business.name} manager: $${business.manager.price}`;

        managerEntry.addEventListener("click", () => {
            console.log("bought manager");
            if (player.cash >= business.manager.price) {
                player.cash -= business.manager.price;
                business.manager.isOwned = true;
            }
        });
        managersList.appendChild(managerEntry);
        managerEntries.push(managerEntry as HTMLLIElement);
    }

    return {
        managersList: managersList,
        managerEntries: managerEntries
    };
}

export const renderManagersList = (businesses: Business[], managersView: ManagerSelectionView) => {
    for (let i=0; i<businesses.length; i++) {
        if (businesses[i].manager.isOwned && !businesses[i].manager.deactivated) {
            businesses[i].manager.deactivated = true;
            managersView.managerEntries[i].classList.add("inactive");
        }
    }
}
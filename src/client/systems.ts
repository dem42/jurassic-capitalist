import Business from '../shared/business';
import Player from '../shared/player';
import { reprTime } from './utils';

export class BusinessOperateSystem {

    process(deltaTime: number, player: Player, businesses: Business[]) {
        for (let business of businesses) {
            if (business.isOperating) {
                const operationFinished = business.updateOperateTime(deltaTime);
                if (operationFinished) {
                    player.cash += business.getEarnings();
                }
            }     
        };
    }
}

export class BuyingSystem {
    process(deltaTime: number, player: Player, businesses: Business[]) {
        for (let business of businesses) {
            if (business.isBuyBusinessClicked) {
                business.isBuyBusinessClicked = false;
                player.cash -= business.getBuyPrice();
                business.incrementOwned();
            }     
        };
    }
}

export class ManagerSystem {
    process(deltaTime: number, player: Player, businesses: Business[]) {
        for (let business of businesses) {
            if (business.manager.isOwned && !business.isOperating && business.numOwned > 0) {
                business.startOperating();
            }
        }
    }
}
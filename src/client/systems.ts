import Business from '../shared/business';
import Player from '../shared/player';
import GameState from './game_state';

export class BusinessOperateSystem {
    readonly process = (deltaTime: number, gameState: GameState) => {
        for (let business of gameState.businesses) {
            if (business.isOperating) {
                const operationFinished = business.updateOperateTime(deltaTime);
                if (operationFinished) {
                    gameState.player.cash += business.getEarnings();
                    gameState.isDirty = true;
                }
            }     
        };
    }
}

export class BuyingSystem {
    readonly process = (deltaTime: number, gameState: GameState) => {
        for (let business of gameState.businesses) {
            if (business.isBuyBusinessClicked) {
                business.isBuyBusinessClicked = false;
                gameState.player.cash -= business.getBuyPrice();
                business.incrementOwned();
                gameState.isDirty = true;
            }     
        };
    }
}

export class ManagerSystem {
    readonly process = (deltaTime: number, gameState: GameState) => {
        for (let business of gameState.businesses) {
            if (business.manager.isOwned && !business.isOperating && business.numOwned > 0) {
                business.startOperating(gameState.timeS);
                gameState.isDirty = true;
            }
        }
    }
}

export class SyncSystem {    
    readonly process = (deltaTime: number, gameState: GameState, socket: SocketIOClient.Socket) => {
        gameState.timeS += deltaTime;  
        if (gameState.isDirty) {
            socket.emit("sync", gameState.player, gameState.businesses);
            gameState.isDirty = false;
        }        
    }
}
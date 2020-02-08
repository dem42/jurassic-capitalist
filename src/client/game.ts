import Business from '../shared/business';
import Player from '../shared/player';
import { BusinessOperateSystem, BuyingSystem, ManagerSystem, SyncSystem } from './systems';
import { BusinessView, createBusinessHtml, renderBusiness } from './views/business_view';
import { PlayerView, createPlayerHtml, renderPlayer } from './views/player_view'; 
import { UpgradesSelectionView, createUpgradesHtml, renderUpgradesList } from './views/upgrades_view';
import { ManagerSelectionView, createManagersHtml, renderManagersList } from './views/managers_view'; 
import GameState from './game_state';

export default class GameClient {
    
    readonly gameState: GameState;
    readonly socket: SocketIOClient.Socket;

    readonly playerModelView: [Player, PlayerView];
    readonly businessModelView: [Business[], BusinessView[]];
    readonly managersView: ManagerSelectionView;
    readonly upgradesView: UpgradesSelectionView;

    readonly buyingSystem = new BuyingSystem();
    readonly businessTimerSystem = new BusinessOperateSystem();
    readonly managersSystem = new ManagerSystem();
    readonly syncSystem = new SyncSystem();

    readonly fps = 30;
    readonly frameTime = 1 / 30;
    
    constructor(playerIn: Player, businessesIn: Business[], socket: SocketIOClient.Socket) {        
        this.gameState = new GameState(Player.from(playerIn), businessesIn.map(Business.from));        
        this.socket = socket;

        const playerHtml = createPlayerHtml(this.gameState);
        const playerHolder = document.querySelector("#player");
        playerHolder?.append(playerHtml.moneyText);
        this.playerModelView = [this.gameState.player, playerHtml];

        const businessesHtml = this.gameState.businesses.map(bus => createBusinessHtml(this.gameState, bus));    
        const businessHolder = document.querySelector("#businesses");
        this.businessModelView = [this.gameState.businesses, businessesHtml];    
        businessHolder?.append(...businessesHtml.map(bv => bv.block)); 
        
        const managersHolder = document.querySelector("#managersContent");
        this.managersView = createManagersHtml(this.gameState);
        managersHolder?.appendChild(this.managersView.managersList);

        const upgradesHolder = document.querySelector("#upgradesContent");
        this.upgradesView = createUpgradesHtml(this.gameState);
        upgradesHolder?.appendChild(this.upgradesView.upgradesList);
    }
    
    render = () => {    
        renderPlayer(this.playerModelView[0], this.playerModelView[1]);
        for (let i=0; i<this.businessModelView[0].length; i++) {
            renderBusiness(this.businessModelView[0][i], this.businessModelView[1][i]);
        }
        renderManagersList(this.gameState.businesses, this.managersView);
        renderUpgradesList(this.gameState.businesses, this.upgradesView);
    }

    gameLoop = () => {    
        this.businessTimerSystem.process(this.frameTime, this.gameState);
        this.buyingSystem.process(this.frameTime, this.gameState);
        this.managersSystem.process(this.frameTime, this.gameState);
        this.syncSystem.process(this.frameTime, this.gameState, this.socket);
        this.render();
    }

}
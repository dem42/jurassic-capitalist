import Manager from './manager';
import Upgrade from './upgrade';

export default class Business {
    readonly name: string;
    readonly initialPrice: number;
    readonly initialOperateTimeSec: number;
    earningsPerOwned: number;    
    numOwned: number;

    isBuyBusinessClicked: boolean;
    isOperating: boolean;
    operateTimeElapsed: number;

    manager: Manager;
    upgrade: Upgrade;

    constructor (name: string, initialPrice: number, initialOperateTimeSec: number, earningsPerOwned: number, manager: Manager, upgrade: Upgrade) {
        this.name = name;
        this.initialPrice = initialPrice;
        this.initialOperateTimeSec = initialOperateTimeSec;
        this.earningsPerOwned = earningsPerOwned;        
        this.manager = manager;
        this.upgrade = upgrade;

        this.numOwned = 0;
        this.isBuyBusinessClicked = false;
        this.isOperating = false;
        this.operateTimeElapsed = 0;
    }

    // socket.io serialization doesn't serialize methods so we use copy constructors
    static from(b: Business) : Business {
        const nm = Manager.from(b.manager);
        const nu = Upgrade.from(b.upgrade);
        const nb = new Business(b.name, b.initialPrice, b.initialOperateTimeSec, b.earningsPerOwned, nm, nu);
        nb.numOwned = b.numOwned;
        nb.isBuyBusinessClicked = b.isBuyBusinessClicked;
        nb.isOperating = b.isOperating;
        nb.operateTimeElapsed = b.operateTimeElapsed;   
        return nb;     
    }

    startOperating = () => {
        this.isOperating = true;
        this.operateTimeElapsed = 0;
    }

    updateOperateTime = (deltaTime: number) : boolean => {        
        this.operateTimeElapsed += deltaTime;
        const businessOperateTime = this.initialOperateTimeSec;
        let timeRemaining = businessOperateTime - this.operateTimeElapsed;
        if (timeRemaining <= 0) {
            this.isOperating = false;
            this.operateTimeElapsed = 0;
            return true;
        }    
        return false;
    }

    incrementOwned = () => {
        this.numOwned += 1;
    }

    getRemainingBuildTime() : number {
        return Math.trunc(this.initialOperateTimeSec - this.operateTimeElapsed);
    }

    getEarnings = () : number => {
        const multiplier = this.upgrade.getUpgradeMultiplier();
        return this.numOwned * this.earningsPerOwned * multiplier;
    }

    getBuyPrice = () : number => {
        return this.initialPrice * (this.numOwned + 1);
    }
}
import Manager from './manager';
import Upgrade from './upgrade';

export default class Business {
    readonly name: string;
    readonly divId: string;
    readonly initialPrice: number;
    readonly initialOperateTimeSec: number;
    earningsPerOwned: number;    
    numOwned: number;

    isBuyBusinessClicked: boolean;
    isOperating: boolean;
    // when operate was started using serverTime
    operateStartTimeS: number;
    operateTimeElapsed: number;

    manager: Manager;
    upgrade: Upgrade;

    constructor (name: string, divName: string, initialPrice: number, initialOperateTimeSec: number, earningsPerOwned: number, manager: Manager, upgrade: Upgrade) {
        this.divId = divName;
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
        this.operateStartTimeS = -1;
    }

    // socket.io serialization doesn't serialize methods so we use copy constructors
    static from(b: Business) : Business {
        const nm = Manager.from(b.manager);
        const nu = Upgrade.from(b.upgrade);
        const nb = new Business(b.name, b.divId, b.initialPrice, b.initialOperateTimeSec, b.earningsPerOwned, nm, nu);
        nb.numOwned = b.numOwned;
        nb.isBuyBusinessClicked = b.isBuyBusinessClicked;
        nb.isOperating = b.isOperating;
        nb.operateTimeElapsed = b.operateTimeElapsed;   
        nb.operateStartTimeS = b.operateStartTimeS;
        return nb;     
    }

    readonly getLabelText = () : string => {
        return `Species:<br />${this.name}<br /><br />Status:<br />contained<br /><br />Number: ${this.numOwned}`;
    }

    readonly startOperating = (timeMs: number) => {
        this.isOperating = true;
        this.operateTimeElapsed = 0;
        this.operateStartTimeS = timeMs;
    }

    readonly updateOperateTime = (deltaTime: number) : boolean => {        
        this.operateTimeElapsed += deltaTime;        
        const businessOperateTime = this.initialOperateTimeSec;
        let timeRemaining = businessOperateTime - this.operateTimeElapsed;
        if (timeRemaining <= 0) {
            this.isOperating = false;
            this.operateTimeElapsed = 0;
            this.operateStartTimeS = -1;
            return true;
        }    
        return false;
    }

    readonly incrementOwned = () => {
        this.numOwned += 1;
    }

    readonly getOperateTime = () : number => {
        return this.initialOperateTimeSec;
    }

    readonly getRemainingOperateTime = () : number => {
        return Math.trunc(this.getOperateTime() - this.operateTimeElapsed);
    }

    readonly getRemainingOperateTimeAsPercentage = () : number => {
        return Math.trunc(100 * (this.getOperateTime() - this.operateTimeElapsed) / this.getOperateTime());
    }

    readonly getEarnings = () : number => {
        const multiplier = this.upgrade.getUpgradeMultiplier();
        return this.numOwned * this.earningsPerOwned * multiplier;
    }

    readonly getBuyPrice = () : number => {
        return this.initialPrice * (this.numOwned + 1);
    }
}
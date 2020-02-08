import Manager from './manager';

export default class Business {
    readonly name: string;
    readonly initialPrice: number;
    readonly initialOperateTimeSec: number;
    earningsPerOwned: number;
    isUpgraded: boolean;
    numOwned: number;

    isBuyBusinessClicked: boolean;
    isOperating: boolean;
    operateTimeElapsed: number;

    manager: Manager;

    constructor (name: string, initialPrice: number, initialBuildTimeSec: number, earningsPerOwned: number, manager: Manager) {
        this.name = name;
        this.initialPrice = initialPrice;
        this.initialOperateTimeSec = initialBuildTimeSec;
        this.earningsPerOwned = earningsPerOwned;
        this.isUpgraded = false;
        this.numOwned = 0;

        this.isBuyBusinessClicked = false;

        this.isOperating = false;
        this.operateTimeElapsed = 0;

        this.manager = manager;
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

    upgrade = () => {
        if (!this.isUpgraded) {
            this.isUpgraded = true;
            this.earningsPerOwned *= 2;            
        }
    }

    incrementOwned = () => {
        this.numOwned += 1;
    }

    getRemainingBuildTime = () : number => {
        return Math.trunc(this.initialOperateTimeSec - this.operateTimeElapsed);
    }

    getEarnings = () : number => {        
        return this.numOwned * this.earningsPerOwned;
    }

    getBuyPrice = () : number => {
        return this.initialPrice * (this.numOwned + 1);
    }
}
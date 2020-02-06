export default class Business {
    readonly name: string;
    readonly initialPrice: number;
    readonly initialBuildTimeSec: number;
    earningsPerOwned: number;
    isUpgraded: boolean;
    numOwned: number;

    isBuilding: boolean;
    buildingTimeElapsed: number;

    constructor (name: string, initialPrice: number, initialBuildTimeSec: number, earningsPerOwned: number) {
        this.name = name;
        this.initialPrice = initialPrice;
        this.initialBuildTimeSec = initialBuildTimeSec;
        this.earningsPerOwned = earningsPerOwned;
        this.isUpgraded = false;
        this.numOwned = 0;

        this.isBuilding = false;
        this.buildingTimeElapsed = 0;
    }

    startBuilding = () => {
        this.isBuilding = true;
        this.buildingTimeElapsed = 0;
    }

    updateBuildTime = (deltaTime: number) => {
        console.log("updating build time");
        this.buildingTimeElapsed += deltaTime;
        const businessBuildTime = this.initialBuildTimeSec;
        let timeRemaining = businessBuildTime - this.buildingTimeElapsed;
        if (timeRemaining <= 0) {
            this.isBuilding = false;
            this.buildingTimeElapsed = 0;
        }    
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
        return Math.trunc(this.initialBuildTimeSec - this.buildingTimeElapsed);
    }

    getEarnings = () : number => {        
        return this.numOwned * this.earningsPerOwned;
    }
}
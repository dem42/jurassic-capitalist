export default class Upgrade {
    readonly cost: number;
    readonly upgradeMultiplier: number;
    isUpgraded: boolean;
    deactivated: boolean;

    constructor(cost: number, upgradeMultiplier: number) {
        this.cost = cost;
        this.upgradeMultiplier = upgradeMultiplier;
        this.isUpgraded = false;
        this.deactivated = false;
    }

    static from(u: Upgrade) : Upgrade {
        const nu = new Upgrade(u.cost, u.upgradeMultiplier);
        nu.deactivated = u.deactivated;
        nu.isUpgraded = u.isUpgraded;
        return nu;
    }

    getUpgradeMultiplier() : number {
        return this.isUpgraded ? this.upgradeMultiplier : 1;
    }
}
export default class Manager {
    readonly price: number;
    isOwned: boolean;
    deactivated: boolean;

    constructor(price: number) {
        this.price = price;
        this.isOwned = false;
        this.deactivated = false;
    }
}
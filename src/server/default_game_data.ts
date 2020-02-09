import Business from '../shared/business';
import Player from '../shared/player';
import Manager from '../shared/manager';
import Upgrade from '../shared/upgrade';

export default {
    initialBusinesses: [
        new Business("Velociraptor", "raptor", 1, 3, 1, new Manager(100), new Upgrade(200, 3)),
        new Business("Diplodocus", "diplo", 100, 10, 100, new Manager(1000), new Upgrade(2000, 3)),
        new Business("Triceratops", "tricer", 1000, 45, 1000, new Manager(10_000), new Upgrade(20_000, 3)),
        new Business("T-Rex", "trex", 10_000, 120, 10_000, new Manager(100_000), new Upgrade(200_000, 3)),
    ],
    initialPlayer: new Player(1),
}
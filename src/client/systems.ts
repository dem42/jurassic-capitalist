import Business from '../shared/business';
import { reprTime } from './utils';

export class BusinessTimerSystem {

    process(deltaTime: number, businesses: Business[]) {
        for (let business of businesses) {
            if (business.isBuilding) {
                business.updateBuildTime(deltaTime);
            }     
        };
    }
}
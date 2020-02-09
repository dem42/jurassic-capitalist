import Business from "../shared/business";

export default function offlineEarnings(serverTimeS: number, businesses: Business[]) : number {
    let totalOfflineEarnings = 0;
    console.log(`calc earnings serverside: ${serverTimeS}`);
    for (let business of businesses) {
        console.log(`for ${business.name} start: ${business.operateStartTimeS}`);        
        if (business.operateStartTimeS > 0 && serverTimeS > business.operateStartTimeS) {
            const operateDuration = serverTimeS - business.operateStartTimeS;
            if (operateDuration < business.getOperateTime()) {
                console.log(`lower than operate time ${operateDuration} and ${business.getOperateTime()}`);
                business.operateTimeElapsed = operateDuration; 
            } else {
                const div = operateDuration / business.getOperateTime();
                const produced = Math.trunc(business.manager.isOwned ? div : Math.min(1, div));
                const offlineEarningsProduced = produced * business.getEarnings();
                console.log(`higher than operate time ${operateDuration} and ${business.getOperateTime()}, ${div}, ${produced}, ${offlineEarningsProduced}`);
                totalOfflineEarnings += offlineEarningsProduced;
                // make sure that any unfinished operate time is properly calculated
                if (business.manager.isOwned) {
                    business.operateTimeElapsed = operateDuration - produced * business.getOperateTime();
                    business.isOperating = true;
                    business.operateStartTimeS = serverTimeS - business.operateTimeElapsed;                    
                } else {
                    business.isOperating = false;
                    business.operateStartTimeS = -1;
                    business.operateTimeElapsed = 0;
                }
            }
        }
    }
    return totalOfflineEarnings;
}
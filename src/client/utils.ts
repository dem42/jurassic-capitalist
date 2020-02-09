const padToTwo = (num: number) : string => num <= 99 ? `0${num}`.slice(-2) : num.toString();

interface HasClass {
    className: string;
}

export const reprTime = (timeToBuildSec: number) : string => {
    const s = timeToBuildSec % 60;
    const m = Math.trunc(timeToBuildSec / 60) % 60;
    const h = Math.trunc(timeToBuildSec / 3600);
    return `${padToTwo(h)}:${padToTwo(m)}:${padToTwo(s)}`;
}

export const setDivActive = (divId: string, active: boolean) => {
    const div = document.querySelector(divId) as HasClass;
    div.className = active ? "" : "inactive";
}

export const setHtmlElementActive = (withClass: HasClass, active: boolean) => {
    withClass.className = active ? "" : "inactive";
}
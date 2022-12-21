import {  keyboard } from "./contents.js"

const gameManager = {
    firstDay: new Date("25 Nov 2022"),
    dailyMode: null,




    getDay: function () {
        const today = new Date().getTime();
        const diff = today - gameManager.firstDay;
        const daysDiff = Math.floor(diff / (24 * 60 * 60 * 1000));
        return daysDiff;
    },

}

export { gameManager }

import { uColours, keyboard, dictionary, derivatives } from './contents.js';


document.addEventListener("DOMContentLoaded", () => {

    initialisation()

    async function initialisation(){
        colourConform();
        keyboard.initialise();
        await dictionary.load();
        await derivatives.load();
    }

    function colourConform() {
        var r = document.querySelector(':root');
        Object.keys(uColours).forEach(key => {
            r.style.setProperty('--' + key, uColours[key]);
        })
    }


})

import { uColours, keyboard, dictionary, derivatives } from './contents.js';

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
  }

document.addEventListener("DOMContentLoaded", () => {

    initialisation()


    var controlLetters = [["A","B","C","D","E"],["F","G","H","I","J"],["K","L","M","N","O"],["P","Q","R","S","T"],["U","V","W","X","Y"]]

    const spinners = document.querySelectorAll(".spinner");

    for (let i = 0; i < spinners.length; i++) {
        const spinner = spinners[i];
        const letters = controlLetters[i]
        for (let y = 0; y < 9; y++) {
            let newSpan = document.createElement("span")
            let num = (y+3) % 5
            newSpan.textContent = controlLetters[i][num]
            spinner.appendChild(newSpan)
        }
        spinner.classList.add("instant-animation")
        spinner.style.transform = `translateY(-80px)`
    }

    let intervalId = setInterval(() => {
        scrollLetters();
    }, 2000);

    function scrollLetters() {
        let ind = Math.floor(Math.random() * 5);
        let poss = [-2,-1,1,2].random()
        console.log(poss)

        const spinner = spinners[ind]
        arrayRotate(controlLetters[ind],poss)
        spinnerRotate(spinner,poss)

    }

    function transitionEndHandler(event) {
        normalise(event.currentTarget)
        event.currentTarget.removeEventListener("transitionend", transitionEndHandler)
        event.currentTarget.classList.remove("duration-animation")
        event.currentTarget.classList.add("instant-animation")
        event.currentTarget.style.transform = `translateY(-80px)`
    }


    function spinnerRotate(spinner, amount) {
        let box = spinner.parentElement.querySelector(".box")
        box.classList.add("selected")

        spinner.classList.remove("instant-animation")
        spinner.classList.add("duration-animation")
        spinner.style.transform = `translateY(${-80+40*amount}px)`
        spinner.addEventListener("transitionend", (event) => transitionEndHandler(event))
    }


    function arrayRotate(arr, count) {
        const len = arr.length
        arr.push(...arr.splice(0, (-count % len + len) % len))
    }



    function normalise(spinner) {

        let letters = controlLetters[spinner.dataset.index]
        let children = Array.from(spinner.children)
        for (let y = 0; y < 9; y++) {
            let num = (y+3) % 5
            children[y].textContent = letters[num]
        }
    }






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

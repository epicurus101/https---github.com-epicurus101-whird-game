import { uColours, keyboard, dictionary, derivatives, logic } from './contents.js';
import { Spinner } from './Spinner.js';


  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  

document.addEventListener("DOMContentLoaded", () => {

    var current = 0
    var spinners = []
    var guesses = 0

    initialisation()

     async function initialisation(){
        for (let i = 0; i < 5; i++) {
            const element = new Spinner(i)
            spinners.push(element)    
        }
        colourConform();
        keyboard.initialise();
        await dictionary.load();
        await derivatives.load();

        populateControl()
        highlightCurrent()
    }

    function getFiveUniqueWords() {
        var lines = []
        do {
            let newWord = dictionary.words.random()
            if (!checkMatchingLetters(newWord, lines)) {
                lines.push(newWord)
            }
        } while (lines.length < 5)
        return lines
    }

    function checkMatchingLetters(word, array) {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < word.length; j++) {
                if (word[j] === array[i][j]) {
                    return true
                }
            }
        }
        return false;
    }
    
    function populateControl(){

        let puzzle = getFiveUniqueWords()

        // logic.analyse(puzzle)
      //  console.log(puzzle)
        for (let i = 0; i < 5; i++) {
            var array =[]
            for (let j = 0; j < 5; j++) {
                let letter = puzzle[j][i]
                array.push(letter)
            }
            shuffle(array)
            spinners[i].newLetters(array)
        }

    }

    function updateAllSpinners(){
        for (let i = 0; i < spinners.length; i++) {
            const spinner = spinners[i];
            spinner.instantColour()
        }
    }

    function tryKey(str){

        let cSpinner = spinners[current]
        let ind = cSpinner.letterArray.indexOf(str)
        console.log(ind)
        if (ind >= 0) {
            let diff = 2-ind
            cSpinner.animatedRotate(diff)
            current = Math.min(current+1, 4)
            highlightCurrent()
        }
        console.log(str)
    }

    function highlightCurrent() {
        console.log(spinners)
        for (let i = 0; i < spinners.length; i++) {
            let spinner = spinners[i];
            spinner.highlightBox(i == current)
        }
    }

    function deleteKey(){
        current = Math.max(current-1, 0)
        highlightCurrent(current)
    }

    function submitWord(){
        var string = ""
        for (let i = 0; i < 5; i++) {
            string += spinners[i].centreLetter()
        }
        console.log(string)
        if (dictionary.words.includes(string)) {
            for (let i = 0; i < 5; i++) {
                spinners[i].addFound(string[i])
            }
            guesses++
            document.getElementById("guess-count").textContent = `Guesses: ${guesses}`
        }
        current = 0
        highlightCurrent()
        updateAllSpinners()
        if (completed()) {
            console.log(`completed with ${guesses} guesses`)
            resetGame()
        }
    }

    function resetGame() {
        guesses = 0
        Spinner.currentColour = 0
        Spinner.penalties = 0
        document.getElementById("guess-count").textContent = "Guesses: 0"
        populateControl()
        updateAllSpinners()
        for (let i = 0; i < spinners.length; i++) {
            const spinner = spinners[i];
            console.log(spinner.foundSet)
        }
    }

    function completed() {
        for (let i = 0; i < spinners.length; i++) {
            const spinner = spinners[i];
            if (spinner.foundSet.size < 5) {
                return false
            }
        }
        return true
    }



    function colourConform() {
        var r = document.querySelector(':root');
        Object.keys(uColours).forEach(key => {
            r.style.setProperty('--' + key, uColours[key]);
        })
    }

    document.addEventListener('keyup', function (event) {
        let str = event.key.toUpperCase();
        if (str == "BACKSPACE") {
            deleteKey()
        } else if (str == "ENTER") {
            submitWord()
        } else if (/^[a-zA-Z()]$/.test(str)) {
            tryKey(str)
        }
    
    })

    document.addEventListener('letterKey', (e) => {
        let letter = e.detail.letter
        tryKey(letter)
    })
    
    document.addEventListener('delete', (e) => {
        deleteKey()
    })

    document.addEventListener('submit', (e) => {
        submitWord()
    })

    document.addEventListener('spinnerTouch', (e) => {
        let num = e.detail.spinner
        current = num
        console.log("spinnerTouch received")
        highlightCurrent()
    })


})



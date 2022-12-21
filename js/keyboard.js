import { uColours, animateCSS } from './contents.js';

const keyboard = {

    allowInput: false,
    keys: document.querySelectorAll(".keyboard-row button"),
    standardKeys: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],

    initialise: function () {
        keyboard.keys.forEach(key => {
            const letter = key.getAttribute("data-key");
            key.setAttribute("id", `k-${letter}`);
            key.classList.add("prevent-select")
            key.customInfo = -2;

            key.addEventListener('long-press', function (e) {
                e.preventDefault(); //maybe work out what this does some day
                keyboard.longpressHandler(letter);
            });

            key.addEventListener('click', function (e) {
                if (!keyboard.allowInput) { return }
                keyboard.keyHandler(letter);
            })

            key.addEventListener('contextmenu', function (e) {
                e.preventDefault()
                keyboard.longpressHandler(letter)
            })
        })
    },
    keyHandler: function (letter) {
        if (!keyboard.allowInput) {return}
        if (letter === 'ENTER') {
            const event = new CustomEvent('submit');
            document.dispatchEvent(event);
            return;
        } else if (letter === 'DEL') {
            const event = new CustomEvent('delete');
            document.dispatchEvent(event);
            return;
        } else if (!keyboard.standardKeys.includes(letter)) {
            return;
        } else {
            const event = new CustomEvent('letterKey', {
                detail: {
                    letter: letter
                }
            });
            document.dispatchEvent(event);
        }
    },
    longpressHandler: function (letter) {
        if (!keyboard.allowInput) {return}
        if (!keyboard.standardKeys.includes(letter)) {
            return;
        } else {
            const event = new CustomEvent('excludeLetter', {
                detail: {
                    letter: letter
                }
            });
            document.dispatchEvent(event);
            animateCSS(`#k-${letter}`, "headShake")
        }
    },
    reset: function () {
        keyboard.keys.forEach(key => {
            key.customInfo = -2;
            key.style.backgroundColor = uColours.midGrey;
            key.style.borderColor = uColours.midGrey;
        })
    },
    //need to come up with comparisonData from boardmanager
    update: function (board) {
        let excluded = board.excluded
        excluded.forEach(letter => {
            const button = document.getElementById(`k-${letter}`);
            keyboard.updateKey(button, -1);
        });
        let comparisons = board.getAllBoardComparisons()
        for (let i = 0; i < comparisons.length; i++) {
            const compare = comparisons[i];
            const currentWordArr = board.guessedWords[i];
            if (currentWordArr.length == 5) {
                keyboard.updateKeyboardRow(compare, currentWordArr)
            }

        }
    },
    updateKeyboardRow: function (comparisonResult, currentWordArr) { // keyboard
        for (let i = 0; i < comparisonResult.length; i++) {
            const letter = currentWordArr[i];
            const button = document.getElementById(`k-${letter}`);
            keyboard.updateKey(button, comparisonResult[i]);
        }
    },
    updateKey: function (key, newValue) { //keyboard
        if (key.customInfo >= newValue) {
            return;
        } else {
            key.customInfo = newValue;
            if (newValue == -1) {
                key.style.backgroundColor = uColours.darkBlue;
                key.style.borderColor = uColours.darkBlue;
            } else if (newValue == 0) {
                key.style.backgroundColor = uColours.darkGrey;
                key.style.borderColor = uColours.darkGrey
            } else if (newValue == 1) {
                key.style.backgroundColor = uColours.yellow;
                key.style.borderColor = uColours.yellow;
            } else if (newValue == 2) {
                key.style.backgroundColor = uColours.green;
                key.style.borderColor = uColours.green;
            }
        }
    }

}

export { keyboard }

let keyTimers = {};
let responded = new Set();

document.addEventListener('keydown', function (event) {
    let str = event.key.toUpperCase();
    if (str == "BACKSPACE") {
        str = "DEL";
    }
    if (keyTimers[str] == null) {
        keyTimers[str] = Date.now();
    } else if (keyTimers[str] != null && !responded.has(str)) {
        const interval = Date.now() - keyTimers[str];
        if (interval > 800) {
            keyboard.longpressHandler(str);
            responded.add(str)
        }
    } else {
        return;
    }
});

document.addEventListener('keyup', function (event) {
    let str = event.key.toUpperCase();
    if (str == "BACKSPACE") {
        keyboard.keyHandler("DEL");
    } else if (str == "ENTER") {
        keyboard.keyHandler("ENTER");
    } else if (str == "TAB" || str == " ") {
        const event = new CustomEvent('cycle');
        document.dispatchEvent(event);
    } else if (keyTimers[str]) {
        const interval = Date.now() - keyTimers[str];
        delete keyTimers[str];
        if (interval < 800) {
            keyboard.keyHandler(str);
        }
    }
    responded.delete(str)
})

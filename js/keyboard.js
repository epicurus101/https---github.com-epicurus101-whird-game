
const keyboard = {

    allowInput: true,
    keys: document.querySelectorAll(".keyboard-row button"),
    standardKeys: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],

    initialise: function () {
        keyboard.keys.forEach(key => {
            const letter = key.getAttribute("data-key");
            key.setAttribute("id", `k-${letter}`);
            key.classList.add("prevent-select")

            key.addEventListener('click', function (e) {
                if (!keyboard.allowInput) { return }
                keyboard.keyHandler(letter);
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
}
            

export { keyboard }


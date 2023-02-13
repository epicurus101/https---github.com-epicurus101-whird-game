
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

function arrayRotate(arr, count) {
    const len = arr.length
    arr.push(...arr.splice(0, (-count % len + len) % len))
}

export class Spinner {
    index;
    element;
    parent;
    highlightElement;
    letterArray;
    foundSet;
    centre;
    startY = 0;
    rememberedY = 0; //only used for touch, not mouse
    inputAllowed = true;
    touching = false;

    constructor(index) {
        this.index = index;
        this.element = document.getElementById("spinner" + String(index))
        this.parent = this.element.parentElement
        this.highlightElement = this.parent.querySelector(".box")
        this.foundSet = new Set()
        for (let y = 0; y < 9; y++) {
            let newSpan = document.createElement("span")
            this.element.appendChild(newSpan)
        }
        this.element.classList.add("instant-animation")
        this.element.style.transform = `translateY(-120px)`

        this.parent.addEventListener("mousedown", (e) => {
            let yPos = e.screenY
            this.mousedown(yPos, this)
        })
        this.parent.addEventListener("mousemove", (e) => {
            let yPos = e.screenY
            this.mousemove(yPos, this)
        })
        this.parent.addEventListener("mouseup", (e) => {
            let yPos = e.screenY
            this.mouseup(yPos, this)
        })
        this.parent.addEventListener("mouseleave", (e) => {
            let yPos = e.screenY
            this.mouseup(yPos, this)
        })
        this.parent.addEventListener("touchstart", (e) => {
            e.stopPropagation()
            e.preventDefault()
            let yPos = e.touches[0].pageY
            this.rememberedY = yPos;
            this.mousedown(yPos, this)
        })
        this.parent.addEventListener("touchmove", (e) => {
            e.stopPropagation()
            e.preventDefault()
            let yPos = e.touches[0].pageY
            this.rememberedY = yPos;
            this.mousemove(yPos, this)
        })
        this.parent.addEventListener("touchend", (e) => {
            e.stopPropagation()
            e.preventDefault()
            this.mouseup(this.rememberedY, this)
        })
        this.parent.addEventListener("touchcancel", (e) => {
            e.stopPropagation()
            e.preventDefault()
            this.mouseup(this.rememberedY, this)
        })

    }

    mousedown(yPos, inst) {
        console.log(inst.inputAllowed, inst.touching)
        if (!inst.inputAllowed) {return}
        inst.startY = yPos
        inst.touching = true // marks the start of the touch
        inst.inputAllowed = false //forbid other inputs
    }

    mousemove(yPos, inst) {
        if (!inst.touching) {return} // must be touching
        var diff = inst.startY-yPos
        diff = Math.min(  Math.max(-120,diff), 120)
        inst.element.style.transform = `translateY(${-120-diff}px)`
        const event = new CustomEvent('spinnerTouch', {
            detail: {
                spinner: inst.index
            }
        });
        document.dispatchEvent(event);
    }

    mouseup(yPos, inst) {
        if (!inst.touching) {return} // excludes stray moved touches being released
        var diff = inst.startY-yPos
        diff = Math.min(Math.max(-120,diff), 120)
        let inputChange = Math.round(diff / 60)*-1
        inst.animatedRotate(inputChange)
        inst.touching = false //no longer touching!
    }

    newLetters(array) {
        this.letterArray = array
        let children = Array.from(this.element.children)
        for (let y = 0; y < children.length; y++) {
            let child = children[y]
            let num = (y + 3) % 5
            child.textContent = array[num]
        }
        this.foundSet = new Set()
    }

    instantColour() {
        let children = Array.from(this.element.children)
        for (let y = 0; y < children.length; y++) {
            let child = children[y]
            if (this.foundSet.has(child.textContent)) {
                child.classList.add("found")
                console.log("adding colour")
            } else {
                child.classList.remove("found")
            }
        }
    }

    centreLetter() {
        return this.letterArray[2]
    }

    addFound(str) {
        this.foundSet.add(str)
    }

    highlightBox(bool) {
        if (bool) {
            this.highlightElement.classList.add("selected")
        } else {
            this.highlightElement.classList.remove("selected")
        }
    }

    animatedRotate(amount) {
        let style = window.getComputedStyle(this.element)
        console.log(style.transitionDuration)
        this.inputAllowed = false
        arrayRotate(this.letterArray, amount);
        this.element.classList.remove("instant-animation")
        this.element.classList.add("duration-animation")
        this.element.style.transform = `translateY(${-120 + 60 * amount}px)`
        let style2 = window.getComputedStyle(this.element)
        console.log(style2.transitionDuration)
        setTimeout(() => {
            this.transitionEndHandler()
        }, 500);
    }

    transitionEndHandler() {
        console.log("transition end")
        let spinner = this.element
        this.normalise()
        spinner.classList.remove("duration-animation")
        spinner.classList.add("instant-animation")
        // have we properly sorted this?
        for (let i = 0; i < Array.from(spinner.children).length; i++) {
            const element = Array.from(spinner.children)[i];
            element.classList.remove("duration-animation")
            element.classList.add("instant-animation")
        }
        spinner.style.transform = `translateY(-120px)`
        this.inputAllowed = true;
    }

    normalise() {

        let spinner = this.element
        let children = Array.from(spinner.children)
        for (let y = 0; y < 9; y++) {
            let num = (y+3) % 5
            let str = this.letterArray[num]
            let element = children[y]
            element.classList.remove("duration-animation")
            element.classList.add("instant-animation")
            element.textContent = str
            if (this.foundSet.has(str)) {
                element.classList.add("found")
                console.log("adding property")
            } else {
                element.classList.remove("found")
            }
        }
    }




}
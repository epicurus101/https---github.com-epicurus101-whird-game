

Array.prototype.randomItem = function random() {
    let item = this[Math.floor(Math.random() * this.length)];
    return item;
}

Array.prototype.matches = function matches(x) {
    if (this.length != x.length) { return false } 
    for (let i = 0; i < this.length; i++) {
        if (this[i] != x[i]) {
            return false
        }
    }
    return true;
}

Array.prototype.toTally = function toTally() {
  let tally = {}
  this.forEach( (item) => {
    tally[item] = tally[item] ? tally[item] + 1 : 1
  })
  return tally
}

Set.prototype.randomItem = function random() {
    return Array.from(this).randomItem();
}

Set.prototype.filter = function filter(f) {
    var newSet = new Set();
    for (var v of this) if(f(v)) newSet.add(v);
    return newSet;
}

Set.prototype.remove = function remove(x) {
    this.forEach ((item) => {
        if (item == x) {
          this.delete(item);
        }
      });
}

Set.prototype.intersection = function intersection(other) {
  const _intersection = new Set();
  let array = Array.from(this.values())
  array.forEach( (word) => {
    if (other.has(word)) {
      _intersection.add(word);
    }
  })
  return _intersection;
}

String.prototype.uniqueChars = function uniqueChars() {
    const arr = Array.from(this);
    const set = new Set(arr);
    const chars = set.size;
    return chars;
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);
   // console.log("here's the node to animate", node)

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });



  export {animateCSS}
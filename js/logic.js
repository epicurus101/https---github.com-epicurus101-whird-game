import { dictionary } from "./contents.js"

const logic = {

    analyse: function(puzzle) {
        let master = logic.prepareArray(puzzle)
        let allWords = logic.findAllWords(master)
      //  console.log(allWords)
       // let uniqueSets = logic.findUniqueSets(allWords)
       // console.log(`this puzzle contains ${allWords.length} possible words and ${uniqueSets.length} perfect solutions, which are ${uniqueSets}`)
    },
    
    
    // takes five words and puts the letters into five arrays representing 1st letter, 2nd etc
    prepareArray: function(puzzle) {

        var master = []
        for (let i = 0; i < 5; i++) {
            var array =[]
            for (let j = 0; j < 5; j++) {
                let letter = puzzle[j][i]
                array.push(letter)
            }
            master.push(array)
        }
        return master

    },

     findUniqueSets: function(allWords) {

        let result = [];
        let currentCombination = [];
      
        function backtrack(start) {
          if (currentCombination.length === 5) {
            result.push([...currentCombination]);
            return;
          }
      
          for (let i = start; i < allWords.length; i++) {
            let isValid = true;
            for (let j = 0; j < currentCombination.length; j++) {
              if (allWords[i][j] === currentCombination[j][j]) {
                isValid = false;
                break;
              }
            }
            if (isValid) {
              currentCombination.push(allWords[i]);
              backtrack(i + 1);
              currentCombination.pop();
            }
          }
        }
      
        backtrack(0);
        return result;
      },
      




    findAllWords: function(array) {

        var words = []

        for (let a = 0; a < 5; a++) {
            let letter1 = array[0][a]
            for (let b = 0; b < 5; b++) {
                let letter2 = array[1][b]
                for (let c = 0; c < 5; c++) {
                    let letter3 = array[2][c]
                    for (let d = 0; d < 5; d++) {
                        let letter4 = array[3][d]
                        for (let e = 0; e < 5; e++) {
                            let letter5 = array[4][e]
                            let word = letter1 + letter2 + letter3 + letter4 + letter5
                            if (dictionary.words.includes(word)) {
                                console.log(word)
                                words.push(word)
                            }
                        }
                    }
                }
            }
        }

        return words


    }




}

export {logic}
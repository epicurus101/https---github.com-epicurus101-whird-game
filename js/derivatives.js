let derivatives = {

    version : "1.03",

    words: [],

    load : async function() {
        let savedVersion = localStorage.getItem("derivVersion")
        let save = derivatives.getFromLS()
        if (save != null && derivatives.version == savedVersion) {
            console.log("we had a save and it's the same as the version we think")
            derivatives.words = save;
        } else {
            derivatives.words = await derivatives.download()
        }

    },


    download : async function() {
        const response = await fetch('derivatives.json');
        let array = await response.json();
        array.forEach((word, index) => {
            array[index] = word.toUpperCase();
        })
        derivatives.save(array);
        console.log("derivatives loaded from web and saved");
        return array
    },


    save: function(array){
        let str = JSON.stringify(array);
        localStorage.setItem("derivatives", str);
        localStorage.setItem("derivVersion", derivatives.version)
    },

    getFromLS: function (){
        const save = localStorage.getItem("derivatives");
        if (save == null) { return null };
        let deriv = JSON.parse(save);
        return deriv;
    }


}


export {derivatives}

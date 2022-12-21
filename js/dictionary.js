let dictionary = {

    version : "1.03",

    words: [],

    load : async function() {
        let savedVersion = localStorage.getItem("dictVersion")
        let save = dictionary.getFromLS()
        if (save != null && dictionary.version == savedVersion) {
            console.log("we had a save and it's the same as the version we think")
            dictionary.words = save;
        } else {
            dictionary.words = await dictionary.download()
        }

    },


    download : async function() {
        const response = await fetch('dictionary.json');
        let array = await response.json();
        array.forEach((word, index) => {
            array[index] = word.toUpperCase();
        })
        dictionary.save(array);
        console.log("dictionary loaded from web and saved");
        return array
    },


    save: function(dict){
        let str = JSON.stringify(dict);
        localStorage.setItem("dictionary", str);
        localStorage.setItem("dictVersion", dictionary.version)
    },

    getFromLS: function (){
        const save = localStorage.getItem("dictionary");
        if (save == null) { return null };
        let dict = JSON.parse(save);
        return dict;
    }


}


export {dictionary}

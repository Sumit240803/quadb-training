const fs = require("fs")
const path = require('path')

function getRandom(max,count){
    const ind = new Set();
    while(ind.size < count){
        const random = Math.floor(Math.random()*max);
        ind.add(random);
    }
    return [...ind]
}
/*
console.log(getRandom(10,3));
console.log(getRandom(5,1));
console.log(getRandom(1,1));*/

function loadCard(index){
    const filePath = path.join(__dirname , "metadata",`${index}.json`);
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(data);
    return parsedData;
}
function extractStats(card) {
    const stats = {};
    card.attributes.forEach(attr => {
        stats[attr.trait_type.toLowerCase()] = attr.value;
    });

    return {
        name: card.name,
        description: card.description,
        image: card.image,
        rarity: stats.rarity,
        attack: stats.attack,
        defense: stats.defense
    };
}
//console.log(extractStats(loadCard(3)));

function generate(){
    const deck = [];
    getRandom(17,4).forEach(i =>{
        deck.push(extractStats(loadCard(i)))
    })
    deck.push(extractStats(loadCard(18)))
    return deck;
}

module.exports = {generate};
//console.log(generate());
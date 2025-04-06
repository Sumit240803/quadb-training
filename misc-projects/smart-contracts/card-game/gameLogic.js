function result(points,player1 , player2,scores,roomId) {
    const set1 = points[player1];
    const set2 = points[player2];
    const player1Damage = Math.max(0 , set1.attack - set2.defense);
    const player2Damage = Math.max(0,set2.attack - set1.defense);
    if(player1Damage > player2Damage){
        scores[roomId][player1]+=player1Damage;
        return scores;
    }else if (player2Damage > player1Damage){
        scores[roomId][player2]+=player2Damage;
        return scores; 
    }else{
        scores[roomId][player1]+=player1Damage;
        scores[roomId][player2]+=player2Damage;
        return scores;
    }
}
module.exports = {result};
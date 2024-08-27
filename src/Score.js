export default class Score {
    constructor(){
        this.element = document.getElementById('score');
        this.score = 0;
    }

    increment(){
        this.score++
    }

    update(){
        this.element.innerText = this.score;
    }
}
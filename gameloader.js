class GameLoader {

    // TODO: Ask why game stats are in the parent

    constructor() {
        this.tetrisTimesPlayed = 0;
        this.snakeTimesPlayed = 0;
        this.tetrisHighScore = 0;
        this.snakeHighScore = 0;
    }

    incrementTetrisTimesPlayed = () => {
        this.tetrisTimesPlayed++;
    }

    incrementSnakeTimesPlayed = () => {
        this.snakeTimesPlayed++;
    }
}

let gl = new GameLoader();
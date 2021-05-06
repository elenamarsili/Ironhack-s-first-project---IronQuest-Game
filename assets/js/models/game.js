class Game {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId)
        this.ctx = canvas.getContext("2d")

        this.intervalId = null

        this.drawCount = 0
        this.background = new Background(this.ctx)
        this.character = new Character(this.ctx)
        this.block1 = new Block(this.ctx, 499, 2)
        this.block2 = new Block(this.ctx, 342, 3)
        this.block3 = new Block(this.ctx, 185, 4)
        this.block4 = new Block(this.ctx, 28, 6)
        this.block5 = new Block(this.ctx, -129, 5)
        this.block6 = new Block(this.ctx, -286, 5)
        this.block7 = new Block(this.ctx, -443, 4)
        this.blocks = [this.block1, this.block2, this.block3, this.block4, this.block5, this.block6, this.block7]

        this.bird1 = new Bird(this.ctx, 550, 600)
        this.bird2 = new Bird(this.ctx, 393, 400)
        this.bird3 = new Bird(this.ctx, 236, 200)
        this.bird4 = new Bird(this.ctx, 79, 600)
        this.bird5 = new Bird(this.ctx, -78, 500)
        this.bird6 = new Bird(this.ctx, -235, 300)
        this.bird7 = new Bird(this.ctx, -392, 600)
        this.bird8 = new Bird(this.ctx, -549, 400)
        this.birds = [this.bird1, this.bird2, this.bird3, this.bird4, this.bird5, this.bird6, this.bird7, this.bird8]

        this.castle = new Castle(this.ctx)

        this.timer = new Timer (this.ctx)
 
        this.tickSeconds = 0

        this.onWin = () => {}
        this.onGameOver = () => {}
    }

    startGame() {
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.tickSeconds++
                this.clear()
                this.move()
                this.draw()
                this.checkCollisionsWithBlocks()
                this.checkCollisionsWithCastle()
                this.checkCollisionsWithBirds()
                this.fall()
               
            }, 1000 / 60)
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }

    move() {
        this.character.move()
        this.blocks.forEach((block) => block.move(this.character))
        this.birds.forEach((bird) => bird.move(this.character))
        this.background.move(this.character)
        this.castle.move(this.character)
    }

    draw() {
        this.background.draw()
        this.character.draw()
        this.blocks.forEach(block => block.draw())
        this.birds.forEach(bird => bird.draw())
        this.castle.draw()
        this.timer.draw()
    }



    checkCollisionsWithBlocks() {
        const landingBlock = this.blocks.find(block => {
            return this.character.collidesWithBlock(block)
        })

        if (landingBlock) {
            this.character.follow(landingBlock)
        } else if (!this.character.isShrunk()){
            this.character.y0 = 575
            this.character.followingBlock = undefined
        }
    }

    checkCollisionsWithCastle() {
        if (this.character.collidesWithCastle(this.castle)) {
            this.character.x = this.castle.x + this.castle.w / 2
            this.character.y = this.castle.y + this.castle.h - this.character.h - 45
            this.character.vx = 0
            this.character.vy = 0
            this.character.g = 0
            setTimeout(() => {
                this.win()
            }, 500)
        }
    }

    checkCollisionsWithBirds() {
        this.birds.some(bird => {
            const collision = this.character.collidesWithBirds(bird)
            if (collision) {
                this.gameOver()
            }
        })
    }

    onKeyEvent(event) {
        this.character.onKeyEvent(event)
    }

    win() {
        clearInterval(this.intervalId)
        this.onWin()
    }

    fall() {
        if (this.character.isFalling()) {
            setTimeout(() => {
                this.gameOver()
            }, 600)
        }
    }

    gameOver() {
        clearInterval(this.intervalId)
        this.onGameOver()
    }

}
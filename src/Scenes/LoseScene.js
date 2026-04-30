class LoseScene extends Phaser.Scene {
    constructor() {
        super("loseScene");
    }

    init(data){
        this.finalScore = data.score || 0;
    }
    preload(){}

    create(){
        this.add.text(400, 180, "YOU LOSE", {
            fontSize: "64px",
            color: "#ff0000"
        }).setOrigin(0.5);

        this.add.text(400, 260, "FINAL SCORE", {
            fontSize: "28px",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.add.text(400, 310, this.finalScore, {
            fontSize: "48px",
            color: "#ffa500"
        }).setOrigin(0.5);

        let restart = this.add.text(400, 420, "PRESS TO RESTART", {
            fontSize: "40px",
            color: "#00ff00",
            backgroundColor: "#222",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        restart.setInteractive({ useHandCursor: true });

        restart.on("pointerover", () => {
            restart.setStyle({ color: "#ffff00" });
        });

        restart.on("pointerout", () => {
            restart.setStyle({ color: "#00ff00" });
        });

        restart.on("pointerdown", () => {
            this.scene.stop("GameScene");
            this.scene.start("GameScene");
        });

    }

    update(){}

}
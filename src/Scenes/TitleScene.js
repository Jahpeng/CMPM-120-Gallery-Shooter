class TitleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    init(){
        this.enemy_projectiles = [];
    }

    preload(){
        this.load.setPath("./assets/");
    
        // PLAYER STUFF
        this.load.image("player", "spaceRockets_003.png");
        this.load.image("player_missile", "spaceMissiles_010.png");
    
        // ENEMY TYPE 1 (SHOOTER) STUFF
        this.load.image("enemy_shooter", "spaceShips_004.png");
        this.load.image("enemy_missile", "spaceMissiles_005.png");
    }

    create(){
        this.add.text(400, 180, "SPACE BRAWL", {
            fontSize: "64px",
            color: "#a200ff"
        }).setOrigin(0.5);

        let start = this.add.text(400, 420, "START GAME", {
            fontSize: "40px",
            color: "#00ff00",
            backgroundColor: "#222",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        start.setInteractive({ useHandCursor: true });

        start.on("pointerover", () => {
            start.setStyle({ color: "#ffff00" });
        });

        start.on("pointerout", () => {
            start.setStyle({ color: "#00ff00" });
        });

        start.on("pointerdown", () => {
            this.scene.stop("GameScene");
            this.scene.start("GameScene");
        });


        let control = this.add.text(400, 520, "CONTROLS", {
            fontSize: "40px",
            color: "#00ff00",
            backgroundColor: "#222",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        control.setInteractive({ useHandCursor: true });

        control.on("pointerover", () => {
            control.setStyle({ color: "#ffff00" });
        });

        control.on("pointerout", () => {
            control.setStyle({ color: "#00ff00" });
        });

        control.on("pointerdown", () => {
            // this.scene.stop("GameScene");
            this.scene.start("controlsScene");
        });


        let credits = this.add.text(400, 620, "CREDITS", {
            fontSize: "40px",
            color: "#00ff00",
            backgroundColor: "#222",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        credits.setInteractive({ useHandCursor: true });

        credits.on("pointerover", () => {
            credits.setStyle({ color: "#ffff00" });
        });

        credits.on("pointerout", () => {
            credits.setStyle({ color: "#00ff00" });
        });

        credits.on("pointerdown", () => {
            // this.scene.stop("GameScene");
            this.scene.start("creditsScene");
        });

        this.enemyPath = [
            50, 50,
            750, 50,
            50, 50,
        ]
        this.enemyCurve = new Phaser.Curves.Spline(this.enemyPath);

        this.playerPath = [
            50, 700,
            750, 700,
            50, 700,
        ]
        this.playerCurve = new Phaser.Curves.Spline(this.playerPath);

        this.enemy = new RangedEnemy(this, this.enemyCurve, "enemy_shooter", 50, 50, 0);
        this.player = new RangedEnemy(this, this.playerCurve, "player", 50, 700, 0.5);
        // this.player.setScale(0.1);


    }

    update(time, delta){
        if(time > this.enemy.lastShot + this.enemy.fireRate){
          this.enemy.shoot(this);
          this.player.shoot(this);
          this.enemy.lastShot = time;
          this.player.lastShot = time;
        }

        this.dealWithBullets(delta);
    }


    dealWithBullets(delta) {
        for (let i = 0; i < this.enemy_projectiles.length; i++) {
            let bullet = this.enemy_projectiles[i];

            bullet.y += 120 * (delta / 1000);

            if (bullet.y > 600) {
                bullet.destroy();
                this.enemy_projectiles.splice(i, 1);
                i--;
            }
        }
    }
}
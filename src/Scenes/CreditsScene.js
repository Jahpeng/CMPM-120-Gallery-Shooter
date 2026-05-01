class CreditsScene extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    init(){}

    preload(){
        this.load.setPath("./assets/");
        this.load.image("player", "spaceRockets_003.png");
        this.load.image("enemy_shooter", "spaceShips_004.png");
        this.load.image("enemy_charger", "spaceShips_003.png");
    }

    create(){
        this.add.text(400, 180, "CREDITS:", {
            fontSize: "64px",
            color: "#ff7b00"
        }).setOrigin(0.5);

        this.add.text(400, 280, "SPRITES:", {
            fontSize: "32px",
            color: "#ff7b00"
        }).setOrigin(0.5);
        this.add.text(400, 320, "KENNEY SPACE SHOOTER EXTENSION", {
            fontSize: "20px",
            color: "#00ff88"
        }).setOrigin(0.5);
        this.add.text(400, 350, "KENNEY SMOKE PARTICLES", {
            fontSize: "20px",
            color: "#00ff88"
        }).setOrigin(0.5);

        this.add.text(400, 410, "AUDIO:", {
            fontSize: "32px",
            color: "#ff7b00"
        }).setOrigin(0.5);

        this.add.text(400, 450, "KENNEY DIGITAL AUDIO", {
            fontSize: "20px",
            color: "#00ff88"
        }).setOrigin(0.5);
        this.add.text(400, 480, "KENNEY SCI-FI SOUNDS", {
            fontSize: "20px",
            color: "#00ff88"
        }).setOrigin(0.5);

        let back = this.add.text(400, 590, "BACK TO TITLE", {
            fontSize: "40px",
            color: "#00ff00",
            backgroundColor: "#222",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        back.setInteractive({ useHandCursor: true });

        back.on("pointerover", () => {
            back.setStyle({ color: "#ffff00" });
        });

        back.on("pointerout", () => {
            back.setStyle({ color: "#00ff00" });
        });

        back.on("pointerdown", () => {
            // this.scene.stop("GameScene");
            this.scene.start("titleScene");
        });
        
        let offsetX = 30;
        let offsetY = 30;
        this.path = [
            75, 75,
            700, 75,
            700, 625,
            75, 625,
            75, 75,
            // 700, 75,
        ]

        this.curve = new Phaser.Curves.Spline(this.path);

        this.sprite = this.add.follower(this.curve, 75, 75, "player")
        this.sprite.setScale(0.2);
        // this.sprite.setAngle(90);

        this.sprite.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 6000,
            ease: 'Linear', //'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: true,
            rotationOffset: 90,//-90,
            startAt: 0
        });


        this.en1 = this.add.follower(this.curve, 75, 75, "enemy_shooter")
        this.en1.setScale(0.4);
        // this.sprite.setAngle(90);

        this.en1.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 6000,
            ease: 'Linear', //'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: true,
            rotationOffset: -90,//-90,
            startAt: 0.2
        });


        this.en2 = this.add.follower(this.curve, 75, 75, "enemy_charger")
        this.en2.setScale(0.4);
        // this.sprite.setAngle(90);

        this.en2.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 6000,
            ease: 'Linear', //'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: true,
            rotationOffset: -90,//-90,
            startAt: 0.4
        });

        // this.path = this.add.path(75, 75);

        // this.path.lineTo(700, 75);
        // this.path.lineTo(700, 625);
        // this.path.lineTo(75, 625);
        // this.path.lineTo(75, 75);

        // this.path.closePath();

        // this.sprite = this.add.follower(this.path, 75, 75, "player");

        // this.sprite.startFollow({
        //     duration: 6000,
        //     repeat: -1,
        //     rotateToPath: true,
        //     rotationOffset: 90
        // });

    }

    update(){}

}
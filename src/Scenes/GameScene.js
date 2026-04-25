class GameScene extends Phaser.Scene {

  constructor() {
    super("GameScene"); // scene key
    // init plain properties here
    this.my = {sprite: {}};
  }

  preload() {
    // load assets BEFORE create
    //this.load.image("hero", "hero.png");
    this.load.setPath("./assets/");
    
    // PLAYER STUFF
    this.load.image("player", "spaceRockets_003.png");
    this.load.image("player_missile", "spaceMissiles_010.png");
    
    // ENEMY TYPE 1 (SHOOTER) STUFF
    this.load.image("enemy_shooter", "spaceShips_004.png");
    this.load.image("enemy_missile", "spaceMissiles_005.png");

    // ENEMY TYPE 2 (CHARGER) STUFF
    this.load.image("enemy_charger", "spaceShips_003.png");
    this.load.image("enemy_shield", "spaceParts_088.png")
  }

  create() {
    // build the world ONCE
    //this.hero = this.add.sprite(400, 300, "hero");
    let my = this.my;
    
    // GAME ARRAYS
    this.player_projectiles = [];
    this.enemy_projectiles = [];
    this.enemy_shield = [];
    this.enemies = [];

    // BULLET LOGIC
    this.last_shot_time = 0;
    this.cooldown = 1500;
    
    // PLAYER SETUP 
    my.sprite.player = this.add.sprite(50, 550, "player");
    my.sprite.player.setScale(0.2);
    // CONTROLS
    this.akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // ENEMY TYPE 1 (SHOOTER) PATHS
    this.points = [
            20, 50,
            780, 50,
            400, 200,
            20, 50,
        ];
    this.curve = new Phaser.Curves.Spline(this.points);
    this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0));
    // my.sprite.enemyShip = this.add.follower(this.curve, 20, 50, "enemy_shooter");
    // my.sprite.enemyShip.setScale(0.2);
    // my.sprite.enemyShip.startFollow({
    //     from: 0,
    //     to: 1,
    //     delay: 0,
    //     duration: 5000,
    //     ease: 'Linear', //'Sine.easeInOut',
    //     repeat: -1,
    //     yoyo: true,
    //     rotateToPath: false,
    //     rotationOffset: -90
    // });

  }

  update(time, delta) {
    // runs every frame (~60 fps)
    //this.hero.x += 1;
    let my = this.my;

    // PLAYER CONTROLS
    if (this.akey.isDown){
        //my.sprite.mouth.x += 20;
        my.sprite.player.x -= 120 * (delta/1000)
        if (my.sprite.player.x <= 20) my.sprite.player.x = 20; // was 0
    }
    if (this.dkey.isDown){
        my.sprite.player.x += 120 * (delta/1000)
        if (my.sprite.player.x >= 780) my.sprite.player.x = 780; // was 800
    }

    if (this.spaceKey.isDown && (time > this.last_shot_time + this.cooldown)){
        let bullet = this.add.sprite(
            my.sprite.player.x,
            my.sprite.player.y,
            "player_missile"
        );
        bullet.setScale(0.5);
        //bullet.angle = -90;
        this.player_projectiles.push(bullet);
        this.last_shot_time = time;
    }

    for (let i = 0; i < this.player_projectiles.length; i++) {
        let bullet = this.player_projectiles[i];
        bullet.y -= 120 * (delta / 1000);
        if (bullet.y < -50) {
            bullet.destroy();
            this.player_projectiles.splice(i, 1);
            i--;
        }
    }

    // ENEMY LOGIC
    // this.enemies.forEach(enemy => {
    //     enemy.update(delta);
    // });


  }
}
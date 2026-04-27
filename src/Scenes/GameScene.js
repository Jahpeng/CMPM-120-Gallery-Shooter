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
    // WIDTH 800
    // HEIGHT 600
    let my = this.my;

    // GAME UI
    this.add.rectangle(
      400,   // screen middle X point 
      670,   // ui middle point
      800,   // screen width
      140,   // height of ui block
      0x2a1b3d // purple
    );
    
    // GAME ARRAYS
    this.player_projectiles = [];
    this.enemy_projectiles = [];
    this.enemies = [];

    // BULLET LOGIC
    this.last_shot_time = 0;
    this.cooldown = 1500;
    
    // PLAYER SETUP 
    my.sprite.player = this.add.sprite(50, 550, "player");
    my.sprite.player.setScale(0.15);
    // CONTROLS
    this.akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // ENEMY TYPE 1 (SHOOTER) PATH
    this.points1 = [ // Triangle pattern
            20, 50,
            780, 50,
            400, 200,
            20, 50,
          ];
    this.curve = new Phaser.Curves.Spline(this.points1);
    this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0));
    this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0.3));
    this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0.5));
    
    // ENEMY TYPE 2 (CHARGER) PATH
    this.points2 = [
            400, 100, //start
            700, 530, // CHARGE right side
            500, 330, // back up a little
            500, 530, // charge down
            500, 330, // back up
            300, 530, // chrage left
            400, 100, // BACK UP ALL THE WAY
            100, 530, // CHARGE left side
            300, 330, // back up a little
            300, 530, // charge down
            300, 330, // back up
            500, 530, // charge right
            400, 100, // back to start
          ];
    this.curve2 = new Phaser.Curves.Spline(this.points2);
    this.enemies.push(new ChargeEnemy(this, this.curve2, "enemy_charger", (config.width /2), 100, 0));
  }

  update(time, delta) {
    // runs every frame (~60 fps)
    //this.hero.x += 1;
    let my = this.my;

    // PLAYER CONTROLS
    if (this.akey.isDown){
        //my.sprite.mouth.x += 20;
        my.sprite.player.x -= 160 * (delta/1000)
        if (my.sprite.player.x <= 20) my.sprite.player.x = 20; // was 0
    }
    if (this.dkey.isDown){
        my.sprite.player.x += 160 * (delta/1000)
        if (my.sprite.player.x >= 780) my.sprite.player.x = 780; // was 800
    }

    if (this.spaceKey.isDown && (time > this.last_shot_time + this.cooldown)){
        let bullet = this.add.sprite(
            my.sprite.player.x,
            my.sprite.player.y - 50,
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
    
    for (let enemy of this.enemies){
      if (enemy instanceof RangedEnemy){
        if(time > enemy.lastShot + enemy.fireRate){
          enemy.shoot(this);
          enemy.lastShot = time;
        }
      }
    }

    for (let i = 0; i < this.enemy_projectiles.length; i++){
      let bullet = this.enemy_projectiles[i];

      bullet.y += 120 * (delta/1000);
      
      if (bullet.y > 600){
        bullet.destroy();
        this.enemy_projectiles.splice(i,1);
        i--;
      }
    }


  }
}
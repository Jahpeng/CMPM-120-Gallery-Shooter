class GameScene extends Phaser.Scene {

  constructor() {
    super("GameScene"); // scene key
    // init plain properties here
    this.my = {sprite: {}};
    this.lives = 3;
    this.score = 0;
    this.wave = 1;
  }
  init() {
    this.my = { sprite: {} };
    this.lives = 3;
    this.score = 0;
    this.wave = 1;
    this.player_alive = true;

    this.player_projectiles = [];
    this.enemy_projectiles = [];
    this.enemies = [];

    this.last_shot_time = 0;
    this.last_hit_time = 0;
  }

  preload() {
    // load assets BEFORE create
    //this.load.image("hero", "hero.png");
    this.load.setPath("./assets/");
    
    // PLAYER STUFF
    this.load.image("player", "spaceRockets_003.png");
    this.load.image("player_missile", "spaceMissiles_010.png");

    this.load.audio("player_fire", "laser1.ogg");
    this.load.audio("player_death", "explosionCrunch_002.ogg");
    this.load.audio("player_hit", "lowDown.ogg");

    this.load.image("explosion00", "explosion00.png");
    this.load.image("explosion01", "explosion01.png");
    this.load.image("explosion02", "explosion02.png");
    this.load.image("explosion03", "explosion03.png");
    
    // ENEMY TYPE 1 (SHOOTER) STUFF
    this.load.image("enemy_shooter", "spaceShips_004.png");
    this.load.image("enemy_missile", "spaceMissiles_005.png");

    // ENEMY TYPE 2 (CHARGER) STUFF
    this.load.image("enemy_charger", "spaceShips_003.png");
    this.load.image("enemy_shield", "spaceParts_088.png")

    this.load.audio("enemy_dead", "spaceTrash1.ogg");

    this.load.image("fart00", "fart00.png");
    this.load.image("fart01", "fart01.png");
    this.load.image("fart02", "fart02.png");
    this.load.image("fart03", "fart03.png");

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

    // GAME AUDIO
    this.player_shoot = this.sound.add("player_fire", {loop: false, volume: 0.5});
    this.enemy_dead = this.sound.add("enemy_dead", {loop: false, volume: 0.5});
    this.player_dead = this.sound.add("player_death", {loop: false, volume: 0.5});
    this.player_hit = this.sound.add("player_hit", {loop: false, volume: 1});

    // BULLET LOGIC
    this.last_shot_time = 0;
    this.cooldown = 1500;

    // PLAYER HIT LOGIC
    this.last_hit_time = 0;
    this.hit_cooldown = 1000;
    this.player_alive = true;
    
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
    // this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0));
    // this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0.3));
    // this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0.5));
    
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
    // this.enemies.push(new ChargeEnemy(this, this.curve2, "enemy_charger", (config.width /2), 100, 0));

    //STARTING WAVE
    this.startWave();

    // GAME UI
    this.lives_icon = this.add.sprite(160, 650, "player");
    this.lives_icon.setScale(0.08);

    this.lives_text = this.add.text(180, 650, "x3", {fontSize: "28px", fill: "#ffa500"});
    this.updateLivesUI();

    this.score_text = this.add.text (300, 650, "SCORE: 0", {fontSize: "28px", fill: "#ffa500"});

    this.wave_text = this.add.text (500, 650, "WAVE 1", {fontSize: "28px", fill: "#ffa500"});

    if (!this.anims.exists("boom")) {
      this.anims.create({
        key: "boom",
        frames: [
          { key: "explosion00" },
          { key: "explosion01" },
          { key: "explosion02" },
          { key: "explosion03" },
        ],
        frameRate: 20,
        repeat: 5,
        hideOnComplete: true
      });
    }

    if (!this.anims.exists("fart")) {
      this.anims.create({
        key: "fart",
        frames: [
          { key: "fart00" },
          { key: "fart01" },
          { key: "fart02" },
          { key: "fart03" },
        ],
        frameRate: 20,
        repeat: 3,
        hideOnComplete: true
      });
    }
  }

  update(time, delta) {
    // runs every frame (~60 fps)
    //this.hero.x += 1;
    let my = this.my;

    // PLAYER CONTROLS
    if (this.akey.isDown && this.player_alive){
        //my.sprite.mouth.x += 20;
        my.sprite.player.x -= 160 * (delta/1000)
        if (my.sprite.player.x <= 20) my.sprite.player.x = 20; // was 0
    }
    if (this.dkey.isDown && this.player_alive){
        my.sprite.player.x += 160 * (delta/1000)
        if (my.sprite.player.x >= 780) my.sprite.player.x = 780; // was 800
    }

    if (this.spaceKey.isDown && (time > this.last_shot_time + this.cooldown) && this.player_alive){
        let bullet = this.add.sprite(
            my.sprite.player.x,
            my.sprite.player.y - 50,
            "player_missile"
        );
        bullet.setScale(0.5);
        //bullet.angle = -90;
        this.player_projectiles.push(bullet);
        this.last_shot_time = time;
        this.player_shoot.play();
    }

    for (let i = 0; i < this.player_projectiles.length; i++) {
        let bullet = this.player_projectiles[i];
        bullet.y -= 160 * (delta / 1000);
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

    // COLLISION DETECTION (PLAYER TO ENEMY)
    for (let i = 0; i < this.enemies.length; i++){
      let enemy = this.enemies[i];

      for (let j = 0; j < this.player_projectiles.length; j++){
        let bullet = this.player_projectiles[j];

        if(enemy.sprite_shield && this.collides(enemy.sprite_shield, bullet)){
          bullet.destroy();
          enemy.sprite_shield.destroy();

          enemy.sprite_shield = null;
          this.player_projectiles.splice(j, 1);
          j--;
          continue;
        }

        if(this.collides(enemy.sprite, bullet)){
          if (enemy instanceof ChargeEnemy && enemy.sprite_shield){
            enemy.sprite_shield.destroy();
            enemy.sprite_shield = null;
          }
          if (enemy instanceof ChargeEnemy){
            this.score += 50;
            this.updateScoreUI();
          }
          else{
            this.score += 25;
            this.updateScoreUI();
          }
          this.fart = this.add.sprite(enemy.sprite.x, enemy.sprite.y, "fart00").setScale(0.25).play("fart");
          enemy.sprite.destroy();
          bullet.destroy();

          this.enemies.splice(i, 1);
          this.player_projectiles.splice(j, 1);

          i--;
          j--;
          this.enemy_dead.play();
          break;
        }
      }
    }

    // COLLISION DETECTION (ENEMY TO PLAYER)
    //
    // CHARGER
    for (let i = 0; i < this.enemies.length; i++){
      let enemy = this.enemies[i];

      if (enemy instanceof ChargeEnemy){
        if(this.collides(enemy.sprite, my.sprite.player)){
          // if(time > this.last_hit_time + this.hit_cooldown){
          //   console.log("CHARGER HIT!");
          //   this.last_hit_time = time;

          //   this.lives--;
          //   this.updateLivesUI();
          // }
          //console.log("CHARGER HIT!");
          this.playerHit(time);
        }
      }
    }

    // SHOOTER
    for (let i = 0; i < this.enemy_projectiles.length; i++){
      let enemy_bullet = this.enemy_projectiles[i];

      if (this.collides(enemy_bullet, my.sprite.player)){
        //console.log("SHOOTER HIT!");
        enemy_bullet.destroy();
        this.enemy_projectiles.splice(i, 1);
        i--;

        // this.lives--;
        // this.updateLivesUI();
        this.playerHit(time);
      }

    }
    
    // CHECK PLAYER HEALTH
    if (this.lives <= 0 && this.player_alive){
      this.player_dead.play();
      this.player_alive = false;
      this.my.sprite.player.setVisible(false);
      this.boom = this.add.sprite(this.my.sprite.player.x, this.my.sprite.player.y, "explosion00").setScale(0.25).play("boom");
      this.boom.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.scene.start("loseScene", { score: this.score })
      }); // may need to change on to once if this causes major issues

    }

    // CHECK THE WAVE STATUS
    if (this.enemies.length === 0){
      //clear all prjectiles before moving to next screen
      for (let bullet of this.player_projectiles){
        bullet.destroy();
      }
      this.player_projectiles = [];

      for (let bullet2 of this.enemy_projectiles){
        bullet2.destroy();
      }
      this.enemy_projectiles = [];

      if (this.wave < 10){
        this.wave++;
      }
      this.updateWaveUI();
      this.startWave();
    }


  }

  // A center-radius AABB collision check
  collides(a, b) {
    if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
    if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
    return true;

    }

  updateLivesUI(){
    this.lives_text.setText("x" + this.lives);
  }

  updateScoreUI(){
    this.score_text.setText("SCORE: " + this.score);
  }

  updateWaveUI(){
    this.wave_text.setText("WAVE " + this.wave);
  }

  startWave(){
    if (this.wave === 1){ // two shooters
      this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0));
      this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0.5));
      // this.enemies.push(new ChargeEnemy(this, this.curve2, "enemy_charger", (config.width /2), 100, 0)); //TESTING
    }
    else if (this.wave === 2){ // two shooters, one charger
      this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0));
      this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0.5));
      this.enemies.push(new ChargeEnemy(this, this.curve2, "enemy_charger", (config.width /2), 100, 0));
    }
    else if (this.wave === 3) { // three shooter, two chargers
      this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0));
      this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0.3));
      this.enemies.push(new RangedEnemy(this, this.curve, "enemy_shooter", 20, 50, 0.5));
      this.enemies.push(new ChargeEnemy(this, this.curve2, "enemy_charger", (config.width /2), 100, 0));
      this.enemies.push(new ChargeEnemy(this, this.curve2, "enemy_charger", (config.width /2), 100, 0.5));
    }
    else {
      // end scene or boss scene
    }
  }

  playerHit(time){
    if (time <= this.last_hit_time + this.hit_cooldown){
      return;
    }
    this.player_hit.play();
    this.last_hit_time = time;
    this.lives--;
    this.updateLivesUI();
    this.startFlash();
  }

  startFlash(){
    let player = this.my.sprite.player;

    if(this.flashTween) {
      this.flashTween.stop();
      player.setAlpha(1);
    }

    this.flashTween = this.tweens.add({
      targets: player,
      alpha: 0.2,
      duration: 100,
      yoyo: true,
      repeat: 9,
      onComplete: () => {
        player.setAlpha(1);
      }
    });
  }

}
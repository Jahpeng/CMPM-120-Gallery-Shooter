class GameScene extends Phaser.Scene {

  constructor() {
    super("GameScene"); // scene key
    // init plain properties here
  }

  preload() {
    // load assets BEFORE create
    //this.load.image("hero", "hero.png");
  }

  create() {
    // build the world ONCE
    //this.hero = this.add.sprite(400, 300, "hero");
  }

  update(time, delta) {
    // runs every frame (~60 fps)
    //this.hero.x += 1;
  }
}
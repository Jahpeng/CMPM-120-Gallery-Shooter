const config = {
  type: Phaser.AUTO,      // WebGL if possible
  render: {
    pixelArt: true  // prevent pixel art from getting blurred when scaled
  },
  width: 800,
  height: 600,
  backgroundColor: "#1a1a2e",
  scene: [GameScene],// first scene in the list starts
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
const config = {
  type: Phaser.AUTO,      // WebGL if possible
  width: 800,
  height: 600,
  backgroundColor: "#1a1a2e",
  scene: [GameScene]
  // first scene in the list starts
};

const game = new Phaser.Game(config);
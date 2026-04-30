const config = {
  type: Phaser.AUTO,      // WebGL if possible
  render: {
    pixelArt: true  // prevent pixel art from getting blurred when scaled
  },
  width: 800,
  height: 740, // 600 + 140
  backgroundColor: "#1a1a2e",
  scene: [LoseScene,GameScene,]// first scene in the list starts
};

const game = new Phaser.Game(config);
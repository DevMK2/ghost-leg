export class FirstScene extends Phaser.Scene {

  constructor ()
  {
      super('FirstScene');
  }

  preload() {
  }

  create() {
    const clickButton = this.add.text(100, 100, 'Normal Game', { fill: '#F00' })
    .setFontSize(30)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('MainScene');
    });
  }

  update() {
  }

  render() {
  }
}

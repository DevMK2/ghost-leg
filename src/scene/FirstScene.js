export class FirstScene extends Phaser.Scene {

  constructor ()
  {
      super('FirstScene');
  }

  preload() {
  }

  create() {
    this.add.text(100, 200, '일반', { fill: '#F00' })
      .setFontSize(30)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('MainScene');
      });

    this.add.text(100, 400, '전문가', { fill: '#F00' })
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

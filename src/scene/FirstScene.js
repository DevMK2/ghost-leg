export class FirstScene extends Phaser.Scene {

  constructor ()
  {
    super('FirstScene');
  }

  preload() {
    this.load.image('space', 'src/assets/space3.png');
    this.load.image('logo', 'src/assets/phaser2.png')
  }

  create() {
    this.add.image(400, 500, 'space');
    this.add.image(310, 220,'logo');

    this.add.text(240, 450, 'Normal', { fill: '#ffffff' })
      .setFontSize(40)
      .setInteractive()
      .on('pointerover', () => {
        console.log('normal over');
      })
      .on('pointerout', () => {
        console.log('normal out');
      })
      .on('pointerdown', () => {
        this.scene.start('MainScene');
      });

    this.add.text(240, 550, 'Expert', { fill: '#ffffff' })
      .setFontSize(40)
      .setInteractive()
      .on('pointerover', () => {
        console.log('expert over');
      })
      .on('pointerout', () => {
        console.log('expert out');
      })
      .on('pointerdown', () => {
        this.scene.start('MainScene');
      });
  }

  update() {
  }

  render() {
  }
}

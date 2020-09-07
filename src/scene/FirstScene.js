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
      .on('pointerdown', () => this.scene.start('MainScene'))
      .on('pointerover', function() {
        this.setScale(1.1);
      })
      .on('pointerout', function() {
        this.setScale(0.9);
      });

    this.add.text(240, 550, 'Expert', { fill: '#ffffff' })
      .setFontSize(40)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('MainScene'))
      .on('pointerover', function() {
        this.setScale(1.1);
      })
      .on('pointerout', function() {
        this.setScale(0.9);
      });
  }

  update() {
  }

  render() {
  }
}

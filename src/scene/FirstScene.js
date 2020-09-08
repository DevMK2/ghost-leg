import { background, logo } from '../assets';

export class FirstScene extends Phaser.Scene {

  constructor ()
  {
    super('FirstScene');
  }

  preload() {
    this.load.image('background', background);
    this.load.image('logo', logo);
  }

  create() {   
    let background = this.add.image(300, 400, 'background');
    this.add.tween({
      targets: background,
      x: -100,
      ease: 'Sine.easeInOut',
      duration: 5000,
      repeat: -1,
      yoyo: true,
      delay: 100
    });
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

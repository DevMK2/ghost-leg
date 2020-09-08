import { background, logo, buttonNormal, buttonExpert } from '../assets';

export class FirstScene extends Phaser.Scene {

  constructor ()
  {
    super('FirstScene');
  }

  preload() {
    this.load.image('background', background);
    this.load.image('logo', logo);
    this.load.spritesheet('buttonNormal', buttonNormal, { frameWidth: 150, frameHeight: 50 });
    this.load.spritesheet('buttonExpert', buttonExpert, { frameWidth: 150, frameHeight: 50 });
  }

  create() {   
    let background = this.add.image(300, 400, 'background');
    this.add.tween({
      targets: background,
      x: -100,
      ease: 'Sine.easeInOut',
      duration: 10000,
      repeat: -1,
      yoyo: true
    });
    let logo = this.add.image(310, -300,'logo');
    this.tweens.add({
      targets: logo,
      y: 250,
      duration: 1000,
      ease: "Power2",
      yoyo: false,
      loop: 0
    });

    this.add.sprite(325, 450, 'buttonNormal')
      .setInteractive()
      .on('pointerdown', () => this.scene.start('MainScene'))
      .on('pointerover', function() {
        this.setFrame(1);
      })
      .on('pointerout', function() {
        this.setFrame(0);
      });
    this.add.sprite(325, 550, 'buttonExpert')
      .setInteractive()
      .on('pointerdown', () => this.scene.start('MainScene'))
      .on('pointerover', function() {
        this.setFrame(1);
      })
      .on('pointerout', function() {
        this.setFrame(0);
      });
  }

  update() {
  }

  render() {
  }
}

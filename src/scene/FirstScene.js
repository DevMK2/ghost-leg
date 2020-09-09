import { background, logo, buttonNormal, buttonExpert } from '../assets';
import { NORMAL_MODE, EXPERT_MODE, ASSETS_KEY as assetKey } from '../constants';

export class FirstScene extends Phaser.Scene {

    constructor ()
    {
        super('FirstScene');
    }

    preload() {
        this.load.image(assetKey.background, background);
        this.load.image(assetKey.logo, logo);
        this.load.spritesheet(assetKey.buttonNormal, buttonNormal, { frameWidth: 218, frameHeight: 105 });
        this.load.spritesheet(assetKey.buttonExpert, buttonExpert, { frameWidth: 218, frameHeight: 105 });
    }

    create() {   
        let background = this.add.image(300, 400, assetKey.background);
        this.add.tween({
            targets: background,
            x: -100,
            ease: 'Sine.easeInOut',
            duration: 10000,
            repeat: -1,
            yoyo: true
        });
        let logo = this.add.image(310, -300, assetKey.logo);
        this.tweens.add({
            targets: logo,
            y: 250,
            duration: 1000,
            ease: 'Power2',
            yoyo: false,
            loop: 0
        });

        this.add.sprite(325, 500, assetKey.buttonNormal)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainScene', NORMAL_MODE))
            .on('pointerover', function() {
                this.setFrame(1);
            })
            .on('pointerout', function() {
                this.setFrame(0);
            });
        this.add.sprite(325, 650, assetKey.buttonExpert)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainScene', EXPERT_MODE))
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

import { background, logo, buttonNormal, buttonExpert, stone, soundOnOff, soundFile, clickSound } from '../assets';
import { NORMAL_MODE, EXPERT_MODE, ASSETS_KEY as assetKey } from '../constants';
//import soundFile from '../assets/main.mp3';
export class FirstScene extends Phaser.Scene {

    constructor ()
    {
        super('FirstScene');
        this.meteor = [];
    }

    preload() {
        this.load.image(assetKey.background, background);
        this.load.spritesheet(assetKey.stone, stone, { frameWidth: 150, frameHeight: 150 });
        this.load.image(assetKey.logo, logo);
        this.load.spritesheet(assetKey.buttonNormal, buttonNormal, { frameWidth: 218, frameHeight: 105 });
        this.load.spritesheet(assetKey.buttonExpert, buttonExpert, { frameWidth: 218, frameHeight: 105 });
        this.load.audio(assetKey.bgm, soundFile);
        this.load.spritesheet(assetKey.soundOnOff, soundOnOff, { frameWidth: 63, frameHeight: 53 });
        this.load.audio(assetKey.clickSound, clickSound);
    }

    create() {   
        this.music = this.sound.add(assetKey.bgm);
        this.music.play({loop: true});

        this.click = this.sound.add(assetKey.clickSound);

        let background = this.add.image(300, 400, assetKey.background);
        for (let i = 0; i < 3; i++) {
            this.createMeteor();
        }
       
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
            .on('pointerdown', () => {
                this.click.play();
                this.scene.start('MainScene', {mode:NORMAL_MODE, sound:this.music, click:this.click});
            })
            .on('pointerover', function() {
                this.setFrame(1);
            })
            .on('pointerout', function() {
                this.setFrame(0);
            });
        this.add.sprite(325, 650, assetKey.buttonExpert)
            .setInteractive()
            .on('pointerdown', () => {
                this.click.play();
                this.scene.start('MainScene', {mode:EXPERT_MODE, sound:this.music, click:this.click});
            })
            .on('pointerover', function() {
                this.setFrame(1);
            })
            .on('pointerout', function() {
                this.setFrame(0);
            });

        this.createSoundOnOff();
    }

    update() {
        this.soundOnOff.setFrame(this.music.mute ? 1 : 0);
    }

    render() {
    }

    createMeteor(index) {
        const isLeft = Phaser.Math.Between(0, 1) == 0;
        const posY = Phaser.Math.Between(0, 800);
        let stone = this.add.sprite(isLeft ? -100 : 700, posY, assetKey.stone);
        stone.angle = Phaser.Math.Between(-180, 180);
        stone.setFrame(Phaser.Math.Between(0, 4));
        this.tweens.add({
            targets: stone,
            x: isLeft ? 700 : -100,
            y: posY + Phaser.Math.Between(-300, 300),
            angle: Phaser.Math.Between(-180, 180),
            ease: 'Power1',
            duration: Phaser.Math.Between(50000, 100000),
            repeat: 0,
            yoyo: false,
            delay: Phaser.Math.Between(0, 1000),
            onComplete: () => {stone.destroy(); this.createMeteor();}
        });
    }

    createSoundOnOff() {
        this.soundOnOff = this.add.sprite(550, 50, assetKey.soundOnOff)
            .setInteractive()
            .on('pointerdown', () => {
                this.music.mute = !this.music.mute;
            });
    }
}

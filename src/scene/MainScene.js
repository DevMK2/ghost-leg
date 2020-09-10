import { background, rocket, blind, buttonStart, flame, destination1, destination2, destination3, starting, plus, minus, input, help } from '../assets';
import { 
    NORMAL_MODE, EXPERT_MODE,
    ROW, COL,
    LADDER_HEIGHT, LADDER_WIDTH,
    LADDER_MARGIN, LADDER_HGAP, LADDER_WGAP,
    ASSETS_KEY as assetKey
} from '../constants';

export class MainScene extends Phaser.Scene {
    constructor ()
    {
        super('MainScene');

        this.layers = [];

        this.lines = [];

        this.bet = 10;
        this.betMin = 10;
        this.betMax = 100;

        this.selected = 0;
        this.start = false;

        this.isExpert = false;
    }

    init(data) {
        switch(data.mode) {
            case NORMAL_MODE:
                console.log('normal');
                break;
            case EXPERT_MODE:
                console.log('expert');
                this.isExpert = true;
                break;
        }

        this.music = data.sound;
    }

    preload() {
        this.load.image(assetKey.background, background);
        this.load.spritesheet(assetKey.rocket, rocket, { frameWidth: 50, frameHeight: 83 });
        this.load.image(assetKey.blind, blind);
        this.load.image(assetKey.destination[0], destination1);
        this.load.image(assetKey.destination[1], destination2);
        this.load.image(assetKey.destination[2], destination3);
        this.load.image(assetKey.starting, starting);
        this.load.image(assetKey.input[0], input);
        this.load.image(assetKey.input[1], plus);
        this.load.image(assetKey.input[2], minus);
        this.load.spritesheet(assetKey.buttonStart, buttonStart, { frameWidth: 218, frameHeight: 105 });
        this.load.spritesheet(assetKey.flame, flame, { frameWidth: 40, frameHeight: 66 });
        this.load.image(assetKey.help[0], help);
        this.load.image(assetKey.help[1], help);
        this.load.image(assetKey.help[2], help);
    }

    create() {
        let background = this.add.image(300, 400, assetKey.background);

        this.graphics = this.add.graphics({ lineStyle: { color: 0xffffff } });

        this.createBlind();
        this.createStartPoints();
        this.createDestinationPoints();
        if (this.isExpert)
            this.createInputBox();
        this.createSoundOnOff();
    }

    update(time, delta) {
        this.soundOnOff.setFrame(this.music.mute ? 1 : 0);
        
        if (this.start && this.rocket.z < 1) {
            const t = this.rocket.z;
            const vec = this.rocket.getData('vector');
            this.path.getPoint(t, vec);
            this.rocket.setPosition(vec.x, vec.y);
            this.flame.setPosition(vec.x, vec.y + 66);
        } else if (this.rocket && this.rocket.z == 1) {
            console.log('광고 보기');
            //this.scene.start('PrizeScene');
        }
    }

    render() {
    }

    createPathes() {
        this.layers = [];
        for(let x = 0; x < COL - 1; x++) {
            for(let y = 0; y < ROW; y++) {        
                const toX = x + 1;
                const toY = y + Phaser.Math.Between(y == 0 ? 0 : -1, y == ROW - 1 ? 0 : 1);

                if (this.layers.find(e => e.from.x == x && e.from.y == y)) continue;
                if (this.layers.find(e => e.to.x == x && e.to.y == y)) continue;
                if (this.layers.find(e => e.from.x == toX && e.from.y == toY)) continue;
                if (this.layers.find(e => e.to.x == toX && e.to.y == toY)) continue;

                this.layers.push({from:{x:x, y:y}, to:{x:toX, y:toY}});

                const from = { 
                    x: LADDER_WGAP * (x + 1), 
                    y: LADDER_MARGIN + LADDER_HGAP * (y + 1)
                };
                const to = { 
                    x: LADDER_WGAP * (toX + 1),
                    y: LADDER_MARGIN + LADDER_HGAP * (toY + 1)
                };
    
                this.lines.push(new Phaser.Geom.Line(from.x, from.y, to.x, to.y));
            }
        }

        for(let i = 0; i < COL; i++) {
            const from = { 
                x: LADDER_WGAP * (i + 1), 
                y: LADDER_MARGIN 
            };
            const to = { 
                x: LADDER_WGAP * (i + 1),
                y: LADDER_MARGIN + LADDER_HEIGHT
            };
            this.lines.push(new Phaser.Geom.Line(from.x, from.y, to.x, to.y));
        }

        this.graphics.lineGradientStyle(15, 0x00fffff, 0xffffff, 0xffffff, 0x00ffff, 1);
        this.lines.forEach(line=>this.graphics.strokeLineShape(line));
    }

    createBlind() {
        //this.blind = this.add.image(300, 450, assetKey.blind);
        this.startButton = this.add.image(300, 450, assetKey.buttonStart)
            .setInteractive()
            .on('pointerdown', () => this.launchRocket())
            .on('pointerover', function() {
                this.setFrame(1);
            })
            .on('pointerout', function() {
                this.setFrame(0);
            });
    }

    removeBlind() {
        //this.blind.destroy();
        this.startButton.destroy();
    }

    createStartPoints() {
        this.help = [];
        
        for(let i=0; i<COL; ++i) {
            const pos = {
                x : LADDER_WGAP * (i + 1), 
                y : LADDER_MARGIN + LADDER_HEIGHT + 30
            };

            this.help[i] = this.add.image(pos.x, pos.y - 70, assetKey.help[i]).setVisible(false);

            this.add.image(pos.x, pos.y, assetKey.starting)
                .setInteractive()
                .on('pointerdown', () => this.setRocket(i, pos.x, pos.y));
        }
    }

    createDestinationPoints() {
        for(let i=0; i<COL; ++i) {
            const pos = {
                x : LADDER_WGAP * (i + 1), 
                y : LADDER_MARGIN - 30
            };

            this.add.image(pos.x, pos.y, assetKey.destination[i]);
        }
    }

    showHelp(show) {
        for (let i = 0; i < 3; i++)
            this.help[i].setVisible(show);
    }

    setRocket(index, x, y) {
        this.showHelp(false);

        if(this.start) {
            return;
        }

        if(this.rocket) {
            this.rocket.destroy();
        }

        this.selected = index + 1;
        this.rocket = this.add.sprite(x, y, assetKey.rocket);
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers(assetKey.rocket, { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.flame = this.add.sprite(x, y+66, assetKey.flame);
        this.flame.visible = false;
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers(assetKey.flame, { start: 0, end: 8 }),
            frameRate: 8,
            repeat: -1
        });
    }

    launchRocket() {
        if (this.selected == 0) {
            this.showHelp(true);
            return;
        }

        this.createPathes();
        this.removeBlind();

        this.path = this.getPath();
        this.rocket.setData('vector', new Phaser.Math.Vector2());
        this.rocket.play('move');
        this.flame.play('fire');
        this.flame.visible = true;

        this.tweens.add({
            targets: this.rocket,
            z: 1,
            ease: 'Linear',
            duration: 10000,
            repeat: 0,
            yoyo: false,
            delay: 100,
            onComplete: () => {
            }
        });

        this.start = true;
    }

    getPath() {
        let current = {x:this.selected - 1, y:ROW - 1};
        let path = new Phaser.Curves.Path(LADDER_WGAP * (current.x + 1), LADDER_MARGIN + LADDER_HEIGHT);
        
        while (current.y >= 0) {
            let to = this.layers.find(e => e.from.x == current.x && e.from.y == current.y && e.from.y >= e.to.y);
            let from = this.layers.find(e => e.to.x == current.x && e.to.y == current.y && e.from.y <= e.to.y);
            let next = to ? to.to : from ? from.from : null;

            path.lineTo(LADDER_WGAP * (current.x + 1), LADDER_MARGIN + ((current.y + 1) * LADDER_HGAP));

            if (next) {                
                path.lineTo(LADDER_WGAP * (next.x + 1), LADDER_MARGIN + ((next.y + 1) * LADDER_HGAP));
                current = next;
            }

            current.y -= 1;
        }

        path.lineTo(LADDER_WGAP * (current.x + 1), LADDER_MARGIN);

        return path;
    }

    createInputBox() {
        this.add.image(300, 50, assetKey.input[0]);
        this.add.image(450, 50, assetKey.input[1])
            .setInteractive()
            .on('pointerdown', () => {if (this.start) return; this.bet = Math.min(this.bet + 10, this.betMax); this.drawBetPoint();});
        this.add.image(150, 50, assetKey.input[2])
            .setInteractive()
            .on('pointerdown', () => {if (this.start) return; this.bet = Math.max(this.bet - 10, this.betMin); this.drawBetPoint();});
        this.betText = this.add.text(270, 30, this.bet, {fontSize: 50});
    }

    drawBetPoint() {
        this.betText.setText(this.bet);
    }

    createSoundOnOff() {
        this.soundOnOff = this.add.sprite(550, 50, assetKey.soundOnOff)
            .setInteractive()
            .on('pointerdown', () => {
                this.music.mute = !this.music.mute;
            });
    }
}

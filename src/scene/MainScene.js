import { background, rocket, blind, buttonStart, flame, destination1, destination2, destination3, starting, plus, minus, input } from '../assets';
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

    init(mode) {
        switch(mode) {
            case NORMAL_MODE:
                console.log('normal');
                break;
            case EXPERT_MODE:
                console.log('expert');
                this.isExpert = true;
                break;
        }
    }

    preload() {
        this.load.image(assetKey.background, background);
        this.load.image(assetKey.rocket, rocket);
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
    }

    create() {
        let background = this.add.image(300, 400, assetKey.background);

        this.graphics = this.add.graphics({ lineStyle: { color: 0xffffff } });

        //this.createPathes();
        this.createBlind();
        this.createStartPoints();
        this.createDestinationPoints();
        if (this.isExpert)
            this.createInputBox();
    }

    update(time, delta) {
        if(this.flame) {
            if(Math.abs(this.lasttime - time) > 50) {
                this.flame.setFrame(this.flameindex++ % 9);
                this.lasttime = time;
            }
        }

        if (this.start && this.rocket.z < 1) {
            const t = this.rocket.z;
            const vec = this.rocket.getData('vector');
            this.path.getPoint(t, vec);
            this.rocket.setPosition(vec.x, vec.y);
            this.flame.setPosition(vec.x, vec.y + 66);
        } else if (this.rocket && this.rocket.z == 1) {
            console.log('광고 보기');
            //this.flame.destroy();
            //this.scene.start('PrizeScene');
        }
    }

    render() {
    }

    createPathes() {
        for(let i = 0; i < ROW; i++) {
            const leg = Phaser.Math.Between(1, COL - 1);
            this.layers[i] = leg;

            const from = { 
                x: LADDER_WGAP * leg, 
                y: LADDER_MARGIN + LADDER_HGAP * (i + 1) 
            };
            const to = { 
                x: LADDER_WGAP * (leg + 1), 
                y: LADDER_MARGIN + LADDER_HGAP * (i + 1)
            };

            this.lines.push(new Phaser.Geom.Line(from.x, from.y, to.x, to.y));
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
        for(let i=0; i<COL; ++i) {
            const pos = {
                x : LADDER_WGAP * (i + 1), 
                y : LADDER_MARGIN + LADDER_HEIGHT + 30
            };

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

    setRocket(index, x, y) {
        if(this.start) {
            return;
        }

        if(this.rocket) {
            this.rocket.destroy();
        }

        this.selected = index + 1;
        this.rocket = this.add.image(x, y, assetKey.rocket);
    }

    launchRocket() {
        if (this.selected == 0)
            return;

        this.createPathes();
        this.removeBlind();

        this.path = this.getPath();
        this.rocket.setData('vector', new Phaser.Math.Vector2());

        this.tweens.add({
            targets: this.rocket,
            z: 1,
            ease: 'Linear',
            duration: 3000,
            repeat: 0,
            yoyo: false,
            delay: 100
        });

        this.flameindex = 0;
        this.lasttime = 0;
        this.flame = this.add.sprite(this.rocket.x, this.rocket.y+66, assetKey.flame).setFrame(0);

        this.start = true;
    }

    getPath() {
        let current = this.selected;
        let path = new Phaser.Curves.Path(LADDER_WGAP * current, LADDER_MARGIN + LADDER_HEIGHT);

        console.log(this.layers.length);
        this.layers.slice().reverse().forEach((layer, index)=>{
            let ypos = LADDER_MARGIN + LADDER_HEIGHT - ((index + 1) * LADDER_HGAP);

            if (current == layer) {
                path.lineTo(LADDER_WGAP * current, ypos);
                path.lineTo(LADDER_WGAP * (current + 1), ypos);
                current++;
            } else if (current -1 == layer) {
                path.lineTo(LADDER_WGAP * current, ypos);
                path.lineTo(LADDER_WGAP * (current - 1), ypos);
                current--;
            }
        });

        path.lineTo(LADDER_WGAP * current, LADDER_MARGIN);

        return path;
    }

    createInputBox() {
        this.add.image(300, 50, assetKey.input[0]);
        this.add.image(450, 50, assetKey.input[1])
            .setInteractive()
            .on('pointerdown', () => {this.bet = Math.min(this.bet + 10, this.betMax); this.drawBetPoint();});
        this.add.image(150, 50, assetKey.input[2])
            .setInteractive()
            .on('pointerdown', () => {this.bet = Math.max(this.bet - 10, this.betMin); this.drawBetPoint();});
        this.betText = this.add.text(270, 30, this.bet, {fontSize: 50});
    }

    drawBetPoint() {
        this.betText.setText(this.bet);
    }
}

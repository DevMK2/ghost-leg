import { background, rocket, blind, buttonStart, flame } from '../assets';
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

        this.selected = 0;
        this.start = false;
    }

    init(mode) {
        switch(mode) {
            case NORMAL_MODE:
                console.log('normal');
                break;
            case EXPERT_MODE:
                console.log('expert');
                break;
        }
    }

    preload() {
        this.load.image(assetKey.background, background);
        this.load.image(assetKey.rocket, rocket);
        this.load.image(assetKey.blind, blind);
        this.load.image(assetKey.buttonStart, buttonStart);
        this.load.spritesheet(assetKey.flame, flame, { frameWidth: 14, frameHeight: 71, spacing: 14 }); 
    }

    create() {
        this.add.image(400, 500, assetKey.background);

        this.graphics = this.add.graphics({ lineStyle: { color: 0xffffff } });

        this.createPathes();
        this.createBlind();
        this.createStartPoints();
    }

    update(time, delta) {
        if(this.flame) {
            if(Math.abs(this.lasttime - time) > 16) {
                this.flame.setFrame(this.flameindex++ % 3);
                this.lasttime = time;
            }
        }

        if (this.start && this.rocket.z < 1) {
            const t = this.rocket.z;
            const vec = this.rocket.getData('vector');
            this.path.getPoint(t, vec);
            this.rocket.setPosition(vec.x, vec.y);
            this.flame.setPosition(vec.x, vec.y + 70);
        } else if (this.rocket && this.rocket.z == 1) {
            console.log('광고 보기');
            this.flame.destroy();
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

        this.lines.forEach(line=>this.graphics.strokeLineShape(line));
    }

    createBlind() {
        this.blind = this.add.image(300, 400, assetKey.blind);
        this.startButton = this.add.image(300, 400, assetKey.buttonStart)
            .setInteractive()
            .on('pointerdown', () => this.launchRocket())
            .on('pointerover', function() {
                this.setScale(1.1);
            })
            .on('pointerout', function() {
                this.setScale(0.9);
            });
    }

    removeBlind() {
        this.blind.destroy();
        this.startButton.destroy();
    }

    createStartPoints() {
        for(let i=0; i<COL; ++i) {
            const pos = {
                x : LADDER_WGAP * (i + 1) - 30, 
                y : LADDER_MARGIN + LADDER_HEIGHT + 30
            };

            this.add.text(pos.x, pos.y, `Start${i+1}`)
                .setInteractive()
                .on('pointerdown', () => this.setRocket(i, pos.x, pos.y))
                .on('pointerover', function() {
                    this.setScale(1.1);
                })
                .on('pointerout', function() {
                    this.setScale(0.9);
                });
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
        this.rocket = this.add.image(x+30, y+20, assetKey.rocket);
    }

    launchRocket() {
        if (this.selected == 0)
            return;

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
        this.flame = this.add.sprite(this.rocket.x, this.rocket.y+71, assetKey.flame).setFrame(0);

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
}

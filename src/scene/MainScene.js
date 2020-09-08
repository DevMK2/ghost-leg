import { background, rocket, blind, buttonStart } from '../assets';
import { 
    NORMAL_MODE, EXPERT_MODE,
    ROW, COL,
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
    }

    create() {
        this.add.image(400, 500, assetKey.background);

        this.graphics = this.add.graphics({ lineStyle: { color: 0xffffff } });

        this.createPathes();
        this.createBlind();
        this.createStartPoints();
    }

    update(time, delta) {
        if (this.start && this.rocket.z < 1) {
            const t = this.rocket.z;
            const vec = this.rocket.getData('vector');
            this.path.getPoint(t, vec);
            this.rocket.setPosition(vec.x, vec.y);
        } else if (this.rocket && this.rocket.z == 1) {
            console.log('광고 보기');
            //this.scene.start('PrizeScene');
        }
    }

    render() {
    }

    createPathes() {
        let hgap = 500 / ROW + 1;

        for (let i = 0; i < ROW; i++) {
            let leg = Phaser.Math.Between(1, COL - 1);
            this.layers[i] = leg;

            let path = new Phaser.Geom.Line((leg * 100), 100 + hgap * (i + 1), (leg * 100) + 100, 100 + hgap * (i + 1));
            this.lines.push(path);
        }

        let path1 = new Phaser.Geom.Line(100, 100, 100, 700);
        let path2 = new Phaser.Geom.Line(200, 100, 200, 700);
        let path3 = new Phaser.Geom.Line(300, 100, 300, 700);
        let path4 = new Phaser.Geom.Line(400, 100, 400, 700);
        let path5 = new Phaser.Geom.Line(500, 100, 500, 700);
        this.lines.push(path1, path2, path3, path4, path5);

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
        for(let i=0; i<5; ++i) {
            const pos = { x : 100 * i + 70, y : 730 };

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

    getPath() {
        let current = this.selected;
        let path = new Phaser.Curves.Path(100 * current, 700);
        let hgap = 500 / ROW + 1;

        this.layers.slice().reverse().forEach((layer, index)=>{
            let ypos = 700 - ((index + 2) * hgap);
            if (current == layer) {
                path.lineTo(100 * current, ypos);
                path.lineTo(100 * current + 100, ypos);
                current++;
            } else if (current -1 == layer) {
                path.lineTo(100 * current, ypos);
                path.lineTo(100 * current + -100, ypos);
                current--;
            }
        });

        path.lineTo(100 * current, 100);

        return path;
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

        this.start = true;
    }
}

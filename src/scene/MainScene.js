import { background, rocket, blind, buttonStart, flame, destination1, destination2, destination3, starting, plus, minus, input, help, rocketSound, chance, myPoint } from '../assets';
import { 
    NORMAL_MODE, EXPERT_MODE,
    ROW, COL,
    LADDER_HEIGHT, LADDER_WIDTH,
    LADDER_MARGIN, LADDER_HGAP, LADDER_WGAP,
    ASSETS_KEY as assetKey
} from '../constants';

if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

export class MainScene extends Phaser.Scene {
    constructor ()
    {
        super('MainScene');

        this.layers = [];

        this.lines = [];

        this.selected = 0;
        this.start = false;
        this.drawIndex = 0;

        this.isExpert = false;
    }

    init(data) {
        switch(data.mode) {
            case NORMAL_MODE:
                break;
            case EXPERT_MODE:
                this.isExpert = true;
                break;
        }

        this.music = data.sound;
        this.click = data.click;

        this.points = gameConfig.points;
        this.betMin = gameConfig.minBet;
        this.betMax = gameConfig.maxBet;
        this.bet = gameConfig.defaultBet;
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
        this.load.image(assetKey.chance, chance);
        this.load.audio(assetKey.rocketSound, rocketSound);
        this.load.image(assetKey.myPoint, myPoint);
    }

    create() {
        this.rocketSound = this.sound.add(assetKey.rocketSound);

        this.add.image(300, 400, assetKey.background);

        this.graphics = this.add.graphics();

        this.createBlind();
        this.createStartPoints();
        
        if (this.isExpert)
            this.createInputBox();
        this.createSoundOnOff();
    }

    update(time, delta) {
        this.soundOnOff.setFrame(this.music.mute ? 1 : 0);

        if (this.betPlusButton) {
            if (!this.betPlusButton.run) {
                if (time - this.betPlusButton.down > 1000) {
                    this.betPlusButton.run = true;
                    this.drawBetPoint(1000);
                    this.betPlusButton.down = time;
                }
            } else {
                if (time - this.betPlusButton.down > 100) {
                    this.drawBetPoint(1000);
                    this.betPlusButton.down = time;
                }
            }
        }
        if (this.betMinusButton) {
            if (!this.betMinusButton.run) {
                if (time - this.betMinusButton.down > 1000) {
                    this.betMinusButton.run = true;
                    this.drawBetPoint(-1000);
                    this.betMinusButton.down = time;
                }
            } else {
                if (time - this.betMinusButton.down > 100) {
                    this.drawBetPoint(-1000);
                    this.betMinusButton.down = time;
                }
            }
        }
        
        if (this.start && this.rocket.z < 1) {
            const t = this.rocket.z;
            const vec = this.path.getPoint(t);
            //this.rocket.setPosition(vec.x, vec.y);
            //this.flame.setPosition(vec.x, vec.y + 66);

            
            if (t > 0) {
                //this.graphics.clear();
                this.graphics.lineStyle(15, 0xff5200);
                let x = this.path.getPoints(10);
                let p = x.slice(this.drawIndex, x.length * t);
                let vec = p[p.length - 1];
                if (vec) {
                    this.drawIndex = p.length;
                    this.graphics.strokePoints(p);
                    this.rocket.setPosition(vec.x, vec.y);
                    this.flame.setPosition(vec.x, vec.y + 66);
                }
            }
            //this.path.draw(this.graphics);
        } else if (this.rocket && this.rocket.z == 1) {
            this.goNext();
            //this.scene.start('PrizeScene');
        }
    }

    render() {
    }

    createPathes() {
        this.layers = [];
        let sum = [];

        for(let y = 0; y < ROW; y++) {        
            for(let x = 0; x < COL - 1; x++) {
                if (!sum[x]) sum[x] = 0;
                if (sum[x] > ROW / 2) continue;

                const toX = x + 1;
                const toY = y + Phaser.Math.Between(y == 0 ? 0 : -1, y == ROW - 1 ? 0 : 1);
                
                if (this.layers.find(e => e.from.x == x && e.from.y == y)) continue;
                if (this.layers.find(e => e.to.x == x && e.to.y == y)) continue;
                if (this.layers.find(e => e.from.x == toX && e.from.y == toY)) continue;
                if (this.layers.find(e => e.to.x == toX && e.to.y == toY)) continue;

                const from = { 
                    x: LADDER_WGAP * (x + 1), 
                    y: LADDER_MARGIN + LADDER_HGAP * (y + 1)
                };
                const to = { 
                    x: LADDER_WGAP * (toX + 1),
                    y: LADDER_MARGIN + LADDER_HGAP * (toY + 1)
                };
    
                const line = new Phaser.Geom.Line(from.x, from.y, to.x, to.y);
                this.lines.push(line);
                this.layers.push({from:{x:x, y:y}, to:{x:toX, y:toY}, line: line, isChance: false});

                sum[x]++;
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

        //let pick = this.layers[Math.floor(Math.random() * this.layers.length)];
        //pick.isChance = true;

        //const c = Phaser.Geom.Line.GetMidPoint(pick.line);
        //this.add.image(c.x, c.y, assetKey.chance);
    }

    createBlind() {
        this.startButton = this.add.image(300, 350, assetKey.buttonStart)
            .setInteractive()
            .on('pointerdown', () => {this.click.play(); this.launchRocket();})
            .on('pointerover', function() {
                this.setFrame(1);
            })
            .on('pointerout', function() {
                this.setFrame(0);
            });
        
        if (this.isExpert) {
            this.myPoint = this.add.image(300, 550, assetKey.myPoint);
            this.myPointFrame = this.add.text(300, 570, this.points, {fontSize: 30});
        }
    }

    removeBlind() {
        this.startButton.destroy();
        if (this.isExpert) {
            this.myPoint.destroy();
            this.myPointFrame.destroy();
        }
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
                .on('pointerdown', () => {if (this.start) return; this.click.play(); this.setRocket(i, pos.x, pos.y);});
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

        if(this.rocket) {
            this.rocket.destroy();
        }

        this.selected = index + 1;
        this.rocket = this.add.sprite(x, y, assetKey.rocket);
        this.rocket.setDepth(1);
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers(assetKey.rocket, { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.flame = this.add.sprite(x, y+66, assetKey.flame);
        this.flame.visible = false;
        this.flame.setDepth(1);
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
        this.createDestinationPoints();
        this.removeBlind();

        this.path = this.getPath();
        //this.graphics.lineStyle(15, 0xff5200);
        //this.path.draw(this.graphics);
        this.rocket.play('move');
        this.flame.play('fire');
        this.flame.visible = true;

        this.rocketSound.play({loop: true});

        this.tweens.add({
            targets: this.rocket,
            z: 1,
            ease: 'Linear',
            duration: 10000,
            repeat: 0,
            yoyo: false,
            delay: 100,
            onComplete: () => {
                this.rocketSound.stop();
            }
        });

        this.start = true;
    }

    getPath() {
        let current = {x:this.selected - 1, y:ROW - 1};
        let path = new Phaser.Curves.Path(LADDER_WGAP * (current.x + 1), LADDER_MARGIN + LADDER_HEIGHT);

        while (current.y >= 0) {
            let to = this.layers.find(e => (e.from.x == current.x && e.from.y == current.y));
            let from = this.layers.find(e => (e.to.x == current.x && e.to.y == current.y));
            let next = to ? to.to : from ? from.from : null;

            if (next) {                
                path.lineTo(LADDER_WGAP * (current.x + 1), LADDER_MARGIN + ((current.y + 1) * LADDER_HGAP));
                path.lineTo(LADDER_WGAP * (next.x + 1), LADDER_MARGIN + ((next.y + 1) * LADDER_HGAP));
                current = {x: next.x, y: next.y};
            }

            current.y -= 1;
        }

        path.lineTo(LADDER_WGAP * (current.x + 1), LADDER_MARGIN);

        return path;
    }

    createInputBox() {
        /*
        this.add.image(300, 50, assetKey.input[0]);

        const style = {
            width: '140px',
            height: '50px',
            border: '0',
            background: 'transparent',
            color: 'white',
            'font-size': '50px',
            'text-align': 'right',
        };
        let input = document.createElement('input');
        input.style = 'width:140px; height:50px; border:0; background: transparent; color:white; font-size:50px; text-align:right; -webkit-appearance: none; -moz-appearance: none; appearance: none;';
        input.type = 'number';
        input.maxLength = 5;

        this.bet = Math.min(this.betMax, this.bet);
        this.bet = Math.min(this.points, this.bet);
        this.bet = Math.max(this.betMin, this.bet);

        input.value = this.bet;
        input.onkeyup = () => {
            this.checkBet();
        }

        this.input = input;
        this.inputBox = this.add.dom(320, 50, input);
        */

        this.add.image(300, 50, assetKey.input[0]);
        this.add.image(450, 50, assetKey.input[1])
            .setInteractive()
            .on('pointerdown', (pointer) => {
                this.betPlusButton = {down:pointer.downTime, run:false};
            })
            .on('pointerup', (pointer) => {
                if (pointer.upTime - pointer.downTime < 1000)
                    this.drawBetPoint(100);
                this.betPlusButton = null;
            });
        this.add.image(150, 50, assetKey.input[2])
            .setInteractive()
            .on('pointerdown', (pointer) => {
                this.betMinusButton = {down:pointer.downTime, run:false};
            })
            .on('pointerup', (pointer) => {
                if (pointer.upTime - pointer.downTime < 1000)
                    this.drawBetPoint(-100);
                this.betMinusButton = null;
            });
        this.betText = this.add.text(250, 30, this.bet, {fontSize: 50});
    }

    /*
    checkBet(event) {
        if (this.checkBetTimer) {
            clearTimeout(this.checkBetTimer);
        }

        this.checkBetTimer = setTimeout((game) => {
            let v = game.input.value;
            v = Math.min(game.betMax, v);
            v = Math.min(game.points, v);
            v = Math.max(game.betMin, v);
            game.input.value = v;
        }, 1000, this);
    }
    */

    drawBetPoint(bet) {
        if (this.start) return;
        
        this.click.play();
        this.bet += bet;
        this.bet = Math.min(this.bet, this.betMax);
        this.bet = Math.max(this.bet, this.betMin);
        this.bet = Math.min(this.bet, Math.floor(this.points / 100) * 100);
        this.betText.setText(this.bet);
    }

    createSoundOnOff() {
        this.soundOnOff = this.add.sprite(550, 50, assetKey.soundOnOff)
            .setInteractive()
            .on('pointerdown', () => {
                this.music.mute = !this.music.mute;
            });
    }

    goNext() {
        if (this.isExpert) {
            location.href = gameConfig.url + '?mode=expert&bet=' + this.bet;
        } else {
            location.href = gameConfig.url + '?mode=normal';
        }
    }
}

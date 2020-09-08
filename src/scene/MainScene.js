import { background, rocket } from '../assets';

export class MainScene extends Phaser.Scene {
  constructor ()
  {
      super('MainScene');

      this.rows = 10;
      this.cols = 5;
      this.layers = [];

      this.lines = [];

      this.selected = 0;
  }

  preload() {
    this.load.image('background', background);
    this.load.image("rocket", rocket);
    console.log(rocket);
  }

  create() {
    this.add.image(400, 500, 'background');

    this.graphics = this.add.graphics({ lineStyle: { color: 0x00ffff } });
    this.tent = new Phaser.Geom.Rectangle(50, 150, 500, 500);

    this.createPathes();
    this.createStartPoints();
  }

  update(time, delta) {
    this.graphics.clear();
    this.graphics.lineStyle(1, 0xffffff, 1);

    if (this.selected && this.rocket.z < 1) {
      var t = this.rocket.z;
      var vec = this.rocket.getData('vector');
      this.path.getPoint(t, vec);
      this.rocket.setPosition(vec.x, vec.y);
    } else if (this.rocket && this.rocket.z == 1) {
      console.log('광고 보기');
      //this.scene.start('PrizeScene');
    }

    this.lines.forEach(line=>this.graphics.strokeLineShape(line));

    if (this.selected == 0) {
      this.graphics.fillStyle(0x00ff00, 1);
      this.graphics.fillRectShape(this.tent);
    }
  }

  render() {
  }

  createPathes() {
    let hgap = 500 / this.rows + 1;

    for (var i = 0; i < this.rows; i++) {
      let leg = Phaser.Math.Between(1, this.cols - 1);
      this.layers[i] = leg;
      console.log(leg);

      let path = new Phaser.Geom.Line((leg * 100), 100 + hgap * (i + 1), (leg * 100) + 100, 100 + hgap * (i + 1));
      this.lines.push(path);
    }

    let path1 = new Phaser.Geom.Line(100, 100, 100, 700);
    let path2 = new Phaser.Geom.Line(200, 100, 200, 700);
    let path3 = new Phaser.Geom.Line(300, 100, 300, 700);
    let path4 = new Phaser.Geom.Line(400, 100, 400, 700);
    let path5 = new Phaser.Geom.Line(500, 100, 500, 700);
    this.lines.push(path1, path2, path3, path4, path5);
  }

  createStartPoints() {
    for(let i=0; i<5; ++i) {
      const pos = { x : 100 * i + 70, y : 730 };

      this.add.text(pos.x, pos.y, `Start${i+1}`)
        .setInteractive()
        .on('pointerdown', () => this.launchRocket(i+1))
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
    let hgap = 500 / this.rows + 1;

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

  launchRocket(index) {
    if (this.selected > 0)
        return;

    this.rocket = this.add.image(100, 100, 'rocket');
    this.selected = index;
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
  }
}

import Phaser from "phaser";
import {FirstScene} from "./scene/FirstScene";
import {MainScene} from "./scene/MainScene";

const config = {
  type: Phaser.AUTO,
  parent: "ghost-leg",
  width: 600,
  height: 800,
  scene: [ 
    FirstScene, 
    MainScene,
  ]
};

const game = new Phaser.Game(config);

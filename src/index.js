import Phaser from "phaser";
import {FirstScene} from "./scene/FirstScene";
import {MainScene} from "./scene/MainScene";

const config = {
    type: Phaser.AUTO,
    parent: "ghost-leg",
    width: 600,
    height: 800,
    autoFocus: true,
    disableContextMenu: false,
    rows: 10,
    cols: 3,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [ 
        FirstScene, 
        MainScene,
    ]
};

var game = new Phaser.Game(config);


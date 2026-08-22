import TitleScene from './scenes/TitleScene.js';
import TalkScene from './scenes/TalkScene.js';
import HomeScene from './scenes/HomeScene.js';
import GameSelectScene from './scenes/GameSelectScene.js';
import ConfigScene from './scenes/ConfigScene.js';
import ShopScene from './scenes/ShopScene.js';
import PetCareScene from './scenes/PetCareScene.js';
import DressupScene from './scenes/DressupScene.js';
import GachaScene from './scenes/GachaScene.js';
import CollectionScene from './scenes/CollectionScene.js';
import FigureGetScene, {Test_FigureGetScene} from './scenes/FigureGetScene.js';

import ShootingPlayerSelectScene from './games/shooting/scenes/ShootingPlayerSelectScene.js';
import ShootingGameScene from './games/shooting/scenes/ShootingGameScene.js';
import ShootingGameOverScene from './games/shooting/scenes/ShootingGameOverScene.js';

import GuideTitleScene from './games/guide/scenes/GuideTitleScene.js';
import GuideGameScene from './games/guide/scenes/GuideGameScene.js';

import Act2dTitleScene from './games/act2d/scenes/Act2dTitleScene.js';
import Act2dGameScene from './games/act2d/scenes/Act2dGameScene.js';

import MemoryScene from './games/memory/scenes/MemoryScene.js';
import RunGameScene from './games/rungame/scenes/RunGameScene.js';
import NikakuScene from './games/nikaku/scenes/NikakuScene.js';

//import VirtualJoystickPlugin from './plugins/node_modules/phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';



window.config = {
  type: Phaser.AUTO,
  width: 860,
  height: 480,
  parent: 'phaser-example',
  backgroundColor: 0xffffff,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    activePointers: 3,
  },
  scene: [
    TitleScene, HomeScene, GameSelectScene, 
    PetCareScene, DressupScene, TalkScene,
    ShopScene, GachaScene, CollectionScene, FigureGetScene,
    ConfigScene,
    ShootingGameOverScene, ShootingGameScene, ShootingPlayerSelectScene,
    MemoryScene,
    RunGameScene,
    NikakuScene,
    GuideTitleScene, GuideGameScene,  
    Act2dTitleScene, Act2dGameScene,
    Test_FigureGetScene,
  ],
  
  physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: { y: 0 }
      },
  },
  dom: {
    createContainer: true
  },
  /*
  plugins: {
    global: [
      {
        key: 'rexVirtualJoystick',
        plugin: VirtualJoystickPlugin,
        start: true
      }
    ],
  },
  */
}
window.audio = {};

window.selectStage = "hakase";
window.selectPlayer = "hana";
window.talkAnimal = null;
window.sceneHistory = [];
window.flags = {};
window.memoryLevel = 0;

window.game = new Phaser.Game(config);


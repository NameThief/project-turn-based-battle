import BootScene from './scenes/BootScene.js';
import BattleScene from './scenes/BattleScene.js';
import UIScene from './scenes/UIScene.js';
import EnemyAssetScene from './scenes/EnemyAssetScene.js';
import PlayerAssetScene from './scenes/PlayerAssetScene.js';
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [BootScene, BattleScene, UIScene, EnemyAssetScene, PlayerAssetScene] // Charger les scènes
};

const game = new Phaser.Game(config);
game.scene.start('EnemyAssetScene');
game.scene.start('PlayerAssetScene');
console.log("📢 EnemyAssetScene forcée au démarrage !");

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.jpg'); // Charger le fond de combat
        console.log("✅ Image de fond chargée ? " + this.textures.exists('background'));
    }

    create() {
        this.scene.start('BattleScene'); // Lancer la scène de combat
        console.log("🔥 BattleScene.js est bien chargé !");
    }
}

export default BootScene;

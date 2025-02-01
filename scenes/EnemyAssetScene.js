console.log("✅ EnemyAssetScene.js est bien chargé !");
class EnemyAssetScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EnemyAssetScene' });
    }

    preload() {
        // Charger les sprites individuels pour l'ennemi (le mage)
        console.log("📢 Tentative de chargement des images...");
        this.load.image('enemyMage_idle', 'assets/mage.png');
        this.load.image('enemyMage_attack', 'assets/mage_attack.png');
        this.load.image('enemyMage_damage', 'assets/mage_damage.png');
        this.load.image('enemyMage_death', 'assets/mage_death.png');
        this.load.image('manaShield', 'assets/mana_shield.png');

        console.log("Images de l'ennemi chargées !");
    }

    create() {
        console.log("🎬 EnemyAssetScene: create() est exécuté !");
        if (this.textures.exists('enemyMage_idle')) {
            console.log("✅ L'image enemyMage_idle est bien chargée !");
            this.enemySprite = this.add.image(600, 300, 'enemyMage_idle').setScale(2);
        } else {
            console.log("❌ Erreur : L'image enemyMage_idle n'est PAS chargée !");
            this.manaShieldSprite = this.add.image(600, 300, 'manaShield')
    .setVisible(false)
    .setDepth(10); // ✅ Place l'image AU-DESSUS du Mage
        }
    }
    

    playAnimation(state) {
        if (this.enemySprite) {
            switch (state) {
                case 'idle':
                    this.enemySprite.setTexture('enemyMage_idle');
                    break;
                case 'attack':
                    this.enemySprite.setTexture('enemyMage_attack');
                    break;
                case 'damage':
                    this.enemySprite.setTexture('enemyMage_damage');
                    break;
                case 'death':
                    this.enemySprite.setTexture('enemyMage_death');
                    break;
            }
        }
    }
    
}

export default EnemyAssetScene;

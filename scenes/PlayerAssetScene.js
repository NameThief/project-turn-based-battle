console.log("✅ PlayerAssetScene.js est bien chargé !");

class PlayerAssetScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerAssetScene' });
    }

    preload() {
        console.log("📢 Tentative de chargement des images du joueur...");

        // Charger les sprites individuels pour le joueur
        this.load.image('player_idle', 'assets/knight.png');
        this.load.image('player_attack', 'assets/knight_attack.png');
        this.load.image('player_damage', 'assets/knight_damage.png');
        this.load.image('player_death', 'assets/knight_death.png');
        this.load.image('flameEffect', 'assets/flame.png');
        console.log("✅ Images du joueur chargées !");
    }

    create() {
        console.log("🎬 PlayerAssetScene: create() est exécuté !");

        // Vérifie si l'image 'player_idle' existe
        if (this.textures.exists('player_idle')) {
            console.log("✅ L'image player_idle est bien chargée !");
            // On place le joueur à gauche (x=200, y=300)
            this.playerSprite = this.add.image(200, 300, 'player_idle').setScale(2);
        } else {
            console.log("❌ Erreur : L'image player_idle n'est PAS chargée !");
        }
    }

    playAnimation(state) {
        if (this.playerSprite) {
            switch (state) {
                case 'idle':
                    this.playerSprite.setTexture('player_idle');
                    break;
                case 'attack':
                    this.playerSprite.setTexture('player_attack');
                    break;
                case 'damage':
                    this.playerSprite.setTexture('player_damage');
                    break;
                case 'death':
                    this.playerSprite.setTexture('player_death');
                    break;
            }
        }
    }
    
    
}

export default PlayerAssetScene;

import { playerAttack, playerFlame, playerPotion, playerDefend } from './PlayerActions.js';
import { enemyTurn } from './EnemyActions.js';
class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }
    preload() {
        this.load.audio('battleMusic', 'assets/music/battle_theme.mp3'); // 🎵 Charge la musique
    }
    
    create() {
        this.sound.setVolume(0.1); // ✅ Réduit le volume global de tous les sons à 50%
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(800, 600);
        console.log("🎨 Background ajouté à la scène !");
        this.player = { 
            name: "Guerrier", 
            hp: 100, 
            maxHp: 100, 
            mana: 50, 
            attack: 15, 
            defense: 5, 
            defenseCount: 0, 
            maxDefense: 5,
            potions: 2 
        };
        
        this.enemy = { 
            name: "Mage", 
            hp: 80, 
            maxHp: 80, // Ajout pour limiter la régénération de HP
            mana: 100, // Augmenté à 100
            attack: 30, 
            defense: 3, 
            defenseCount: 0, 
            maxDefense: 5 
        };

        this.enemyManaShield = 0; // 0 = Pas de bouclier actif

        
        this.spellCooldown = 0; // Initialisation correcte du cooldown du sort
        this.playerParalysisTurns = 0; // Le joueur n'est pas paralysé au début

        this.isEnemyTurnActive = false; // Empêche le double tour ennemi au début
        // Affichage des HP et Mana du joueur
        this.playerHPText = this.add.text(200, 200, `HP: ${this.player.hp}`, {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.playerManaText = this.add.text(200, 230, `Mana: ${this.player.mana}`, {
            fontSize: '20px',
            fill: '#00BFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Affichage des HP de l'ennemi
        this.enemyHPText = this.add.text(600, 200, `HP: ${this.enemy.hp}`, {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.currentTurn = "player";

        // Lancer les scènes d'animation
        this.scene.launch('PlayerAssetScene');
        this.playerScene = this.scene.get('PlayerAssetScene');
        this.playerScene.playAnimation('idle');

        this.enemyScene = this.scene.get('EnemyAssetScene');
        this.enemyScene.playAnimation('idle');
        if (!this.music || !this.music.isPlaying) {
            this.music = this.sound.add('battleMusic', { loop: true, volume: 0.5 });
            this.music.play();
        }
        


        // Lancer l'UI
        this.scene.launch('UIScene');
    }

    update() {
        if (this.player.hp <= 0) {
            this.scene.get('UIScene').updateMessage("Tu as perdu !");
            this.playerScene.playAnimation('death');

            this.time.delayedCall(2000, () => {
                this.scene.restart();
            });

        } else if (this.enemy.hp <= 0) {
            this.scene.get('UIScene').updateMessage("Tu as gagné !");
            this.enemyScene.playAnimation('death');

            this.time.delayedCall(2000, () => {
                this.scene.restart();
            });
        }
    }

    calculateDamage(baseAttack, targetDefense) {
        let rawDamage = Phaser.Math.Between(baseAttack - 5, baseAttack + 5);
        let defenseFactor = Math.min(targetDefense * 0.1, 0.5);
        let finalDamage = rawDamage * (1 - defenseFactor);
        return Math.max(1, Math.round(finalDamage));
    }

    playerAttack() {
        playerAttack(this);
    }

    playerDefend() {
        playerDefend(this);
    }

    playerFlame() {
        playerFlame(this);
    }

    playerPotion() {
        playerPotion(this);
    }

    enemyTurn() {
        enemyTurn(this);
    }

    endTurn() {
        let uiScene = this.scene.get('UIScene');
        console.log(`DEBUG: Début de endTurn() - currentTurn: ${this.currentTurn}, playerParalysisTurns: ${this.playerParalysisTurns}`);
    
        if (this.currentTurn === "player") {
            if (this.playerParalysisTurns > 0) {
                this.playerParalysisTurns--; 
                console.log(`DEBUG: Paralysie détectée, reste ${this.playerParalysisTurns} tours`);
    
                uiScene.updateMessage("⏳ Tu es paralysé et ne peux pas jouer !");
                uiScene.disablePlayerActions();
    
                this.time.delayedCall(1500, () => {
                    console.log("DEBUG: Passage immédiat au tour de l'ennemi car le joueur est encore paralysé.");
                    this.currentTurn = "enemy";
                    this.enemyTurn();
                });
    
                return;
            } 
    
            console.log("DEBUG: Joueur non paralysé, passage au tour de l'ennemi...");
            this.currentTurn = "enemy";
            uiScene.disablePlayerActions();
            this.time.delayedCall(1500, () => {
                this.enemyTurn();
            });
    
        } else {
            console.log("DEBUG: Fin du tour de l'ennemi, passage au joueur...");
    
            // ✅ **Si le joueur est encore paralysé, le jeu saute son tour immédiatement**
            if (this.playerParalysisTurns > 0) {
                console.log(`DEBUG: Joueur encore paralysé (${this.playerParalysisTurns} restants), l'ennemi rejoue immédiatement.`);
                this.time.delayedCall(1500, () => {
                    this.currentTurn = "enemy";
                    this.enemyTurn();
                });
                return;
            }
    
            this.currentTurn = "player";
            uiScene.updateMessage("C'est ton tour !");
            uiScene.enablePlayerActions();
        }
    }
    
    
    
    
    
}

export default BattleScene;

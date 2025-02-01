class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }
    preload() {
        console.log("📢 Tentative de chargement de l'image 'manaShield'...");
        this.load.image('manaShield', 'assets/mana_shield.png');
    }
    
    
    create() {
        console.log("DEBUG: Vérification de manaShield dans la scène...");
if (!this.textures.exists('manaShield')) {
    console.error("❌ ERREUR : L'image 'manaShield' n'a pas été chargée correctement !");
}
        // 📌 Affichage du message de combat en haut
        this.messageText = this.add.text(300, 50, "C'est ton tour !", {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        });

        // 📌 Boîte de dialogue pour actions
        this.dialogBox = this.add.graphics();
        this.dialogBox.fillStyle(0x000000, 0.7);
        this.dialogBox.fillRoundedRect(100, 450, 600, 120, 20);

        // 📌 Liste des boutons d'action pour le joueur
        this.actionButtons = [];

        // 📌 Ajout des boutons d'action
        this.createActionButtons();

        // 📌 Icône visuelle pour afficher le Bouclier de Mana
        this.enemyShieldIcon = this.add.text(600, 180, "🛡", {
            fontSize: '24px',
            fill: '#00BFFF',
        }).setVisible(false); // Caché au début

        this.manaShieldSprite = this.add.image(600, 300, 'manaShield')
    .setVisible(false)
    .setScale(0.18) // ✅ Réduit la taille à 50%
    .setDepth(10); // ✅ Place l'image AU-DESSUS du Mage


console.log("✅ manaShieldSprite ajouté à la scène.");

    }

    // 📌 Création des boutons d'action
    createActionButtons() {
        const createButton = (x, y, text, color, bgColor, callback) => {
            let button = this.add.text(x, y, text, {
                fontSize: '20px',
                fill: color,
                backgroundColor: bgColor,
                padding: { x: 10, y: 5 }
            })
            .setInteractive()
            .on('pointerdown', callback);

            this.actionButtons.push(button);
            return button;
        };

        // ✅ Boutons d'action du joueur
        createButton(120, 470, "⚔ Attaquer", '#FFD700', '#8B0000', () => {
            this.scene.get('BattleScene').playerAttack();
        });

        createButton(520, 470, "🛡 Défendre", '#ADD8E6', '#004488', () => {
            this.scene.get('BattleScene').playerDefend();
        });

        createButton(120, 520, "📖 Grimoire", '#32CD32', '#006400', () => {
            this.openSubDialog("Liste des sorts", "🔥 Flamme", () => {
                this.scene.get('BattleScene').playerFlame();
            });
        });

        createButton(520, 520, "🎒 Inventaire", '#FFD700', '#8B8000', () => {
            this.openInventory();
        });
    }

    // 📌 Désactiver les boutons du joueur (ex: paralysie)
    disablePlayerActions() {
        console.log("🔴 Actions désactivées (paralysie ou tour ennemi)");
        this.actionButtons.forEach(button => {
            button.disableInteractive().setAlpha(0.5);
        });
    }

    // 📌 Réactiver les boutons du joueur
    enablePlayerActions() {
        console.log("🟢 Actions réactivées !");
        this.actionButtons.forEach(button => {
            button.setInteractive().setAlpha(1);
        });
    }

    // 📌 Affichage des messages de combat
    updateMessage(newText) {
        this.messageText.setText(newText);

        let battleScene = this.scene.get('BattleScene');
        if (battleScene.playerParalysisTurns > 0) {
            this.disablePlayerActions(); // ✅ Bloque les boutons en cas de paralysie
        } else {
            this.enablePlayerActions(); // ✅ Réactive les boutons si paralysie terminée
        }
    }

    // 📌 Gérer l'affichage de l'inventaire
    openInventory() {
        let battleScene = this.scene.get('BattleScene');
        let potionCount = battleScene.player.potions;

        this.openSubDialog("Liste des objets", `🧪 Potion x${potionCount}`, () => {
            battleScene.playerPotion();
            this.closeSubDialog();
        }, potionCount > 0);
    }

    // 📌 Gestion d'un sous-menu pour sélectionner des actions
    openSubDialog(message, buttonText, buttonAction, isActive = true) {
        this.dialogBox.setVisible(false);

        this.subDialogBox = this.add.graphics();
        this.subDialogBox.fillStyle(0x222222, 0.9);
        this.subDialogBox.fillRoundedRect(100, 450, 600, 120, 20);
        
        this.subDialogText = this.add.text(150, 470, message, {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Arial'
        });

        this.closeButton = this.add.text(650, 460, "❌", {
            fontSize: '24px',
            fill: '#FF0000',
            backgroundColor: '#333333',
            padding: { x: 5, y: 5 }
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.closeSubDialog();
        });

        this.potionButton = this.add.text(150, 500, buttonText, {
            fontSize: '20px',
            fill: isActive ? '#FFFFFF' : '#666666',
            backgroundColor: '#444444',
            padding: { x: 10, y: 5 }
        });

        if (isActive) {
            this.potionButton.setInteractive().on('pointerdown', () => {
                buttonAction();
                this.closeSubDialog();
            });
        } else {
            this.potionButton.setAlpha(0.5);
        }
    }

    closeSubDialog() {
        if (this.subDialogBox) {
            this.subDialogBox.destroy();
            this.subDialogText.destroy();
            if (this.potionButton) this.potionButton.destroy();
            if (this.closeButton) this.closeButton.destroy();
            this.dialogBox.setVisible(true);
        }
    }

    // 📌 **Ajout : Mise à jour du Bouclier de Mana**
    updateManaShield(isActive) {
        console.log(`DEBUG: updateManaShield appelé - isActive: ${isActive}`);
    
        if (!this.manaShieldSprite) {
            console.error("❌ ERREUR : manaShieldSprite n'existe pas !");
            return;
        }
    
        if (isActive) {
            console.log("🛡 Affichage du Bouclier de Mana !");
            this.manaShieldSprite.setVisible(true);
        } else {
            console.log("❌ Bouclier de Mana dissipé !");
            this.manaShieldSprite.setVisible(false);
        }
    }
    
    // 📌 Mise à jour du nombre de potions affiché
    updatePotionCount(count) {
        if (this.potionButton) {
            if (count > 0) {
                this.potionButton.setText(`🧪 Potion x${count}`);
                this.potionButton.setInteractive().setAlpha(1);
            } else {
                this.potionButton.setText("❌ Plus de potions");
                this.potionButton.disableInteractive().setAlpha(0.5);
            }
        }
    }
}

export default UIScene;

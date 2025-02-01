export function enemyTurn(scene) {
    if (scene.isEnemyTurnActive) return;
    scene.isEnemyTurnActive = true;

    let enemyHPPercent = (scene.enemy.hp / scene.enemy.maxHp) * 100;
    let hasManaForShield = scene.enemy.mana >= 10 && scene.enemyManaShield === 0; // ✅ Vérifie si le Mage peut utiliser son bouclier
    let canUseSpell = scene.enemy.mana >= 25 && enemyHPPercent < 50 && scene.spellCooldown === 0;

    let choice;

    // ✅ Si le joueur est paralysé, forcer une attaque
    if (scene.playerParalysisTurns > 0) {
        console.log("DEBUG: Joueur paralysé, le Mage attaque obligatoirement !");
        choice = 0; // Forcer l'attaque
    } 
    else {
        if (hasManaForShield && Phaser.Math.Between(1, 100) <= 50) { 
            choice = 3; // 50% de chance d'utiliser le bouclier si disponible
        } else if (canUseSpell && Phaser.Math.Between(1, 100) <= 70) {
            choice = 2; // Lancer Distorsion spatio-temporelle
        } else {
            choice = Phaser.Math.Between(0, 1); // 0 = Attaque, 1 = Défense
        }
    }

    scene.scene.get('UIScene').updateMessage(`${scene.enemy.name} réfléchit...`);

    scene.time.delayedCall(1500, () => {  
        if (choice === 0) {
            enemyAttack(scene);
        } else if (choice === 1) {
            enemyDefend(scene);
        } else if (choice === 2) {
            enemyDistortionSpell(scene);
        } else if (choice === 3) {
            enemyManaShield(scene);
        }

        if (scene.playerParalysisTurns > 0) {
            scene.playerParalysisTurns--;
            console.log(`DEBUG: Paralysie réduite par l'ennemi, reste ${scene.playerParalysisTurns} tours.`);
        }

        if (scene.spellCooldown > 0) {
            scene.spellCooldown--;
        }

        scene.time.delayedCall(1000, () => {
            scene.isEnemyTurnActive = false;
            scene.endTurn();
        });
    });
}

// ✅ Attaque de base du Mage
function enemyAttack(scene) {
    console.log("Mage attaque !");
    scene.enemyScene.playAnimation('attack');

    scene.time.delayedCall(500, () => {
        let damage = scene.calculateDamage(scene.enemy.attack, scene.player.defense);
        scene.player.hp -= damage;
        scene.playerHPText.setText(`HP: ${scene.player.hp}`);
        scene.scene.get('UIScene').updateMessage(`${scene.enemy.name} attaque ! Tu perds ${damage} HP`);

        scene.playerScene.playAnimation('damage');
        scene.time.delayedCall(500, () => scene.playerScene.playAnimation('idle'));
    });
}

// ✅ Défense du Mage
function enemyDefend(scene) {
    console.log("Mage se défend !");
    scene.enemy.defense += 5;
    scene.enemy.defenseCount++;
    scene.scene.get('UIScene').updateMessage(`${scene.enemy.name} se défend ! Défense augmentée.`);
}

// ✅ Nouveau sort : **Distorsion spatio-temporelle**
function enemyDistortionSpell(scene) {
    console.log("Mage tente de lancer Distorsion spatio-temporelle !");
    scene.enemy.mana -= 25;
    scene.scene.get('UIScene').updateMessage(`✨ ${scene.enemy.name} lance Distorsion spatio-temporelle !`);

    let diceRoll = Phaser.Math.Between(1, 6);
    scene.scene.get('UIScene').updateMessage(`🎲 Le dé roule... Résultat : ${diceRoll}`);

    if (diceRoll >= 4) {
        console.log("Sort réussi ! Le joueur est paralysé.");
        scene.scene.get('UIScene').updateMessage(`⏳ Le temps se distord ! Tu es paralysé pour 3 tours !`);
        scene.playerParalysisTurns = 3;
    } else {
        console.log("Sort échoué !");
        scene.scene.get('UIScene').updateMessage(`❌ Le sort échoue, c'est ton tour !`);
    }

    scene.spellCooldown = 2; // ✅ Empêche le Mage de relancer immédiatement le sort
}

// ✅ Nouveau sort : **Bouclier de Mana**
export function enemyManaShield(scene) {
    if (scene.enemyManaShield > 0) {
        console.log("DEBUG: Bouclier déjà actif, impossible de le relancer.");
        return;
    }

    if (scene.enemy.mana >= 10) {
        scene.enemy.mana -= 10;
        scene.enemyManaShield = 15;
        console.log("DEBUG: Activation du Bouclier de Mana.");

        // ✅ Mise à jour du message dans l'UI
        scene.scene.get('UIScene').updateMessage(`🔵 ${scene.enemy.name} invoque un Bouclier de Mana !`);
        
        // ✅ Activation visuelle du bouclier
        scene.scene.get('UIScene').updateManaShield(true);

        // ✅ Assurons-nous que le tour se termine après l'activation
        scene.time.delayedCall(1000, () => {
            console.log("DEBUG: Fin du tour après activation du bouclier.");
            scene.isEnemyTurnActive = false; // ✅ On s'assure que le tour ennemi n'est plus actif
            scene.currentTurn = "player"; // ✅ On passe bien au tour du joueur
            scene.endTurn();
        });

    } else {
        console.log("DEBUG: Pas assez de mana pour activer le bouclier.");
        scene.endTurn();
    }
}
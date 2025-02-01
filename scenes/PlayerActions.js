function isPlayerParalyzed(scene) {
    if (scene.playerParalysisTurns > 0) {
        scene.scene.get('UIScene').updateMessage("⏳ Tu es paralysé et ne peux pas agir !");
        return true; // Le joueur est paralysé, on bloque l'action
    }
    return false; // Le joueur peut agir normalement
}

export function playerAttack(scene) {
    if (isPlayerParalyzed(scene)) return; // ✅ Bloque l'action si paralysé
    if (scene.currentTurn !== "player") return;

    let damage = scene.calculateDamage(scene.player.attack, scene.enemy.defense);
    scene.enemy.hp -= damage;
    scene.enemyHPText.setText(`HP: ${scene.enemy.hp}`);
    scene.scene.get('UIScene').updateMessage(`⚔️ Tu attaques ! ${scene.enemy.name} perd ${damage} HP`);

    scene.playerScene.playAnimation('attack');
    scene.time.delayedCall(500, () => scene.playerScene.playAnimation('idle'));

    scene.enemyScene.playAnimation('damage');
    scene.time.delayedCall(500, () => scene.enemyScene.playAnimation('idle'));

    scene.endTurn();
}


export function playerDefend(scene) {
    if (isPlayerParalyzed(scene)) return;
    if (scene.currentTurn !== "player") return;  // Ajout de cette ligne ✅

    if (scene.player.defenseCount >= scene.player.maxDefense) {
        scene.scene.get('UIScene').updateMessage("⚠️ Ta défense est déjà au maximum !");
    } else {
        scene.player.defense += 5;
        scene.player.defenseCount++;
        scene.scene.get('UIScene').updateMessage("🛡 Tu te défends ! Défense augmentée.");
    }

    scene.endTurn();
}


export function playerFlame(scene) {
    if (isPlayerParalyzed(scene)) return;
    if (scene.currentTurn !== "player") return;

    let manaCost = 10;
    let damage = 15;

    if (scene.player.mana >= manaCost) {
        scene.player.mana -= manaCost;
        scene.playerManaText.setText(`Mana: ${scene.player.mana}`);

        if (scene.enemyManaShield > 0) {
            let absorbed = Math.min(scene.enemyManaShield, damage);
            scene.enemyManaShield -= absorbed;
            console.log(`DEBUG: Bouclier absorbe ${absorbed} dégâts, reste ${scene.enemyManaShield} points.`);

            scene.scene.get('UIScene').updateMessage(`🛡 Bouclier absorbe ${absorbed} dégâts magiques !`);

            if (scene.enemyManaShield <= 0) {
                scene.scene.get('UIScene').updateMessage("❌ Le Bouclier de Mana se dissipe !");
                scene.scene.get('UIScene').updateManaShield(false);
            }
        } else {
            scene.enemy.hp -= damage;
            scene.enemyHPText.setText(`HP: ${scene.enemy.hp}`);
            scene.scene.get('UIScene').updateMessage("🔥 Tu lances Flamme !");
        }

        scene.playerScene.playAnimation('attack');
        scene.time.delayedCall(500, () => {
            scene.enemyScene.playAnimation('damage');
            scene.time.delayedCall(500, () => scene.enemyScene.playAnimation('idle'));
        });

    } else {
        scene.scene.get('UIScene').updateMessage("❌ Pas assez de mana !");
    }

    scene.time.delayedCall(1000, () => {
        scene.playerScene.playAnimation('idle');
    });

    scene.endTurn();
}




export function playerPotion(scene) {
    if (isPlayerParalyzed(scene)) return; // Vérifie la paralysie et bloque si nécessaire
    if (scene.currentTurn !== "player") return;

    if (scene.player.potions > 0) {
        let healAmount = 20;
        scene.player.hp = Math.min(scene.player.hp + healAmount, scene.player.maxHp);
        scene.player.potions--;

        scene.playerHPText.setText(`HP: ${scene.player.hp}`);
        scene.scene.get('UIScene').updatePotionCount(scene.player.potions);

        scene.scene.get('UIScene').updateMessage(`🧪 Tu bois une potion et récupères ${healAmount} PV !`);
    } else {
        scene.scene.get('UIScene').updateMessage("❌ Plus de potions !");
    }

    scene.endTurn();
}

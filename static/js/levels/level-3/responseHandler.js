import { gameState, updateGameStats } from './gameState.js';
import { systems } from './systemHandler.js';
import { updateMentorMessage, showResultModal, updateSystemVisuals } from './uiUpdates.js';

export function handleResponse(action) {
    const system = gameState.currentSystem;
    let success = false;
    let title, message, feedback;

    // Determine correct action based on system status and malware type
    if (system.status === 'infected') {
        if (action === 'quarantine' || action === 'clean') {
            success = true;
        }
    } else if (system.status === 'suspicious') {
        if (action === 'quarantine' || action === 'isolate') {
            success = true;
        }
    } else {
        if (action === 'clean') {
            success = true;
        }
    }

    if (success) {
        handleCorrectResponse(system, action);
    } else {
        handleWrongResponse(system, action);
    }

    gameState.completedSystems.push(system.id);
    updateGameStats();
    updateSystemVisuals();

    // Check if level complete
    if (gameState.systemsCleaned >= 3 && gameState.infectedSystems === 0) {
        setTimeout(() => endGame(true), 2000);
    } else {
        setTimeout(() => {
            document.getElementById('system-analysis').classList.add('hidden');
            document.getElementById('system-placeholder').classList.remove('hidden');
            updateMentorMessage("Good work! Continue analyzing and containing the remaining threats.");
        }, 2000);
    }
}

export function handleCorrectResponse(system, action) {
    if (system.status === 'infected') {
        gameState.infectedSystems--;
        gameState.systemsCleaned++;
    } else if (system.status === 'suspicious') {
        gameState.quarantinedSystems++;
    }
    
    system.status = 'clean';
    system.malwareType = null;
    gameState.cleanSystems++;

    showResultModal('✅', 'Containment Successful!', 
        `${system.name} has been successfully secured.`,
        `<div class="text-green-400">System cleaned and returned to normal operation. Threat eliminated.</div>`
    );
    
    updateMentorMessage("Excellent work! Threat contained successfully. The system is now secure.");
}

export function handleWrongResponse(system, action) {
    if (action === 'shutdown' && system.status === 'infected') {
        // Emergency shutdown - partial success but system offline
        gameState.infectedSystems--;
        system.status = 'offline';
        showResultModal('⚠️', 'Emergency Shutdown', 
            'System offline but threat contained.',
            '<div class="text-yellow-400">System secured but player disconnected from tournament.</div>'
        );
    } else {
        // Wrong action - spread infection
        spreadInfection();
        showResultModal('❌', 'Containment Failed!', 
            'Incorrect response allowed malware to spread.',
            '<div class="text-red-400">The malware adapted to your response and infected additional systems.</div>'
        );
    }
    
    updateMentorMessage("That wasn't the optimal response. Learn from this and choose more carefully next time.");
}

export function spreadInfection() {
    // Find adjacent clean systems and infect one
    const cleanSystemIds = Object.keys(systems).filter(id => systems[id].status === 'clean');
    if (cleanSystemIds.length > 0) {
        const targetId = cleanSystemIds[Math.floor(Math.random() * cleanSystemIds.length)];
        systems[targetId].status = 'infected';
        systems[targetId].malwareType = 'worm';
        gameState.infectedSystems++;
        gameState.cleanSystems--;
        updateSystemVisuals();
        updateGameStats();
        
        showResultModal('⚠️', 'Infection Spread!', 
            `Terminal-${targetId.padStart(2, '0')} has been infected. Contain the outbreak faster!`,
            '<div class="text-red-400">The malware is evolving and spreading to new systems.</div>'
        );
    }
}

export function endGame(success) {
    clearInterval(gameState.spreadTimerRef);
    
    if (success) {
        updateMentorMessage("Outstanding work, Nova! You've successfully contained the malware outbreak and saved the tournament. The Academy's systems are secure.");
        document.getElementById('complete-level').disabled = false;
        
        showResultModal(
            '🏆',
            'Outbreak Contained!',
            'You\'ve successfully completed Malware Mayhem and earned the System Sanitizer badge.',
            `
                <div class="text-left space-y-3">
                    <div class="bg-purple-900 border border-purple-600 rounded p-3">
                        <p class="text-purple-300 font-semibold">🏆 Digital Badge Earned</p>
                        <p class="text-purple-200 text-sm">System Sanitizer - Malware Defense Specialist</p>
                    </div>
                    <div class="text-sm space-y-1">
                        <p><strong>Systems Cleaned:</strong> ${gameState.systemsCleaned}</p>
                        <p><strong>Threats Contained:</strong> ${3 - gameState.infectedSystems}/3</p>
                        <p><strong>Response Time:</strong> Excellent</p>
                    </div>
                </div>
            `
        );
    }
}

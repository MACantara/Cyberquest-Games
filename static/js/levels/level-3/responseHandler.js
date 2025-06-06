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

    // Stop corruption effects for this system
    if (window.stopCorruptionEffects) {
        window.stopCorruptionEffects();
    }
    
    // Create success notification
    createNotification(
        'Containment Successful',
        `${system.name} has been cleaned and secured. Threat eliminated.`,
        'success'
    );
    
    // Show system restoration effects
    setTimeout(() => {
        // Reset CPU usage
        const cpuBar = document.getElementById('cpu-bar');
        cpuBar.style.width = '15%';
        cpuBar.textContent = '15%';
        
        // Reset memory usage
        const memoryBar = document.getElementById('memory-bar');
        memoryBar.style.width = '45%';
        memoryBar.textContent = '45%';
        
        // Clear corruption overlay
        document.getElementById('corruption-overlay').style.opacity = '0';
        
        createNotification(
            'System Restored',
            'All files have been decrypted and system performance restored.',
            'success'
        );
    }, 1000);
    
    showResultModal('🧹', 'System Cleaned!', 
        `${system.name} has been successfully decontaminated.`,
        `<div class="text-green-400">✅ Malware removed<br>✅ Files restored<br>✅ Network secured</div>`
    );
}

export function handleWrongResponse(system, action) {
    if (action === 'shutdown' && system.status === 'infected') {
        // Emergency shutdown - system offline but contained
        gameState.infectedSystems--;
        system.status = 'offline';
        
        createNotification(
            'Emergency Shutdown',
            `${system.name} has been forcibly disconnected. Player session terminated.`,
            'warning'
        );
        
        showResultModal('⚡', 'Emergency Shutdown', 
            'System secured but player disconnected from tournament.',
            '<div class="text-yellow-400">⚠️ System offline but threat contained</div>'
        );
    } else {
        // Wrong action - trigger spread
        simulateSystemSlowdown(system.id);
        simulateDataExfiltration(system.id);
        showFileEncryption(['player_profile.dat', 'game_settings.cfg', 'tournament_stats.json']);
        
        spreadInfection();
        
        createNotification(
            'Containment Failed',
            'Incorrect response allowed malware to adapt and spread to adjacent systems!',
            'error'
        );
        
        showResultModal('💀', 'Containment Failed!', 
            'The malware evolved and infected additional systems.',
            '<div class="text-red-400">❌ Malware adapted<br>❌ Spread to new systems<br>❌ Data compromised</div>'
        );
    }
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
        
        // Trigger visual corruption effects
        if (window.startCorruptionEffects) {
            window.startCorruptionEffects();
        }
        
        // Simulate infection spread visually
        simulateSystemSlowdown(targetId);
        
        createNotification(
            'Infection Spread!',
            `Terminal-${targetId.padStart(2, '0')} has been compromised! The malware is spreading rapidly through the network.`,
            'error'
        );
        
        updateSystemVisuals();
        updateGameStats();
        
        showResultModal('🦠', 'Malware Spread!', 
            `Terminal-${targetId.padStart(2, '0')} infected. Contain the outbreak faster!`,
            '<div class="text-red-400">🚨 Network propagation detected<br>🚨 Additional systems compromised<br>🚨 Escalating threat level</div>'
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

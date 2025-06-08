import { startAttackSimulation, stopAttackSimulation } from './attackSimulation.js';
import { initializeMitigationButtons, initializeCommandInput } from './defenseTools.js';
import { loadInfrastructureData } from './infrastructureHandler.js';
import { gameState, updateGameMetrics, resetGameState } from './gameState.js';
import { updateCommanderMessage } from './uiUpdates.js';

let levelInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeLevel9();
});

async function initializeLevel9() {
    if (levelInitialized) return;
    
    console.log('Initializing Level 9: Operation Blackout');
    
    // Show opening cutscene
    showOpeningCutscene();
    
    // Initialize UI components
    initializeUIHandlers();
    
    // Load infrastructure data
    await loadInfrastructureData();
    
    // Initialize defense tools
    initializeMitigationButtons();
    initializeCommandInput();
    
    // Initialize metrics display
    updateGameMetrics();
    
    levelInitialized = true;
}

function showOpeningCutscene() {
    const modal = document.getElementById('cutscene-modal');
    const startBtn = document.getElementById('start-defense');
    
    if (modal && startBtn) {
        modal.classList.remove('hidden');
        
        startBtn.addEventListener('click', () => {
            startMission();
        });
    }
}

function startMission() {
    const modal = document.getElementById('cutscene-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    // Reset game state for new mission
    resetGameState();
    
    // Start the attack simulation
    gameState.missionStartTime = Date.now();
    startAttackSimulation();
    
    // Update initial UI state
    updateGameMetrics();
    
    updateCommanderMessage("Mission started! DDoS attacks incoming on multiple infrastructure nodes. Priority targets are hospitals and emergency services. Click on nodes to begin defense!");
    
    // Show initial mission briefing
    setTimeout(() => {
        showMissionBriefing();
    }, 2000);
}

function showMissionBriefing() {
    updateCommanderMessage("Current threat assessment: Hospital systems at 30% capacity, Emergency services critically compromised at 15%, Power grid under stress. Deploy mitigations immediately!");
}

function initializeUIHandlers() {
    // Results modal continue button
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            document.getElementById('results-modal').classList.add('hidden');
        });
    }
    
    // Level completion button
    const completeLevelBtn = document.getElementById('complete-level');
    if (completeLevelBtn) {
        completeLevelBtn.addEventListener('click', () => {
            completeLevel();
        });
    }
    
    // Mission timer updates
    startMissionTimer();
}

function startMissionTimer() {
    setInterval(() => {
        if (gameState.missionStartTime) {
            const elapsed = Date.now() - gameState.missionStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            const timerElement = document.getElementById('mission-timer');
            if (timerElement) {
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    }, 1000);
}

function completeLevel() {
    // Stop attack simulation
    stopAttackSimulation();
    
    // Calculate final score
    const finalStats = calculateFinalStats();
    
    // Show completion modal
    showCompletionResults(finalStats);
    
    updateCommanderMessage("Mission completed! You've successfully defended the city's critical infrastructure against The Null's coordinated attack. Excellent work, Nova!");
}

function calculateFinalStats() {
    const totalTime = gameState.missionStartTime ? Date.now() - gameState.missionStartTime : 0;
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    
    const avgHealth = Object.values(gameState.infrastructureHealth)
        .reduce((sum, health) => sum + health, 0) / Object.keys(gameState.infrastructureHealth).length;
    
    return {
        survivalTime: `${minutes}:${seconds.toString().padStart(2, '0')}`,
        avgHealth: Math.round(avgHealth),
        mitigationsDeployed: gameState.mitigationsDeployed,
        attacksMitigated: gameState.attacksMitigated,
        ipsBlocked: gameState.ipsBlocked,
        defenseScore: calculateDefenseScore(avgHealth, gameState.mitigationsDeployed, totalTime)
    };
}

function calculateDefenseScore(avgHealth, mitigations, timeMs) {
    const healthScore = avgHealth; // 0-100
    const mitigationScore = Math.min(50, mitigations * 5); // 0-50
    const timeBonus = Math.max(0, 50 - (timeMs / 60000)); // Bonus for quick response
    
    return Math.round(healthScore + mitigationScore + timeBonus);
}

function showCompletionResults(stats) {
    const modal = document.getElementById('results-modal');
    const icon = document.getElementById('result-icon');
    const title = document.getElementById('result-title');
    const message = document.getElementById('result-message');
    const feedback = document.getElementById('result-feedback');
    
    if (stats.avgHealth >= 50) {
        icon.textContent = '🏆';
        title.textContent = 'Defense Successful!';
        message.textContent = 'You successfully defended the city against The Null\'s DDoS assault.';
    } else if (stats.avgHealth >= 30) {
        icon.textContent = '⚡';
        title.textContent = 'Partial Success';
        message.textContent = 'Critical infrastructure survived but with significant damage.';
    } else {
        icon.textContent = '💥';
        title.textContent = 'Mission Failed';
        message.textContent = 'Critical infrastructure was severely compromised.';
    }
    
    feedback.innerHTML = `
        <div class="text-left space-y-3">
            <div class="bg-slate-800 rounded p-3">
                <div class="text-white font-semibold mb-2">Mission Statistics</div>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <div class="text-gray-400">Survival Time</div>
                        <div class="text-cyan-400 font-mono">${stats.survivalTime}</div>
                    </div>
                    <div>
                        <div class="text-gray-400">Avg. Health</div>
                        <div class="text-${stats.avgHealth >= 50 ? 'green' : stats.avgHealth >= 30 ? 'yellow' : 'red'}-400">${stats.avgHealth}%</div>
                    </div>
                    <div>
                        <div class="text-gray-400">Mitigations</div>
                        <div class="text-blue-400">${stats.mitigationsDeployed}</div>
                    </div>
                    <div>
                        <div class="text-gray-400">IPs Blocked</div>
                        <div class="text-purple-400">${stats.ipsBlocked.toLocaleString()}</div>
                    </div>
                </div>
            </div>
            
            <div class="bg-blue-900/30 border border-blue-600 rounded p-3">
                <div class="text-blue-300 font-semibold mb-2">Defense Score: ${stats.defenseScore}/200</div>
                <div class="text-blue-200 text-sm">
                    ${stats.defenseScore >= 150 ? 'Outstanding defense coordination!' :
                      stats.defenseScore >= 100 ? 'Good defensive response.' :
                      'Room for improvement in defense strategy.'}
                </div>
            </div>
            
            ${stats.avgHealth >= 50 ? `
                <div class="bg-green-900/30 border border-green-600 rounded p-3">
                    <div class="text-green-300 font-semibold mb-2">🎖️ Badge Earned</div>
                    <div class="text-green-200 text-sm">DDoS Defense Specialist - Successfully protected critical infrastructure</div>
                </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Export functions for external access
window.Level9 = {
    startMission,
    completeLevel,
    resetLevel: () => {
        stopAttackSimulation();
        resetGameState();
        updateGameMetrics();
    }
};
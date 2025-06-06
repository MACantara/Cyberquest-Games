import { gameState, updateInfrastructureVisuals } from './gameState.js';
import { updateCommanderMessage, showResultModal } from './uiUpdates.js';

export function handleEmergencyBlackhole() {
    gameState.attacksMitigated += 5;
    gameState.ipsBlocked += 100;
    showResultModal('🕳️', 'Emergency Blackhole Activated', 
        'Redirected all attack traffic to null route.',
        '<div class="text-orange-400">Extreme measure deployed. Attack stopped but some legitimate traffic may be affected.</div>'
    );
    updateCommanderMessage("Blackhole route deployed. Attack traffic neutralized but monitor for collateral impact on legitimate users.");
}

export function handleFailoverActivate() {
    Object.keys(gameState.infrastructureHealth).forEach(key => {
        gameState.infrastructureHealth[key] = Math.min(100, gameState.infrastructureHealth[key] + 30);
    });
    showResultModal('🔄', 'Failover Systems Activated', 
        'Backup systems brought online across all infrastructure.',
        '<div class="text-blue-400">Redundant systems active. Service continuity maintained during attack.</div>'
    );
    updateCommanderMessage("Failover systems online. We've bought time to implement more targeted defenses.");
    updateInfrastructureVisuals();
}

export function handleTraceSource() {
    showResultModal('🔍', 'Attack Source Traced', 
        'Botnet command and control servers identified.',
        '<div class="text-purple-400">C2 servers located at coordinates matching known Null infrastructure. This attack originated from within academy systems.</div>'
    );
    updateCommanderMessage("Nova, this is disturbing. The attack source traces back to our own simulation grid. Someone inside is working with The Null.");
}

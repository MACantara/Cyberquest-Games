import { gameState, updateGameMetrics } from './gameState.js';
import { loadInfrastructure, selectInfrastructureNode, closeDefensePanel } from './infrastructureHandler.js';
import { handleDefenseTool, executeCommand } from './defenseTools.js';
import { handleEmergencyBlackhole, handleFailoverActivate, handleTraceSource } from './emergencyActions.js';
import { startAttackSimulation, generateInitialAlerts } from './attackSimulation.js';
import { updateCommanderMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load infrastructure data
    await loadInfrastructure();
    
    // Initialize game
    function initGame() {
        showTutorial();
        updateGameMetrics();
        generateInitialAlerts();
        startAttackSimulation();
    }

    // Tutorial system
    function showTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-infrastructure').classList.remove('hidden');
            updateCommanderMessage("Start with Emergency Services - they're taking the heaviest hit. Every second of downtime could cost lives. Click the red node to begin defense.");
        }, 2000);
    }

    // Event Listeners
    // Infrastructure node selection
    document.querySelectorAll('.infrastructure-node').forEach(node => {
        node.addEventListener('click', function() {
            const nodeId = this.dataset.node;
            selectInfrastructureNode(nodeId);
            
            // Visual feedback
            document.querySelectorAll('.infrastructure-node').forEach(n => n.classList.remove('ring-2', 'ring-cyan-400'));
            this.classList.add('ring-2', 'ring-cyan-400');
        });
    });

    // Defense tools
    document.querySelectorAll('.defense-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentNode) {
                handleDefenseTool(toolType);
                this.classList.add('opacity-50');
                this.disabled = true;
                
                // Re-enable after 3 seconds
                setTimeout(() => {
                    this.classList.remove('opacity-50');
                    this.disabled = false;
                }, 3000);
            }
        });
    });

    // Command console
    document.getElementById('execute-command').addEventListener('click', function() {
        const command = document.getElementById('command-input').value.trim();
        if (command) {
            executeCommand(command);
            document.getElementById('command-input').value = '';
        }
    });

    // Emergency actions
    document.getElementById('emergency-blackhole').addEventListener('click', handleEmergencyBlackhole);
    document.getElementById('failover-activate').addEventListener('click', handleFailoverActivate);
    document.getElementById('trace-source').addEventListener('click', handleTraceSource);

    // Modal and UI event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('close-defense').addEventListener('click', closeDefensePanel);

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '🕵️',
            'Disturbing Discovery',
            'While cleaning SOC logs, you discover a digital fingerprint...',
            `
                <div class="text-left bg-purple-900 border border-purple-600 rounded p-3">
                    <p class="text-purple-300 font-semibold">🔍 FINAL REVELATION</p>
                    <p class="text-purple-200 text-sm mt-2">"It's not from The Null—but from someone within the InterWorld Cyber Academy. The call is coming from inside the house."</p>
                    <p class="text-gray-400 text-xs mt-2">Commander Vega: "We've traced the origin of this malware strain. You'll be leading the final assault."</p>
                </div>
                <p class="text-cyan-400 text-sm mt-3">Ready for the Final Level: The Hunt for The Null?</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/level/10';
        };
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});
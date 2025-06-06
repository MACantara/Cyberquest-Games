import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let systems = {};

export async function loadSystems() {
    try {
        const response = await fetch('/static/js/levels/level-3/data/systems.json');
        systems = await response.json();
    } catch (error) {
        console.error('Failed to load systems:', error);
    }
}

export function selectSystem(systemId) {
    gameState.currentSystem = systems[systemId];
    displaySystemAnalysis(gameState.currentSystem);
    
    // Start corruption effects if infected system
    if (gameState.currentSystem.status === 'infected' && window.startCorruptionEffects) {
        window.startCorruptionEffects();
    }
    
    if (systemId === 2) {
        updateMentorMessage("Critical infection detected! Notice the high CPU usage and file encryption. This system needs immediate containment.");
    }
}

export function displaySystemAnalysis(system) {
    document.getElementById('system-analysis').classList.remove('hidden');
    
    // Update window title and system info
    document.getElementById('analysis-title').textContent = `${system.name} - Analysis`;
    document.getElementById('system-name').textContent = system.name;
    document.getElementById('player-name').textContent = system.player;
    document.getElementById('system-status').textContent = system.status.toUpperCase();
    
    // Update status indicator
    const statusIndicator = document.getElementById('status-indicator');
    const threatLevel = document.getElementById('threat-level');
    
    switch(system.status) {
        case 'clean':
            statusIndicator.className = 'w-3 h-3 rounded-full bg-green-500';
            threatLevel.textContent = 'LOW';
            threatLevel.className = 'text-green-600';
            break;
        case 'infected':
            statusIndicator.className = 'w-3 h-3 rounded-full bg-red-500 animate-ping';
            threatLevel.textContent = 'CRITICAL';
            threatLevel.className = 'text-red-600';
            break;
        case 'suspicious':
            statusIndicator.className = 'w-3 h-3 rounded-full bg-yellow-500';
            threatLevel.textContent = 'MEDIUM';
            threatLevel.className = 'text-yellow-600';
            break;
    }
    
    // Update process monitor with real-time effect
    updateProcessMonitor(system);
    
    // Update file corruption display
    updateFileCorruption(system);
    
    // Reset analysis state
    gameState.analysisSteps[system.id] = {};
    document.getElementById('analysis-results').classList.add('hidden');
    document.getElementById('response-panel').classList.add('hidden');
    
    // Reset tools
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.classList.remove('opacity-50');
        tool.disabled = false;
    });
}

function updateProcessMonitor(system) {
    const monitor = document.getElementById('process-monitor');
    let processes = [];
    
    if (system.status === 'infected') {
        if (system.malwareType === 'trojan') {
            processes = [
                'vr_engine.exe        PID:1024   CPU: 12%',
                '<span class="text-red-400 animate-pulse">Performance_Boost.exe  PID:2456   CPU: 95%</span>',
                'system_service.exe   PID:1256   CPU: 3%',
                '<span class="text-yellow-400">malware_dropper.exe   PID:3789   CPU: 45%</span>',
                '<span class="text-red-400">crypto_miner.exe      PID:4012   CPU: 78%</span>'
            ];
        } else if (system.malwareType === 'spyware') {
            processes = [
                'vr_engine.exe        PID:1024   CPU: 12%',
                '<span class="text-red-400 animate-pulse">keylogger.exe        PID:2234   CPU: 25%</span>',
                'system_service.exe   PID:1256   CPU: 3%',
                '<span class="text-yellow-400">data_harvester.exe   PID:3456   CPU: 35%</span>'
            ];
        }
    } else {
        processes = [
            'vr_engine.exe        PID:1024   CPU: 12%',
            'graphics_driver.dll  PID:1256   CPU: 8%',
            'audio_service.exe    PID:1789   CPU: 3%',
            'system_idle_process  PID:0      CPU: 77%'
        ];
    }
    
    monitor.innerHTML = processes.join('<br>');
    
    // Animate process updates
    if (system.status === 'infected') {
        setInterval(() => {
            const maliciousProcesses = monitor.querySelectorAll('.text-red-400');
            maliciousProcesses.forEach(proc => {
                const cpuMatch = proc.textContent.match(/CPU: (\d+)%/);
                if (cpuMatch) {
                    const newCpu = Math.min(parseInt(cpuMatch[1]) + Math.floor(Math.random() * 10), 99);
                    proc.innerHTML = proc.innerHTML.replace(/CPU: \d+%/, `CPU: ${newCpu}%`);
                }
            });
        }, 2000);
    }
}

function updateFileCorruption(system) {
    const fileCorruption = document.getElementById('file-corruption');
    let files = [];
    
    if (system.status === 'infected') {
        files = [
            { name: 'player_data.json', status: 'OK', class: 'text-green-600' },
            { name: 'game_save.dat.locked', status: 'ENCRYPTED', class: 'text-red-600 line-through' },
            { name: 'config.ini', status: 'MODIFIED', class: 'text-yellow-600' },
            { name: 'credentials.txt.enc', status: 'ENCRYPTED', class: 'text-red-600 line-through' }
        ];
    } else if (system.status === 'suspicious') {
        files = [
            { name: 'player_data.json', status: 'OK', class: 'text-green-600' },
            { name: 'game_save.dat', status: 'OK', class: 'text-green-600' },
            { name: 'config.ini', status: 'MODIFIED', class: 'text-yellow-600' }
        ];
    } else {
        files = [
            { name: 'player_data.json', status: 'OK', class: 'text-green-600' },
            { name: 'game_save.dat', status: 'OK', class: 'text-green-600' },
            { name: 'config.ini', status: 'OK', class: 'text-green-600' }
        ];
    }
    
    fileCorruption.innerHTML = files.map(file => `
        <div class="flex justify-between">
            <span class="${file.class}">${file.name}</span>
            <span class="${file.class}">${file.status}</span>
        </div>
    `).join('');
}

export function closeSystem() {
    document.getElementById('system-analysis').classList.add('hidden');
    gameState.currentSystem = null;
    
    // Stop corruption effects
    if (window.stopCorruptionEffects) {
        window.stopCorruptionEffects();
    }
}

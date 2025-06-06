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
    document.getElementById('tutorial-systems').classList.add('hidden');
    
    if (systemId === 2) {
        updateMentorMessage("Good choice! This system is clearly compromised. Use the analysis tools to identify the malware type and find the best containment method.");
    }
}

export function displaySystemAnalysis(system) {
    document.getElementById('system-placeholder').classList.add('hidden');
    document.getElementById('system-analysis').classList.remove('hidden');
    
    document.getElementById('system-name').textContent = `${system.name} (${system.player})`;
    
    // Update status icon
    const statusIcon = document.getElementById('system-status-icon');
    switch(system.status) {
        case 'clean':
            statusIcon.className = 'w-4 h-4 rounded-full bg-green-400 animate-pulse';
            break;
        case 'infected':
            statusIcon.className = 'w-4 h-4 rounded-full bg-red-400 animate-ping';
            break;
        case 'suspicious':
            statusIcon.className = 'w-4 h-4 rounded-full bg-yellow-400';
            break;
    }
    
    // Populate process list
    populateProcessList(system);
    populateFileList(system);
    
    // Reset analysis state
    gameState.analysisSteps[system.id] = {};
    document.getElementById('analysis-results').classList.add('hidden');
    document.getElementById('response-panel').classList.add('hidden');
    
    // Reset tool states
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.classList.remove('opacity-50');
        tool.disabled = false;
    });
}

export function populateProcessList(system) {
    const processList = document.getElementById('process-list');
    let processes = [];
    
    if (system.status === 'infected') {
        if (system.malwareType === 'trojan') {
            processes = [
                { name: 'vr_engine.exe', status: 'normal', pid: '1024' },
                { name: 'performance_boost.exe', status: 'suspicious', pid: '2456' },
                { name: 'system32.exe', status: 'malicious', pid: '3789' }
            ];
        } else if (system.malwareType === 'spyware') {
            processes = [
                { name: 'vr_engine.exe', status: 'normal', pid: '1024' },
                { name: 'keylogger.dll', status: 'malicious', pid: '2234' },
                { name: 'vroptimizer.dll', status: 'suspicious', pid: '3456' }
            ];
        }
    } else {
        processes = [
            { name: 'vr_engine.exe', status: 'normal', pid: '1024' },
            { name: 'graphics_driver.dll', status: 'normal', pid: '1256' },
            { name: 'audio_service.exe', status: 'normal', pid: '1789' }
        ];
    }
    
    processList.innerHTML = processes.map(proc => `
        <div class="flex justify-between items-center text-xs p-2 rounded ${
            proc.status === 'malicious' ? 'bg-red-800' : 
            proc.status === 'suspicious' ? 'bg-yellow-800' : 'bg-gray-700'
        }">
            <span class="text-white">${proc.name}</span>
            <span class="text-gray-400">PID: ${proc.pid}</span>
        </div>
    `).join('');
}

export function populateFileList(system) {
    const fileList = document.getElementById('file-list');
    let files = [];
    
    if (system.status === 'infected') {
        files = [
            { name: 'Performance_Boost.exe', hash: 'a3f5d9c2e1...', threat: 'HIGH' },
            { name: 'temp_cache.tmp', hash: 'b7e2c1a9f3...', threat: 'MEDIUM' }
        ];
    } else if (system.status === 'suspicious') {
        files = [
            { name: 'VROptimizer.dll', hash: 'b7e2c1a9f3...', threat: 'MEDIUM' }
        ];
    }
    
    fileList.innerHTML = files.length > 0 ? files.map(file => `
        <div class="bg-red-800 border border-red-600 rounded p-2">
            <div class="flex justify-between items-start">
                <div>
                    <h6 class="text-red-300 font-semibold text-xs">${file.name}</h6>
                    <p class="text-red-200 text-xs">Hash: ${file.hash}</p>
                </div>
                <span class="text-xs bg-red-600 text-white px-2 py-1 rounded">${file.threat}</span>
            </div>
        </div>
    `).join('') : '<p class="text-gray-400 text-xs">No suspicious files detected</p>';
}

export function closeSystem() {
    document.getElementById('system-analysis').classList.add('hidden');
    document.getElementById('system-placeholder').classList.remove('hidden');
    gameState.currentSystem = null;
}

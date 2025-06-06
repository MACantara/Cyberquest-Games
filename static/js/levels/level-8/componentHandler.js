import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let components = {};

export async function loadComponents() {
    try {
        const response = await fetch('/static/js/levels/level-8/data/components.json');
        components = await response.json();
    } catch (error) {
        console.error('Failed to load components:', error);
    }
}

export function selectComponent(componentId) {
    gameState.currentComponent = components[componentId];
    displayVulnerabilityAnalysis(gameState.currentComponent);
    document.getElementById('tutorial-scanner').classList.add('hidden');
    
    if (componentId === 1) {
        updateMentorMessage("This is the most critical vulnerability. Session hijacking could allow complete vote manipulation. How you handle this discovery will test your ethical foundation.");
    }
}

export function displayVulnerabilityAnalysis(component) {
    document.getElementById('analysis-placeholder').classList.add('hidden');
    document.getElementById('vulnerability-panel').classList.remove('hidden');
    
    document.getElementById('component-name').textContent = component.name;
    document.getElementById('vulnerability-details').innerHTML = `
        <div class="space-y-2">
            <p><strong>Vulnerability:</strong> ${component.vulnerability}</p>
            <p><strong>Severity:</strong> <span class="text-${component.severity === 'CRITICAL' ? 'red' : component.severity === 'HIGH' ? 'orange' : 'yellow'}-400">${component.severity}</span></p>
            <p class="mt-2">${component.details}</p>
        </div>
    `;
    
    // Reset analysis state
    document.getElementById('report-builder').classList.add('hidden');
    document.querySelectorAll('.analysis-tool').forEach(tool => {
        tool.classList.remove('opacity-50');
        tool.disabled = false;
    });
}

export function closeComponentAnalysis() {
    document.getElementById('vulnerability-panel').classList.add('hidden');
    document.getElementById('analysis-placeholder').classList.remove('hidden');
    gameState.currentComponent = null;
}

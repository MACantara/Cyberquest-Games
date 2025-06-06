import { gameState, updateGameMetrics } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export function handleAnalysisTool(toolType) {
    const component = gameState.currentComponent;
    
    switch(toolType) {
        case 'test':
            document.getElementById('exploitation-steps').innerHTML = component.exploitation.map(step => `
                <div class="flex items-start gap-2 text-sm">
                    <span class="text-orange-400">→</span>
                    <span class="text-gray-200">${step}</span>
                </div>
            `).join('');
            updateMentorMessage("Exploit test successful. You've confirmed the vulnerability is real and exploitable.");
            break;
            
        case 'document':
            gameState.vulnerabilitiesFound++;
            updateMentorMessage("Vulnerability documented. Now you need to decide how to disclose this information responsibly.");
            break;
            
        case 'assess':
            document.getElementById('impact-assessment').innerHTML = component.impact.map(impact => `
                <div class="flex items-start gap-2 text-sm">
                    <i class="bi bi-exclamation-triangle text-red-400"></i>
                    <span class="text-gray-200">${impact}</span>
                </div>
            `).join('');
            updateMentorMessage(`${component.severity} severity confirmed. This vulnerability poses serious risks to election integrity.`);
            break;
            
        case 'suggest':
            showReportBuilder();
            updateMentorMessage("Report ready for submission. Choose your disclosure method carefully - this decision defines your character.");
            break;
    }
    
    updateGameMetrics();
}

export function showReportBuilder() {
    const component = gameState.currentComponent;
    document.getElementById('report-builder').classList.remove('hidden');
    
    document.getElementById('report-content').innerHTML = `
        <div class="bg-gray-800 rounded p-3 space-y-2 text-sm">
            <div><strong>CVE-2024-${component.id}001:</strong> ${component.vulnerability} in ${component.name}</div>
            <div><strong>Severity:</strong> ${component.severity}</div>
            <div><strong>CVSS Score:</strong> ${component.severity === 'CRITICAL' ? '9.8' : component.severity === 'HIGH' ? '7.5' : '5.3'}</div>
            <div><strong>Affected System:</strong> CivitasVote v2.1</div>
            <div><strong>Disclosure Date:</strong> ${new Date().toISOString().split('T')[0]}</div>
            <div><strong>Reporter:</strong> Academy Cadet Nova</div>
        </div>
    `;
}

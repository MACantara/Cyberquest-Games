import { updateMentorMessage } from '../../uiUpdates.js';

export function clearTerminal(output) {
    output.innerHTML = '';
    updateMentorMessage("Terminal cleared. Ready for next security assessment.");
}

export function showCommandNotFound(output, command) {
    output.innerHTML += `
        <div class="text-red-400 mb-2">
            <div>Command not found: ${command}</div>
            <div class="text-xs text-gray-400 mt-1">Type 'help' to see available commands</div>
        </div>
    `;
}

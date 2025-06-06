import { memories } from './dataLoader.js';
import { showResultModal } from './uiUpdates.js';

export function setupMemoryWallInteractions() {
    document.querySelectorAll('.memory-item').forEach(item => {
        item.addEventListener('click', function() {
            const mission = this.dataset.mission;
            showMissionMemory(mission);
        });
    });
}

export function showMissionMemory(missionId) {
    const memory = memories[missionId];
    if (memory) {
        showResultModal(memory.icon, memory.title, 
            `<div class="text-left space-y-3">
                <p class="text-gray-300">${memory.description}</p>
                <div class="bg-blue-900 border border-blue-600 rounded p-3">
                    <h4 class="text-blue-300 font-semibold mb-2">Impact:</h4>
                    <p class="text-blue-200 text-sm">${memory.impact}</p>
                </div>
                <div class="bg-green-900 border border-green-600 rounded p-3">
                    <h4 class="text-green-300 font-semibold mb-2">Lesson Learned:</h4>
                    <p class="text-green-200 text-sm italic">"${memory.lesson}"</p>
                </div>
            </div>`
        );
    }
}

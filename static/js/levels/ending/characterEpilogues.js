import { epilogues } from './dataLoader.js';
import { endingState } from './gameState.js';
import { showResultModal } from './uiUpdates.js';

export function setupCharacterEpilogues() {
    document.querySelectorAll('.character-epilogue').forEach(item => {
        item.addEventListener('click', function() {
            const character = this.dataset.character;
            showCharacterEpilogue(character);
            endingState.characterViewed.push(character);
        });
    });
}

export function showCharacterEpilogue(characterId) {
    const epilogue = epilogues[characterId];
    if (epilogue) {
        showResultModal(epilogue.icon, epilogue.name + ' - Epilogue',
            `<div class="text-left space-y-3">
                <p class="text-gray-300">${epilogue.story}</p>
                <div class="bg-gray-700 rounded p-3">
                    <p class="text-cyan-300 text-sm italic">"${epilogue.quote}"</p>
                </div>
            </div>`
        );
    }
}

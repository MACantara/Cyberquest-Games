import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let stories = {};

export async function loadStories() {
    try {
        const response = await fetch('/static/js/levels/level-1/data/stories.json');
        stories = await response.json();
    } catch (error) {
        console.error('Failed to load stories:', error);
    }
}

export function selectStory(storyId) {
    gameState.currentStory = stories[storyId];
    displayStoryInWorkspace(gameState.currentStory);
    document.getElementById('tutorial-inbox').classList.add('hidden');
    
    if (storyId === 1) {
        updateMentorMessage("Good choice, Nova. This story has several red flags. Use the verification tools to analyze the headline, source, and any images. Start with the headline analyzer.");
    }
}

export function displayStoryInWorkspace(story) {
    const workspace = document.getElementById('workspace');
    const analysisPanel = document.getElementById('analysis-panel');
    
    workspace.innerHTML = `
        <div class="text-center p-4">
            <h4 class="text-white font-semibold mb-2">${story.headline}</h4>
            <p class="text-gray-400 text-sm">Source: ${story.source}</p>
            <div class="mt-3 flex items-center justify-center gap-4 text-sm">
                <span class="text-gray-500">Click verification tools below to analyze</span>
            </div>
        </div>
    `;
    
    analysisPanel.classList.remove('hidden');
    document.getElementById('story-details').innerHTML = `
        <div class="bg-gray-600 rounded p-3">
            <h5 class="font-medium text-white mb-2">${story.headline}</h5>
            <p class="text-gray-400 text-sm">Source: ${story.source}</p>
        </div>
    `;
}

export function resetWorkspace() {
    document.getElementById('workspace').innerHTML = `
        <i class="bi bi-arrow-down-circle text-4xl text-gray-500 mb-4"></i>
        <p class="text-gray-400 text-center">
            <strong>Select your next story to analyze</strong><br>
            <span class="text-sm">Keep up the good work, Nova!</span>
        </p>
    `;
    document.getElementById('analysis-panel').classList.add('hidden');
    gameState.currentStory = null;
    
    // Reset verification tools
    document.querySelectorAll('.verification-tool').forEach(tool => {
        tool.classList.remove('opacity-75');
        tool.disabled = false;
    });
}

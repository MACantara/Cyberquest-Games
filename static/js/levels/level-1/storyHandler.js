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
            <h4 class="text-gray-900 font-bold font-serif mb-3">${story.headline}</h4>
            <div class="bg-amber-200 border border-amber-400 rounded p-3 mb-3 text-left">
                <p class="text-gray-800 text-sm font-serif leading-relaxed">${story.fullContent}</p>
            </div>
            <div class="flex justify-center items-center gap-4 text-sm">
                <span class="text-gray-600 font-serif">Use verification tools below to analyze this story</span>
            </div>
        </div>
    `;
    
    analysisPanel.classList.remove('hidden');
    
    // Update story details with comprehensive information
    document.getElementById('story-details').innerHTML = `
        <div class="bg-amber-100 border border-amber-300 rounded p-3">
            <h5 class="font-bold font-serif text-gray-900 mb-2">${story.headline}</h5>
            <div class="grid grid-cols-2 gap-4 text-xs font-serif text-gray-700">
                <div>
                    <p><strong>Source:</strong> ${story.source}</p>
                    <p><strong>Published:</strong> ${story.publishTime}</p>
                    <p><strong>Domain:</strong> ${story.domain}</p>
                    <p><strong>Content:</strong> ${story.fullContent.substring(0, 100)}...</p>
                </div>
                <div>
                    <p><strong>Shares:</strong> ${story.shares}</p>
                    <p><strong>Status:</strong> <span class="px-1 py-0.5 rounded text-white text-xs ${getStatusColor(story.verification)}">${story.verification}</span></p>
                    <p><strong>Category:</strong> ${story.category}</p>
                    <p><strong>Images:</strong> ${story.images.hasImages ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </div>
    `;
}

function getStatusColor(status) {
    switch(status) {
        case 'VERIFIED': return 'bg-green-600';
        case 'UNVERIFIED': return 'bg-red-600';
        case 'CLICKBAIT': return 'bg-yellow-600';
        default: return 'bg-gray-600';
    }
}

export function resetWorkspace() {
    document.getElementById('workspace').innerHTML = `
        <div class="text-center text-gray-600">
            <i class="bi bi-arrow-down-circle text-4xl text-amber-600 mb-4"></i>
            <p class="text-gray-700 text-center font-serif">
                <strong class="text-gray-900">Select your next story to analyze</strong><br>
                <span class="text-sm">Keep up the good work, Nova!</span>
            </p>
        </div>
    `;
    document.getElementById('analysis-panel').classList.add('hidden');
    gameState.currentStory = null;
    
    // Reset verification tools
    document.querySelectorAll('.verification-tool').forEach(tool => {
        tool.classList.remove('opacity-75');
        tool.disabled = false;
    });
}

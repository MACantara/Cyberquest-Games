import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let posts = {};

export async function loadPosts() {
    try {
        const response = await fetch('/static/js/levels/level-5/data/posts.json');
        posts = await response.json();
    } catch (error) {
        console.error('Failed to load posts:', error);
    }
}

export function selectPost(postId) {
    gameState.currentPost = posts[postId];
    displayPostAnalysis(gameState.currentPost);
    document.getElementById('tutorial-feed').classList.add('hidden');
    
    if (postId === 1) {
        updateMentorMessage("This is the root of the crisis. Echo shared private DMs without consent. This violates digital ethics and damages trust. How should we address this?");
    }
}

export function displayPostAnalysis(post) {
    document.getElementById('analysis-placeholder').classList.add('hidden');
    document.getElementById('post-analysis').classList.remove('hidden');
    
    document.getElementById('post-author').textContent = post.author;
    document.getElementById('post-content').innerHTML = `<p class="text-gray-200 text-sm">${post.content}</p>`;
    
    // Populate privacy flags
    const privacyFlags = document.getElementById('privacy-flags');
    if (post.privacyFlags.length > 0) {
        privacyFlags.innerHTML = post.privacyFlags.map(flag => `
            <div class="flex items-center gap-2 text-xs">
                <i class="bi bi-exclamation-triangle text-red-400"></i>
                <span class="text-red-300">${flag}</span>
            </div>
        `).join('');
    } else {
        privacyFlags.innerHTML = '<div class="text-green-400 text-xs">No privacy concerns detected</div>';
    }
    
    // Populate ethical concerns
    const ethicalConcerns = document.getElementById('ethical-concerns');
    if (post.ethicalConcerns.length > 0) {
        ethicalConcerns.innerHTML = post.ethicalConcerns.map(concern => `
            <div class="flex items-center gap-2 text-xs">
                <i class="bi bi-exclamation-circle text-orange-400"></i>
                <span class="text-orange-300">${concern}</span>
            </div>
        `).join('');
    } else {
        ethicalConcerns.innerHTML = '<div class="text-green-400 text-xs">No ethical concerns detected</div>';
    }
    
    // Reset analysis state
    gameState.analysisSteps[post.id] = {};
    document.getElementById('analysis-results').classList.add('hidden');
    document.getElementById('response-panel').classList.add('hidden');
    
    // Reset tool states
    document.querySelectorAll('.action-tool').forEach(tool => {
        tool.classList.remove('opacity-50');
        tool.disabled = false;
    });
}

export function closePostAnalysis() {
    document.getElementById('post-analysis').classList.add('hidden');
    document.getElementById('analysis-placeholder').classList.remove('hidden');
    gameState.currentPost = null;
}

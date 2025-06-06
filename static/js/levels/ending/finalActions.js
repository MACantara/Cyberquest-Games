import { showResultModal } from './uiUpdates.js';

export function handleReplayCampaign() {
    if (confirm('This will start a new campaign. Continue?')) {
        window.location.href = '/campaign';
    }
}

export function showArchives() {
    showResultModal('📚', 'Academy Archives',
        `<div class="text-left space-y-3">
            <div class="bg-gray-700 rounded p-3">
                <h4 class="text-cyan-300 font-semibold mb-2">Mission Database</h4>
                <p class="text-gray-300 text-sm">Complete records of all 10 missions, including alternate scenarios and outcomes.</p>
            </div>
            <div class="bg-gray-700 rounded p-3">
                <h4 class="text-cyan-300 font-semibold mb-2">Character Profiles</h4>
                <p class="text-gray-300 text-sm">Detailed backgrounds on Academy personnel, allies, and adversaries.</p>
            </div>
            <div class="bg-gray-700 rounded p-3">
                <h4 class="text-cyan-300 font-semibold mb-2">Threat Intelligence</h4>
                <p class="text-gray-300 text-sm">Comprehensive analysis of The Null organization and their methodologies.</p>
            </div>
            <div class="bg-gray-700 rounded p-3">
                <h4 class="text-cyan-300 font-semibold mb-2">Ethics Framework</h4>
                <p class="text-gray-300 text-sm">The moral philosophy and decision-making frameworks developed through your journey.</p>
            </div>
        </div>`
    );
}

export function showCredits() {
    showResultModal('🎬', 'Credits',
        `<div class="text-center space-y-4">
            <div class="bg-gradient-to-r from-purple-900 to-indigo-900 rounded p-4">
                <h3 class="text-xl font-bold text-cyan-300 mb-2">CyberQuest: Shadows of the Net</h3>
                <p class="text-gray-300">A gamified learning experience for digital literacy and cybersecurity awareness</p>
            </div>
            <div class="space-y-2 text-sm">
                <p class="text-gray-300"><strong>Created for:</strong> Digital Citizens Everywhere</p>
                <p class="text-gray-300"><strong>Mission:</strong> Building a More Secure Digital World</p>
                <p class="text-gray-300"><strong>Remember:</strong> In the shadows of the net, vigilance is our light</p>
            </div>
            <div class="bg-black bg-opacity-50 rounded p-3">
                <p class="text-cyan-400 font-semibold">Thank you for playing, Cyber Sentinel.</p>
                <p class="text-cyan-300 text-sm">The digital frontier is safer because of you.</p>
            </div>
        </div>`
    );
    
    document.getElementById('close-result').onclick = function() {
        window.location.href = '/';
    };
}

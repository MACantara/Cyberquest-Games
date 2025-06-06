import { gameState, updateMetrics, startSocialMetrics } from './gameState.js';
import { loadPosts, selectPost, closePostAnalysis } from './postHandler.js';
import { handleAnalysisTool } from './analysisTools.js';
import { handleResponse } from './responseHandler.js';
import { updateMentorMessage, showResultModal } from './uiUpdates.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Load post data
    await loadPosts();
    
    // Initialize game
    function initGame() {
        startSocialMetrics();
        updateMetrics();
        showCrisisTutorial();
        startViralSpreadSimulation();
    }

    // Crisis-specific tutorial system
    function showCrisisTutorial() {
        setTimeout(() => {
            document.getElementById('tutorial-feed').classList.remove('hidden');
            updateMentorMessage("Emergency: Echo's post about Alex's private struggles has gone viral! This privacy violation is destroying trust and relationships. Start with the red-bordered post that triggered this crisis.");
        }, 2000);
        
        // Add pulsing effect to the crisis post
        setTimeout(() => {
            const crisisPost = document.querySelector('[data-post="1"]');
            if (crisisPost) {
                crisisPost.classList.add('animate-pulse');
            }
        }, 3000);
    }

    // Simulate real-time viral spread and community reactions
    function startViralSpreadSimulation() {
        // Crisis escalation timer
        let crisisTimer = 0;
        const maxCrisisTime = 300; // 5 minutes until crisis peaks
        
        const escalationInterval = setInterval(() => {
            crisisTimer++;
            
            // Only escalate if crisis hasn't been addressed
            if (!gameState.completedPosts.includes(1) && crisisTimer < maxCrisisTime) {
                // Increase viral spread
                gameState.viralSpread = Math.min(gameState.viralSpread + 0.8, 100);
                
                // Decrease trust as crisis continues
                gameState.trustLevel = Math.max(gameState.trustLevel - 0.5, 0);
                
                // Increase privacy violations
                gameState.privacyScore = Math.max(gameState.privacyScore - 0.3, 0);
                
                // Show escalation notifications
                if (crisisTimer % 60 === 0) { // Every minute
                    showCrisisUpdate();
                }
                
                updateMetrics();
            } else {
                clearInterval(escalationInterval);
            }
        }, 1000);
    }

    function showCrisisUpdate() {
        const updates = [
            "🚨 Crisis Update: Alex's family is receiving harassing phone calls",
            "📱 Alert: Private DMs shared 50+ more times in last minute",
            "⚠️ Warning: Community trust declining as controversy spreads",
            "🔄 Notice: Fake content variants appearing across platforms",
            "💬 Update: Support groups forming but being overwhelmed by trolls"
        ];
        
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        createSocialNotification(randomUpdate, 'crisis');
    }

    function createSocialNotification(message, type) {
        const notification = document.createElement('div');
        const typeStyles = {
            crisis: 'border-red-500 bg-red-100 text-red-800',
            support: 'border-green-500 bg-green-100 text-green-800',
            info: 'border-blue-500 bg-blue-100 text-blue-800'
        };
        
        notification.className = `fixed top-20 right-4 w-80 p-3 border-2 ${typeStyles[type]} rounded-lg shadow-lg z-40 animate-slide-in`;
        notification.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="font-medium text-sm">${message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-gray-600 hover:text-gray-800 ml-2">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Event Listeners
    // Post selection with visual feedback
    document.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('click', function() {
            const postId = parseInt(this.dataset.post);
            selectPost(postId);
            
            // Visual feedback - highlight selected post
            document.querySelectorAll('.post-item').forEach(p => {
                p.classList.remove('ring-2', 'ring-cyan-400');
            });
            this.classList.add('ring-2', 'ring-cyan-400');
            
            // Scroll to analysis panel on mobile
            const analysisPanel = document.getElementById('post-analysis');
            if (window.innerWidth < 768 && !analysisPanel.classList.contains('hidden')) {
                analysisPanel.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Analysis tools
    document.querySelectorAll('.action-tool').forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            if (gameState.currentPost) {
                handleAnalysisTool(toolType);
                
                // Visual feedback
                this.classList.add('opacity-50');
                this.disabled = true;
            }
        });
    });

    // Response actions with confirmation for critical actions
    document.querySelectorAll('.response-action').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            
            // Confirm destructive actions
            if (action === 'report' && gameState.currentPost?.type === 'blackmail_threat') {
                if (confirm('⚠️ Report Criminal Content\n\nThis will escalate to law enforcement. Continue?')) {
                    handleResponse(action);
                }
            } else {
                handleResponse(action);
            }
            
            // Disable all response buttons after selection
            document.querySelectorAll('.response-action').forEach(btn => {
                btn.disabled = true;
                btn.classList.add('opacity-50');
            });
        });
    });

    // Modal and UI event handlers
    document.getElementById('start-mission').addEventListener('click', function() {
        document.getElementById('cutscene-modal').classList.add('hidden');
        initGame();
        
        updateMentorMessage("Crisis management activated! You're now Nova, emergency moderator. The situation is escalating rapidly - act fast but think carefully about the ethical implications of each action.");
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        document.getElementById('results-modal').classList.add('hidden');
    });

    document.getElementById('close-analysis').addEventListener('click', closePostAnalysis);

    document.getElementById('complete-level').addEventListener('click', function() {
        showResultModal(
            '🌐',
            'Crisis Resolved!',
            'Social media storm weathered successfully. Community healing can begin.',
            `
                <div class="text-left bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <i class="bi bi-people text-green-600 text-lg"></i>
                        <div>
                            <p class="text-green-800 font-semibold">🏆 SOCIAL CRISIS RESOLVED</p>
                            <p class="text-green-700 text-sm mt-2">Your ethical moderation helped restore community trust, support the victim, and establish healthier digital communication patterns.</p>
                            <div class="mt-3 text-xs text-green-600 space-y-1">
                                <p>• Trust Level: ${gameState.trustLevel}%</p>
                                <p>• Viral Spread Contained: ${100 - gameState.viralSpread}%</p>
                                <p>• Privacy Score: ${gameState.privacyScore}%</p>
                                <p>• Posts Resolved: ${gameState.postsSecured}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="text-blue-600 text-sm mt-3 text-center font-medium">The Academy's social networks are secure once again.</p>
            `
        );
        
        document.getElementById('continue-btn').onclick = function() {
            window.location.href = '/campaign'; // Return to campaign map
        };
    });

    // Keyboard shortcuts for faster moderation
    document.addEventListener('keydown', function(e) {
        if (gameState.currentPost && !document.getElementById('response-panel').classList.contains('hidden')) {
            switch(e.key) {
                case '1':
                    document.querySelector('[data-action="mediate"]')?.click();
                    break;
                case '2':
                    document.querySelector('[data-action="educate"]')?.click();
                    break;
                case '3':
                    document.querySelector('[data-action="report"]')?.click();
                    break;
                case '4':
                    document.querySelector('[data-action="counter"]')?.click();
                    break;
            }
        }
    });

    // Show opening cutscene
    document.getElementById('cutscene-modal').classList.remove('hidden');
});
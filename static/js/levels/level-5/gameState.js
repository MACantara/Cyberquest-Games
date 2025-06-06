export const gameState = {
    trustLevel: 50,
    postsSecured: 0,
    viralSpread: 47,
    trollAccounts: 12,
    privacyScore: 25,
    currentPost: null,
    analysisSteps: {},
    completedPosts: []
};

export function updateMetrics() {
    // Ensure values stay within bounds
    gameState.trustLevel = Math.max(0, Math.min(100, gameState.trustLevel));
    gameState.viralSpread = Math.max(0, Math.min(100, gameState.viralSpread));
    gameState.privacyScore = Math.max(0, Math.min(100, gameState.privacyScore));
    gameState.trollAccounts = Math.max(0, gameState.trollAccounts);
    
    document.getElementById('trust-level').textContent = Math.round(gameState.trustLevel);
    document.getElementById('posts-secured').textContent = gameState.postsSecured;
    document.getElementById('viral-spread').textContent = Math.round(gameState.viralSpread);
    document.getElementById('troll-accounts').textContent = gameState.trollAccounts;
    document.getElementById('privacy-score').textContent = Math.round(gameState.privacyScore);
    
    // Update progress bars
    document.getElementById('trust-bar').style.width = gameState.trustLevel + '%';
    document.getElementById('privacy-bar').style.width = (100 - gameState.privacyScore) + '%';
    document.getElementById('viral-bar').style.width = gameState.viralSpread + '%';
    
    // Update status texts
    document.getElementById('trust-status').textContent = 
        gameState.trustLevel >= 75 ? 'Highly trusted' : 
        gameState.trustLevel >= 50 ? 'Moderately trusted' : 'Low trust';
        
    document.getElementById('privacy-status').textContent = 
        gameState.privacyScore >= 75 ? 'Well protected' : 
        gameState.privacyScore >= 50 ? 'Moderate exposure' : 'High risk exposure';
        
    document.getElementById('viral-status').textContent = 
        gameState.viralSpread >= 75 ? 'Crisis spreading' : 
        gameState.viralSpread >= 50 ? 'Moderate spread' : 'Contained';
}

export function startSocialMetrics() {
    setInterval(() => {
        // Simulate changing metrics based on user actions
        if (!gameState.completedPosts.includes(1)) {
            gameState.viralSpread += Math.random() * 2;
            gameState.privacyScore = Math.max(0, gameState.privacyScore - 1);
        }
        
        updateMetrics();
    }, 5000);
}

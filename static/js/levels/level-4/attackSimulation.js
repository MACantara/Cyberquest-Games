import { gameState, updateAttackStats } from './gameState.js';

export function startAttackSimulation(accounts) {
    setInterval(() => {
        gameState.loginAttempts++;
        updateAttackStats(accounts);
        
        // Simulate natural intensity fluctuation
        gameState.attackIntensity += (Math.random() - 0.5) * 10;
        gameState.attackIntensity = Math.max(0, Math.min(100, gameState.attackIntensity));
        
        document.getElementById('intensity-bar').style.width = gameState.attackIntensity + '%';
        document.getElementById('attempts-per-sec').textContent = 
            Math.floor(gameState.attackIntensity * 20) + ' attempts/sec';
        
    }, 2000);
}

export function startLoginFeed() {
    const loginFeed = document.getElementById('login-feed');
    const attemptTypes = [
        { type: 'failed', text: 'Failed login: admin.legacy@alumni', class: 'text-red-400' },
        { type: 'failed', text: 'Failed login: alex.wilson@alumni', class: 'text-red-400' },
        { type: 'blocked', text: 'MFA blocked: j.torres@alumni', class: 'text-green-400' },
        { type: 'suspicious', text: 'Suspicious IP: 185.220.101.45', class: 'text-yellow-400' }
    ];

    setInterval(() => {
        const attempt = attemptTypes[Math.floor(Math.random() * attemptTypes.length)];
        const timestamp = new Date().toLocaleTimeString();
        
        const logEntry = document.createElement('div');
        logEntry.className = 'flex justify-between text-xs p-2 bg-gray-800 rounded';
        logEntry.innerHTML = `
            <span class="${attempt.class}">${attempt.text}</span>
            <span class="text-gray-500">${timestamp}</span>
        `;
        
        loginFeed.insertBefore(logEntry, loginFeed.firstChild);
        
        // Keep only last 10 entries
        while (loginFeed.children.length > 10) {
            loginFeed.removeChild(loginFeed.lastChild);
        }
    }, 3000);
}

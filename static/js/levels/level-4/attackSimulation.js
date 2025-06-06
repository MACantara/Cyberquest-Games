import { gameState, updateAttackStats } from './gameState.js';

export function startAttackSimulation() {
    // Real-time attack statistics
    setInterval(() => {
        // Simulate login attempts with realistic patterns
        const attemptIncrease = Math.floor(Math.random() * 100) + 50;
        gameState.loginAttempts += attemptIncrease;
        
        // Update intensity based on time and player actions
        if (gameState.securedAccounts === 0) {
            gameState.attackIntensity = Math.min(gameState.attackIntensity + 2, 100);
        } else {
            gameState.attackIntensity = Math.max(gameState.attackIntensity - 1, 20);
        }
        
        updateAttackStats();
        
        // Show visual warnings for high intensity
        if (gameState.attackIntensity > 90) {
            createCriticalAlert('CRITICAL: Attack intensity at maximum! Immediate action required!');
        }
        
    }, 2000);
    
    // Simulate individual account attacks
    setInterval(() => {
        if (gameState.currentAccount && gameState.currentAccount.status === 'vulnerable') {
            simulateAccountAttack(gameState.currentAccount);
        }
    }, 1000);
}

export function startLoginFeed() {
    const loginFeed = document.getElementById('login-feed');
    
    const attackPatterns = [
        { type: 'failed', text: 'Failed: admin123', class: 'text-red-400', account: 'admin.legacy' },
        { type: 'failed', text: 'Failed: password123', class: 'text-red-400', account: 'alex.wilson' },
        { type: 'failed', text: 'Failed: administrator', class: 'text-red-400', account: 'admin.legacy' },
        { type: 'blocked', text: 'MFA blocked', class: 'text-green-400', account: 'j.torres' },
        { type: 'suspicious', text: 'Rate limit triggered', class: 'text-yellow-400', account: 'multiple' },
        { type: 'critical', text: 'Dictionary attack detected', class: 'text-red-400', account: 'admin.legacy' },
        { type: 'warning', text: 'Brute-force pattern identified', class: 'text-red-400', account: 'admin.legacy' }
    ];

    setInterval(() => {
        const pattern = attackPatterns[Math.floor(Math.random() * attackPatterns.length)];
        const timestamp = new Date().toLocaleTimeString();
        
        const logEntry = document.createElement('div');
        logEntry.className = 'flex justify-between text-xs p-2 bg-gray-900 rounded mb-1 animate-pulse';
        
        // Add special styling for critical attacks
        if (pattern.type === 'critical') {
            logEntry.classList.add('border', 'border-red-500', 'bg-red-950');
        }
        
        logEntry.innerHTML = `
            <div class="flex-1">
                <span class="${pattern.class}">${pattern.text}</span>
                <div class="text-gray-500 text-xs">${pattern.account}@alumni</div>
            </div>
            <span class="text-gray-500">${timestamp}</span>
        `;
        
        loginFeed.insertBefore(logEntry, loginFeed.firstChild);
        
        // Keep only last 15 entries for performance
        while (loginFeed.children.length > 15) {
            loginFeed.removeChild(loginFeed.lastChild);
        }
        
        // Auto-remove pulse animation
        setTimeout(() => {
            logEntry.classList.remove('animate-pulse');
        }, 1000);
        
    }, Math.random() * 2000 + 1000); // Random interval between 1-3 seconds
}

function simulateAccountAttack(account) {
    // Update current attempts counter
    const currentAttempts = Math.floor(Math.random() * 50) + 10;
    const attemptsElement = document.getElementById('current-attempts');
    if (attemptsElement) {
        const newTotal = parseInt(attemptsElement.textContent.replace(',', '')) + currentAttempts;
        attemptsElement.textContent = newTotal.toLocaleString();
        attemptsElement.classList.add('animate-bounce');
        setTimeout(() => attemptsElement.classList.remove('animate-bounce'), 500);
    }
    
    // Update estimated breach time
    const breachTimeElement = document.getElementById('estimated-breach');
    if (breachTimeElement && account.riskLevel === 'CRITICAL') {
        const currentTime = breachTimeElement.textContent.split(':');
        let minutes = parseInt(currentTime[0]);
        let seconds = parseInt(currentTime[1]);
        
        // Decrease time faster for weak passwords
        seconds -= Math.floor(Math.random() * 10) + 5;
        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        
        if (minutes < 0) {
            minutes = 0;
            seconds = 0;
            createCriticalAlert('IMMINENT BREACH DETECTED!');
        }
        
        breachTimeElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (minutes === 0 && seconds < 30) {
            breachTimeElement.classList.add('animate-pulse', 'text-red-500');
        }
    }
    
    // Update live attack activity
    const activityElement = document.getElementById('attack-activity');
    if (activityElement) {
        const passwords = ['admin123', 'password', 'administrator', 'root', 'admin1234', 'qwerty123'];
        const randomPassword = passwords[Math.floor(Math.random() * passwords.length)];
        const timestamp = new Date().toLocaleTimeString();
        
        const newEntry = document.createElement('div');
        newEntry.className = 'text-red-400 animate-pulse';
        newEntry.textContent = `${timestamp} - Failed: ${randomPassword}`;
        
        activityElement.insertBefore(newEntry, activityElement.firstChild);
        
        // Keep only last 10 entries
        while (activityElement.children.length > 10) {
            activityElement.removeChild(activityElement.lastChild);
        }
    }
}

function createCriticalAlert(message) {
    // Create floating alert for critical events
    const alert = document.createElement('div');
    alert.className = 'fixed top-20 right-4 bg-red-600 border-2 border-red-400 text-white p-4 rounded-lg shadow-xl z-50 animate-bounce';
    alert.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="bi bi-exclamation-triangle-fill text-yellow-300"></i>
            <span class="font-bold text-sm">${message}</span>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 3000);
}

export function stopAttackSimulation() {
    // Stop all intervals when vault is secured
    gameState.attackIntensity = 0;
    document.getElementById('intensity-bar').style.width = '0%';
    
    // Add success message to feed
    const loginFeed = document.getElementById('login-feed');
    const successEntry = document.createElement('div');
    successEntry.className = 'text-green-400 font-bold p-2 bg-green-900 rounded border border-green-500';
    successEntry.textContent = 'ATTACK REPELLED - All systems secure';
    loginFeed.insertBefore(successEntry, loginFeed.firstChild);
}

import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let accounts = {
    1: {
        id: 1,
        email: 'admin.legacy@alumni',
        role: 'Legacy Administrator',
        password: 'admin123',
        strength: 'critical',
        mfaEnabled: false,
        adminPrivileges: true,
        correctAction: 'lockdown',
        riskLevel: 'CRITICAL',
        vulnerabilities: ['Weak password', 'No MFA', 'Dictionary word', 'Admin privileges'],
        status: 'vulnerable'
    },
    2: {
        id: 2,
        email: 'alex.wilson@alumni',
        role: 'Class of 2019',
        password: 'graduation2019',
        strength: 'weak',
        mfaEnabled: false,
        adminPrivileges: false,
        correctAction: 'force-reset',
        riskLevel: 'HIGH',
        vulnerabilities: ['Predictable password', 'No MFA'],
        status: 'vulnerable'
    },
    3: {
        id: 3,
        email: 'm.chen@alumni',
        role: 'Class of 2020',
        password: 'Password123!',
        strength: 'weak',
        mfaEnabled: false,
        adminPrivileges: false,
        correctAction: 'enable-mfa',
        riskLevel: 'HIGH',
        vulnerabilities: ['Common password pattern', 'No MFA'],
        status: 'vulnerable'
    },
    4: {
        id: 4,
        email: 'j.torres@alumni',
        role: 'Class of 2021',
        password: 'K9$mT@7pLx!2',
        strength: 'strong',
        mfaEnabled: true,
        adminPrivileges: false,
        correctAction: 'verify-safe',
        riskLevel: 'MEDIUM',
        vulnerabilities: ['MFA partially configured'],
        status: 'secure'
    }
};

export async function loadAccounts() {
    // Accounts are now defined locally, but we can still simulate loading
    try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('Accounts loaded successfully');
    } catch (error) {
        console.error('Failed to load accounts:', error);
    }
}

export function selectAccount(accountId) {
    gameState.currentAccount = accounts[accountId];
    if (gameState.currentAccount) {
        displayAccountDetails(gameState.currentAccount);
        document.getElementById('tutorial-audit').classList.add('hidden');
        document.getElementById('account-placeholder').classList.add('hidden');
        
        if (accountId === 1) {
            updateMentorMessage("CRITICAL! This admin account has the weakest possible password and full system privileges. This is The Null's primary target - emergency lockdown is required immediately!");
        }
    }
}

export function displayAccountDetails(account) {
    document.getElementById('account-details').classList.remove('hidden');
    
    // Update account header
    const emailElement = document.getElementById('account-email');
    const roleElement = document.getElementById('account-role');
    
    if (emailElement) emailElement.textContent = account.email;
    if (roleElement) roleElement.textContent = account.role;
    
    // Update password analysis
    const passwordElement = document.getElementById('current-password');
    if (passwordElement) {
        passwordElement.textContent = account.password;
    }
    
    // Update password analysis details
    const analysisContainer = document.getElementById('password-analysis');
    if (analysisContainer) {
        const strengthColors = {
            'critical': 'text-red-400',
            'weak': 'text-red-400', 
            'moderate': 'text-yellow-400',
            'strong': 'text-green-400'
        };
        
        analysisContainer.innerHTML = `
            <div class="flex justify-between">
                <span class="text-gray-400">Current Password:</span>
                <span class="text-red-400 font-mono">${account.password}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Strength:</span>
                <span class="${strengthColors[account.strength]}">${account.strength.toUpperCase()}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Dictionary Word:</span>
                <span class="text-red-400">${account.vulnerabilities.includes('Dictionary word') ? 'YES ⚠️' : 'NO'}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Crack Time:</span>
                <span class="text-red-400 animate-pulse">${account.strength === 'critical' ? '0.003 seconds' : '< 1 minute'}</span>
            </div>
        `;
    }
    
    // Update MFA status
    const mfaContainer = document.getElementById('mfa-status');
    if (mfaContainer) {
        if (account.mfaEnabled) {
            mfaContainer.innerHTML = `
                <div class="flex items-center gap-2 mb-2">
                    <i class="bi bi-check-circle text-green-400"></i>
                    <span class="text-green-400">MFA ENABLED</span>
                </div>
                <p class="text-gray-400 text-xs">Account protected by multi-factor authentication.</p>
            `;
        } else {
            mfaContainer.innerHTML = `
                <div class="flex items-center gap-2 mb-2">
                    <i class="bi bi-x-circle text-red-400"></i>
                    <span class="text-red-400">MFA DISABLED</span>
                </div>
                <p class="text-gray-400 text-xs">This account is vulnerable to password-only attacks.</p>
            `;
        }
    }
    
    // Update risk indicators
    const riskElement = document.getElementById('risk-level');
    if (riskElement) {
        riskElement.textContent = account.riskLevel;
        riskElement.className = account.riskLevel === 'CRITICAL' ? 
            'text-red-400 text-lg font-bold animate-pulse' : 
            'text-yellow-400 text-lg font-bold';
    }
    
    // Initialize attack simulation for this account
    const attemptsElement = document.getElementById('current-attempts');
    if (attemptsElement) {
        attemptsElement.textContent = Math.floor(Math.random() * 1000 + 500).toLocaleString();
    }
    
    const breachElement = document.getElementById('estimated-breach');
    if (breachElement && account.riskLevel === 'CRITICAL') {
        breachElement.textContent = '02:34';
        breachElement.className = 'text-red-400 text-lg font-bold animate-pulse';
    }
}

export function closeAccountDetails() {
    document.getElementById('account-details').classList.add('hidden');
    document.getElementById('account-placeholder').classList.remove('hidden');
    gameState.currentAccount = null;
}

import { gameState } from '../../gameState.js';
import { updateMentorMessage } from '../../uiUpdates.js';

export function listTargets(output) {
    output.innerHTML += `
        <div class="text-green-400 mb-2">
            <div class="font-bold mb-2">🎯 Available Test Targets:</div>
            <div class="space-y-2 text-sm">
                <div class="border-l-4 border-red-500 pl-3">
                    <div class="text-red-300 font-semibold">civitas-vote.local:8080</div>
                    <div class="text-red-200 text-xs">Primary voting application - CRITICAL SYSTEM</div>
                </div>
                <div class="border-l-4 border-orange-500 pl-3">
                    <div class="text-orange-300 font-semibold">auth-api.civitas.local:443</div>
                    <div class="text-orange-200 text-xs">Authentication service - HIGH PRIORITY</div>
                </div>
                <div class="border-l-4 border-yellow-500 pl-3">
                    <div class="text-yellow-300 font-semibold">blockchain.civitas.eth</div>
                    <div class="text-yellow-200 text-xs">Smart contract interface - MEDIUM RISK</div>
                </div>
                <div class="border-l-4 border-blue-500 pl-3">
                    <div class="text-blue-300 font-semibold">frontend.civitas.local</div>
                    <div class="text-blue-200 text-xs">User interface - LOW RISK</div>
                </div>
            </div>
            <div class="mt-2 text-xs text-cyan-300">
                Use specific tools (nmap, sqlmap, etc.) to test these targets
            </div>
        </div>
    `;
}

export function runNetworkScan(output, args) {
    if (args.includes('?')) {
        output.innerHTML += `
            <div class="text-cyan-400 mb-2">
                <div class="font-bold">📡 NMAP - Network Mapper</div>
                <div class="text-sm mt-1">Usage: nmap [target] [options]</div>
                <div class="text-xs mt-2 space-y-1">
                    <div><span class="text-green-400">nmap civitas-vote.local</span> - Basic port scan</div>
                    <div><span class="text-green-400">nmap -sV civitas-vote.local</span> - Service version detection</div>
                    <div><span class="text-green-400">nmap -A civitas-vote.local</span> - Aggressive scan</div>
                </div>
            </div>
        `;
        return;
    }

    const target = args[1] || 'civitas-vote.local';
    
    output.innerHTML += `
        <div class="text-cyan-400">
            <div>Starting Nmap scan against ${target}...</div>
        </div>
    `;

    setTimeout(() => {
        output.innerHTML += `
            <div class="text-green-400 mb-2">
                <div class="font-mono text-xs">
PORT     STATE SERVICE    VERSION<br>
22/tcp   open  ssh        OpenSSH 8.9<br>
80/tcp   open  http       nginx 1.20.2<br>
443/tcp  open  https      nginx 1.20.2<br>
3306/tcp open  mysql      MySQL 8.0.28<br>
5432/tcp open  postgresql PostgreSQL 14.2<br>
8080/tcp open  http       Node.js Express<br><br>

<span class="text-yellow-400">⚠️ Notable findings:</span><br>
• Database ports exposed (MySQL 3306, PostgreSQL 5432)<br>
• Development server on port 8080<br>
• SSH service accessible<br><br>

<span class="text-red-400">🚨 Security concerns:</span><br>
• Database services should not be externally accessible<br>
• Multiple web services increase attack surface
                </div>
            </div>
        `;
        
        gameState.exploitsRun += 1;
        updateMentorMessage("Network scan reveals concerning service exposure. Database ports shouldn't be accessible externally.");
        output.scrollTop = output.scrollHeight;
    }, 2500);
}

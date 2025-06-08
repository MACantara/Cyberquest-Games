// Game data structure for all levels
export const levelData = {
    1: { name: "Network Fundamentals", icon: "🌐", category: "Foundation", maxScore: 1000 },
    2: { name: "Firewall Configuration", icon: "🛡️", category: "Defense", maxScore: 1200 },
    3: { name: "Intrusion Detection", icon: "🔍", category: "Monitoring", maxScore: 1500 },
    4: { name: "Vulnerability Assessment", icon: "🔎", category: "Analysis", maxScore: 1800 },
    5: { name: "Incident Response", icon: "🚨", category: "Crisis Management", maxScore: 2000 },
    6: { name: "Threat Hunting", icon: "🎯", category: "Proactive Defense", maxScore: 2200 },
    7: { name: "Advanced Malware Analysis", icon: "🦠", category: "Forensics", maxScore: 2500 },
    8: { name: "Ethical Hacking", icon: "⚖️", category: "Penetration Testing", maxScore: 2800 },
    9: { name: "Crisis Management", icon: "🏥", category: "Infrastructure Defense", maxScore: 3000 },
    10: { name: "Digital Forensics", icon: "🕵️", category: "Investigation", maxScore: 3500 }
};

// Skills mapping
export const skillCategories = {
    "Network Security": { levels: [1, 2, 3], icon: "🌐", color: "blue" },
    "Vulnerability Management": { levels: [4, 5, 6], icon: "🔍", color: "yellow" },
    "Incident Response": { levels: [5, 6, 9], icon: "🚨", color: "red" },
    "Digital Forensics": { levels: [7, 10], icon: "🕵️", color: "purple" },
    "Ethical Hacking": { levels: [8], icon: "⚖️", color: "green" },
    "Crisis Management": { levels: [9], icon: "🏥", color: "orange" }
};

// Achievement definitions
export const achievements = [
    { id: "first_steps", name: "First Steps", description: "Complete Level 1", icon: "🎯", unlocked: true },
    { id: "firewall_master", name: "Firewall Master", description: "Perfect score on Level 2", icon: "🛡️", unlocked: false },
    { id: "threat_hunter", name: "Threat Hunter", description: "Complete Level 6", icon: "🎯", unlocked: false },
    { id: "ethical_choice", name: "Ethical Guardian", description: "Make ethical choices in Level 8", icon: "⚖️", unlocked: false },
    { id: "crisis_manager", name: "Crisis Manager", description: "Save all systems in Level 9", icon: "🏥", unlocked: false },
    { id: "forensics_expert", name: "Digital Detective", description: "Solve the case in Level 10", icon: "🕵️", unlocked: false },
    { id: "speed_demon", name: "Speed Demon", description: "Complete any level in under 10 minutes", icon: "⚡", unlocked: false },
    { id: "perfectionist", name: "Perfectionist", description: "Get 100% score on 5 levels", icon: "💯", unlocked: false }
];

export function generateSampleProgress() {
    const progress = {
        totalScore: 0,
        totalTime: 0,
        levelsCompleted: [],
        skillPoints: 0,
        unlockedAchievements: []
    };
    
    // Generate realistic completion data
    for (let i = 1; i <= 10; i++) {
        const levelScore = Math.floor(levelData[i].maxScore * (0.7 + Math.random() * 0.3));
        const completionTime = Math.floor(900 + Math.random() * 1800); // 15-45 minutes
        
        progress.levelsCompleted.push({
            level: i,
            score: levelScore,
            maxScore: levelData[i].maxScore,
            completionTime: completionTime,
            attempts: Math.floor(1 + Math.random() * 3),
            completed: true
        });
        
        progress.totalScore += levelScore;
        progress.totalTime += completionTime;
    }
    
    progress.skillPoints = Math.floor(progress.totalScore / 100);
    progress.unlockedAchievements = ['first_steps', 'ethical_choice', 'crisis_manager', 'forensics_expert'];
    
    return progress;
}

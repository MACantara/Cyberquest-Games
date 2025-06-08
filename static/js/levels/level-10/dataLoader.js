export let evidenceDatabase = {};
export let suspects = {};

export async function loadGameData() {
    try {
        console.log('Loading Level 10 forensics data...');
        
        const [evidenceResponse, suspectsResponse] = await Promise.all([
            fetch('/static/js/levels/level-10/data/evidence.json'),
            fetch('/static/js/levels/level-10/data/suspects.json')
        ]);
        
        if (!evidenceResponse.ok || !suspectsResponse.ok) {
            throw new Error('Failed to fetch game data files');
        }
        
        evidenceDatabase = await evidenceResponse.json();
        suspects = await suspectsResponse.json();
        
        console.log('Evidence database loaded:', Object.keys(evidenceDatabase));
        console.log('Suspects loaded:', Object.keys(suspects));
        
        // Validate data structure
        validateGameData();
        
        return true;
    } catch (error) {
        console.error('Failed to load game data:', error);
        
        // Fallback data for development/offline testing
        loadFallbackData();
        return false;
    }
}

function validateGameData() {
    // Ensure evidence database has required categories
    const requiredCategories = ['logs', 'hashes', 'metadata', 'timeline', 'traffic'];
    const missingCategories = requiredCategories.filter(cat => !evidenceDatabase[cat]);
    
    if (missingCategories.length > 0) {
        console.warn('Missing evidence categories:', missingCategories);
    }
    
    // Ensure suspects have required fields
    Object.entries(suspects).forEach(([id, suspect]) => {
        const requiredFields = ['name', 'title', 'evidence', 'background', 'motive'];
        const missingFields = requiredFields.filter(field => !suspect[field]);
        
        if (missingFields.length > 0) {
            console.warn(`Suspect ${id} missing fields:`, missingFields);
        }
    });
    
    console.log('Game data validation complete');
}

function loadFallbackData() {
    console.log('Loading fallback data for Level 10...');
    
    evidenceDatabase = {
        logs: [
            {
                id: "log_001",
                type: "SSH Access Log",
                timestamp: "2024-02-15 02:47:33",
                description: "Late-night SSH login from Dr. Reeves' workstation",
                indicator: true,
                suspectLink: "dr",
                evidenceValue: 15
            }
        ],
        hashes: [
            {
                id: "hash_001",
                file: "research_data.zip",
                hash: "a7f8c9e2d4b6f1e8c3a9d7f2e5b8c1a4",
                status: "MODIFIED",
                indicator: true,
                suspectLink: "dr",
                evidenceValue: 16
            }
        ],
        metadata: [
            {
                id: "meta_001",
                file: "leaked_emails.pst",
                author: "Dr. Alexis Reeves",
                created: "2024-02-10 14:22:18",
                indicator: true,
                suspectLink: "dr",
                evidenceValue: 19
            }
        ],
        timeline: [
            {
                id: "timeline_001",
                title: "Operation Planning Phase",
                description: "Coordinated sequence of suspicious activities",
                indicator: true,
                evidenceValue: 25
            }
        ],
        traffic: [
            {
                id: "traffic_001",
                type: "Network Flow Analysis",
                description: "Suspicious traffic from Dr. Reeves' workstation",
                sourceIP: "192.168.1.15",
                destinationIP: "185.220.101.45",
                indicator: true,
                suspectLink: "dr",
                evidenceValue: 20
            }
        ]
    };
    
    suspects = {
        dr: {
            id: "dr",
            name: "Dr. Alexis Reeves",
            title: "Former AI Ethics Professor",
            evidence: ["log_001", "hash_001", "meta_001", "traffic_001"],
            background: { position: "Former Academy AI Ethics Professor" },
            motive: { primary: "Revenge against Academy for career destruction" },
            isCorrectSuspect: true,
            baseConfidence: 20,
            maxConfidence: 85
        },
        mc: {
            id: "mc",
            name: "Marcus Chen",
            title: "Security Administrator",
            evidence: ["log_002"],
            background: { position: "Senior Security Systems Administrator" },
            motive: { primary: "Potential external coercion" },
            isCorrectSuspect: false,
            baseConfidence: 20,
            maxConfidence: 65
        },
        zk: {
            id: "zk",
            name: "Zara Khan",
            title: "Former Penetration Tester",
            evidence: ["log_004"],
            background: { position: "Former Lead Penetration Testing Specialist" },
            motive: { primary: "Recruitment by hostile organization" },
            isCorrectSuspect: false,
            baseConfidence: 20,
            maxConfidence: 70
        }
    };
}

export function findEvidenceById(evidenceId) {
    // Search through all evidence categories
    for (const [category, evidenceList] of Object.entries(evidenceDatabase)) {
        if (Array.isArray(evidenceList)) {
            const evidence = evidenceList.find(item => item.id === evidenceId);
            if (evidence) {
                return { ...evidence, category };
            }
        }
    }
    
    console.warn('Evidence not found:', evidenceId);
    return null;
}

export function getEvidenceByCategory(category) {
    return evidenceDatabase[category] || [];
}

export function getSuspectById(suspectId) {
    return suspects[suspectId] || null;
}

export function getEvidenceLinkedToSuspect(suspectId) {
    const suspect = suspects[suspectId];
    if (!suspect || !suspect.evidence) return [];
    
    return suspect.evidence.map(evidenceId => findEvidenceById(evidenceId)).filter(Boolean);
}

export function calculateEvidenceScore(suspectId) {
    const linkedEvidence = getEvidenceLinkedToSuspect(suspectId);
    return linkedEvidence.reduce((total, evidence) => total + (evidence.evidenceValue || 0), 0);
}

export function getStrongestEvidenceForSuspect(suspectId) {
    const linkedEvidence = getEvidenceLinkedToSuspect(suspectId);
    return linkedEvidence.reduce((strongest, current) => {
        return (current.evidenceValue || 0) > (strongest.evidenceValue || 0) ? current : strongest;
    }, null);
}

// Helper function to get evidence statistics
export function getEvidenceStatistics() {
    const stats = {
        totalEvidence: 0,
        byCategory: {},
        suspiciousEvidence: 0,
        evidenceValue: 0
    };
    
    Object.entries(evidenceDatabase).forEach(([category, evidenceList]) => {
        if (Array.isArray(evidenceList)) {
            stats.byCategory[category] = evidenceList.length;
            stats.totalEvidence += evidenceList.length;
            
            evidenceList.forEach(evidence => {
                if (evidence.indicator) stats.suspiciousEvidence++;
                stats.evidenceValue += evidence.evidenceValue || 0;
            });
        }
    });
    
    return stats;
}

// Export individual categories for direct access
export function getLogEvidence() { return evidenceDatabase.logs || []; }
export function getHashEvidence() { return evidenceDatabase.hashes || []; }
export function getMetadataEvidence() { return evidenceDatabase.metadata || []; }
export function getTimelineEvidence() { return evidenceDatabase.timeline || []; }
export function getTrafficEvidence() { return evidenceDatabase.traffic || []; }

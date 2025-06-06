export let evidenceDatabase = {};
export let suspects = {};

export async function loadGameData() {
    try {
        const [evidenceResponse, suspectsResponse] = await Promise.all([
            fetch('/static/js/levels/level-10/data/evidence.json'),
            fetch('/static/js/levels/level-10/data/suspects.json')
        ]);
        
        evidenceDatabase = await evidenceResponse.json();
        suspects = await suspectsResponse.json();
    } catch (error) {
        console.error('Failed to load game data:', error);
    }
}

export function findEvidenceById(evidenceId) {
    for (const category of Object.values(evidenceDatabase)) {
        const evidence = category.find(item => item.id === evidenceId);
        if (evidence) return evidence;
    }
    return null;
}

export let memories = {};
export let epilogues = {};

export async function loadEndingData() {
    try {
        const [memoriesResponse, epiloguesResponse] = await Promise.all([
            fetch('/static/js/levels/ending/data/memories.json'),
            fetch('/static/js/levels/ending/data/epilogues.json')
        ]);
        
        memories = await memoriesResponse.json();
        epilogues = await epiloguesResponse.json();
    } catch (error) {
        console.error('Failed to load ending data:', error);
    }
}

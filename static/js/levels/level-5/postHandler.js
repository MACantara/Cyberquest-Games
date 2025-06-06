import { gameState } from './gameState.js';
import { updateMentorMessage } from './uiUpdates.js';

export let posts = {
    1: {
        id: 1,
        author: 'Echo Rivera',
        authorInitial: 'E',
        content: "💀 Y'all need to see this drama! Alex thought they were sooo clever in DMs but look at this... [LEAKED PRIVATE DMs ATTACHED] #DramaNest #CyberAcademyTea #PrivateButNotAnymore",
        type: 'privacy_violation',
        timestamp: '2 hours ago',
        engagement: { likes: 2100, comments: 487, shares: 89 },
        privacyFlags: [
            'Sharing private DMs without consent',
            'Violating confidentiality',
            'Potential harassment of victim',
            'Exploiting personal struggles for clout'
        ],
        ethicalConcerns: [
            'Lack of empathy for victim',
            'Prioritizing social media engagement over friendship',
            'Contributing to cyberbullying culture',
            'Normalizing privacy violations'
        ],
        correctAction: 'mediate',
        status: 'viral_harmful'
    },
    2: {
        id: 2,
        author: 'Alex Chen',
        authorInitial: 'A',
        content: "I'm devastated. Those were private messages shared in confidence. My family has been getting calls all day. I never consented to this being public. Please stop sharing this. #PrivacyMatters #ConsentFirst",
        type: 'victim_response',
        timestamp: '1 hour ago',
        engagement: { likes: 156, comments: 23, shares: 0 },
        privacyFlags: [],
        ethicalConcerns: [],
        correctAction: 'educate',
        status: 'authentic_distress'
    },
    3: {
        id: 3,
        author: 'Anonymous_Truth',
        authorInitial: '?',
        content: "@EchoRivera thinks they're clever? I have MUCH worse DMs from Echo. Pay me 500 credits or I release the REALLY embarrassing stuff. You have 24 hours. 💰",
        type: 'blackmail_threat',
        timestamp: '30 min ago',
        engagement: { likes: 12, comments: 3, shares: 0 },
        privacyFlags: [
            'Explicit blackmail/extortion attempt',
            'Threatening to leak private content',
            'Anonymous harassment account'
        ],
        ethicalConcerns: [
            'Criminal extortion behavior',
            'Escalating the crisis for personal gain',
            'Creating unsafe environment'
        ],
        correctAction: 'report',
        status: 'criminal_threat'
    },
    4: {
        id: 4,
        author: 'TrollMaster_2024',
        authorInitial: 'T',
        content: "LEAKED: Echo's REAL messages about Academy staff! 🔥 This is getting juicy! [FAKE AI-GENERATED SCREENSHOT ATTACHED]",
        type: 'fake_content',
        timestamp: '45 min ago',
        engagement: { likes: 89, comments: 34, shares: 12 },
        privacyFlags: [
            'Spreading fabricated content',
            'AI-generated fake screenshots',
            'Impersonating real messages'
        ],
        ethicalConcerns: [
            'Deliberately spreading misinformation',
            'Using AI to create false evidence',
            'Amplifying drama with fake content'
        ],
        correctAction: 'counter',
        status: 'synthetic_media'
    },
    5: {
        id: 5,
        author: 'Jordan Kim',
        authorInitial: 'J',
        content: "This has gone too far. Alex is my friend and doesn't deserve this harassment. Sharing private messages without consent is NEVER okay. Let's focus on supporting each other instead of tearing people down. 💙 #DigitalEmpathy #PrivacyRights #SupportAlex",
        type: 'supportive_response',
        timestamp: '15 min ago',
        engagement: { likes: 234, comments: 67, shares: 18 },
        privacyFlags: [],
        ethicalConcerns: [],
        correctAction: 'mediate',
        status: 'constructive_support'
    }
};

export async function loadPosts() {
    // Posts are now defined locally with realistic social media data
    try {
        // Simulate loading delay for realism
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('Social media posts loaded successfully');
        
        // Simulate real-time engagement updates
        startEngagementSimulation();
    } catch (error) {
        console.error('Failed to load posts:', error);
    }
}

function startEngagementSimulation() {
    // Simulate viral post engagement growth
    setInterval(() => {
        const echoPost = posts[1];
        if (echoPost && gameState.completedPosts.indexOf(1) === -1) {
            // Viral content grows exponentially
            echoPost.engagement.likes += Math.floor(Math.random() * 50) + 20;
            echoPost.engagement.comments += Math.floor(Math.random() * 20) + 5;
            echoPost.engagement.shares += Math.floor(Math.random() * 10) + 2;
            
            // Update UI
            updatePostEngagement(1, echoPost.engagement);
            
            // Update viral spread metric
            gameState.viralSpread = Math.min(gameState.viralSpread + 1, 100);
        }
    }, 3000);
}

function updatePostEngagement(postId, engagement) {
    const postElement = document.querySelector(`[data-post="${postId}"]`);
    if (postElement) {
        const likesElement = postElement.querySelector('.bi-heart-fill + span');
        const commentsElement = postElement.querySelector('.bi-chat-fill + span');
        const sharesElement = postElement.querySelector('.bi-arrow-repeat + span');
        
        if (likesElement) likesElement.textContent = formatEngagement(engagement.likes);
        if (commentsElement) commentsElement.textContent = `${engagement.comments} comments`;
        if (sharesElement) sharesElement.textContent = `${engagement.shares} shares`;
    }
}

function formatEngagement(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export function selectPost(postId) {
    gameState.currentPost = posts[postId];
    if (gameState.currentPost) {
        displayPostAnalysis(gameState.currentPost);
        document.getElementById('tutorial-feed').classList.add('hidden');
        
        // Provide context-specific guidance
        switch(postId) {
            case 1:
                updateMentorMessage("This is the root of the crisis. Echo shared private DMs without consent, violating Alex's privacy and trust. This triggered everything that followed. How should we address this ethically?");
                break;
            case 2:
                updateMentorMessage("Alex is the victim in this situation. Their privacy was violated and they're experiencing real harm. What's the most supportive approach here?");
                break;
            case 3:
                updateMentorMessage("This is criminal behavior - explicit blackmail and extortion. This anonymous account is escalating the crisis for personal gain. What action should we take?");
                break;
            case 4:
                updateMentorMessage("This is AI-generated fake content designed to amplify the drama. Synthetic media can cause real harm. How do we combat misinformation effectively?");
                break;
            case 5:
                updateMentorMessage("Jordan is trying to support their friend and restore ethical behavior. This is constructive community response. How can we amplify positive voices?");
                break;
        }
    }
}

export function displayPostAnalysis(post) {
    document.getElementById('analysis-placeholder').classList.add('hidden');
    document.getElementById('post-analysis').classList.remove('hidden');
    
    // Update post details
    document.getElementById('post-author').textContent = post.author;
    document.getElementById('post-author-initial').textContent = post.authorInitial;
    document.getElementById('post-content').innerHTML = `<p class="text-gray-700 text-sm">${post.content}</p>`;
    
    // Update analysis based on post type
    updateAnalysisDisplay(post);
    
    // Reset analysis state
    gameState.analysisSteps[post.id] = {};
    document.getElementById('analysis-results').classList.add('hidden');
    document.getElementById('response-panel').classList.add('hidden');
    
    // Reset tool states
    document.querySelectorAll('.action-tool').forEach(tool => {
        tool.classList.remove('opacity-50');
        tool.disabled = false;
    });
}

function updateAnalysisDisplay(post) {
    // Update privacy flags
    const privacyFlags = document.getElementById('privacy-flags');
    if (post.privacyFlags.length > 0) {
        privacyFlags.innerHTML = post.privacyFlags.map(flag => `
            <div class="flex items-center gap-2 text-xs">
                <i class="bi bi-exclamation-triangle text-red-500"></i>
                <span class="text-red-600">${flag}</span>
            </div>
        `).join('');
    } else {
        privacyFlags.innerHTML = '<div class="text-green-600 text-xs flex items-center gap-2"><i class="bi bi-check-circle"></i>No privacy concerns detected</div>';
    }
    
    // Update ethical concerns
    const ethicalConcerns = document.getElementById('ethical-concerns');
    if (post.ethicalConcerns.length > 0) {
        ethicalConcerns.innerHTML = post.ethicalConcerns.map(concern => `
            <div class="flex items-center gap-2 text-xs">
                <i class="bi bi-exclamation-circle text-orange-500"></i>
                <span class="text-orange-600">${concern}</span>
            </div>
        `).join('');
    } else {
        ethicalConcerns.innerHTML = '<div class="text-green-600 text-xs flex items-center gap-2"><i class="bi bi-check-circle"></i>No ethical concerns detected</div>';
    }
}

export function closePostAnalysis() {
    document.getElementById('post-analysis').classList.add('hidden');
    document.getElementById('analysis-placeholder').classList.remove('hidden');
    gameState.currentPost = null;
    
    // Reset post selection visual feedback
    document.querySelectorAll('.post-item').forEach(post => {
        post.classList.remove('ring-2', 'ring-cyan-400');
    });
}

// Helper function to get post status styling
export function getPostStatusStyling(status) {
    const styles = {
        'viral_harmful': 'border-red-400 animate-pulse',
        'authentic_distress': 'border-green-300',
        'criminal_threat': 'border-orange-400',
        'synthetic_media': 'border-purple-400',
        'constructive_support': 'border-green-300'
    };
    
    return styles[status] || 'border-gray-200';
}

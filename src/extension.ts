import { Octokit } from 'octokit';

const check_interval = 10 * 1000;

let lastCheckTime: Date = new Date(0);

export async function checkRecentPullRequest(owner: string, repo: string, token: string): Promise<boolean> {
    const octokit = new Octokit({
        auth: token,
    });

    try {
        const response = await octokit.rest.pulls.list({
            owner: owner,
            repo: repo,
            sort: 'updated',
            state: 'closed',
        });

        const filteredData = response.data.filter(pr => new Date(pr.updated_at) >= lastCheckTime && (pr as any).merged === true);

        lastCheckTime = new Date(Date.now());

        return filteredData.length > 0;
    } catch (error) {
        console.error('Error checking for recent pull requests:', error);
        return false;
    }
}

setInterval(() => {
    browser.storage.local.get(['owner', 'repo', 'token']).then((result: any) => {
        const owner = result.owner;
        if (!owner) {
            console.log('Owner not set in storage');
            return;
        }

        const repo = result.repo;
        if (!repo) {
            console.log('Repo not set in storage');
            return;
        }

        const token = result.token;
        if (!token) {
            console.log('Token not set in storage');
            return;
        }

        checkRecentPullRequest(owner, repo, token).then(result => {
            console.log('Recent PR check result:', result);
        }).catch(error => {
            console.error('Error in check:', error);
        });

    }).catch(error => {
        console.error('Error getting storage:', error);
    });
}, check_interval);

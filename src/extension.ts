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

        const filteredData = response.data.filter(pr => new Date(pr.updated_at) >= lastCheckTime);

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
            if (result) {
                browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
                    if (tabs[0] && tabs[0].status === 'complete' && tabs[0].url && tabs[0].url.startsWith('http')) {
                        browser.tabs.sendMessage(tabs[0].id!, {action: 'showOverlay'}).catch((error) => {
                            console.log('Message send failed:', error);
                        });
                    } else {
                        console.log('Tab not eligible for overlay:', {status: tabs[0]?.status, url: tabs[0]?.url});
                    }
                }).catch((error) => {
                    console.error('Error querying tabs:', error);
                });
            }
        }).catch(error => {
            console.error('Error in check:', error);
        });

    }).catch(error => {
        console.error('Error getting storage:', error);
    });
}, check_interval);

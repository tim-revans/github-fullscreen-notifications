// Load current settings
document.addEventListener('DOMContentLoaded', () => {
    browser.storage.local.get(['owner', 'repo', 'token']).then((result) => {
        document.getElementById('owner').value = result.owner || '';
        document.getElementById('repo').value = result.repo || '';
        document.getElementById('token').value = result.token || '';
    }).catch((error) => {
        console.error('Error loading settings:', error);
    });
});

// Save settings on form submit
document.getElementById('options-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const owner = document.getElementById('owner').value;
    const repo = document.getElementById('repo').value;
    const token = document.getElementById('token').value;

    browser.storage.local.set({ owner, repo, token }).then(() => {
        const status = document.getElementById('status');
        status.textContent = 'Settings saved successfully!';
        setTimeout(() => { status.textContent = ''; }, 3000);
    }).catch((error) => {
        console.error('Error saving settings:', error);
        const status = document.getElementById('status');
        status.textContent = 'Error saving settings.';
        status.style.color = 'red';
    });
});

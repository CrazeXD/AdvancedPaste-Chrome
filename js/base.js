// base.js

document.addEventListener('DOMContentLoaded', () => {
    const speedSlider = document.getElementById('speedSlider');
    speedSlider.addEventListener('input', () => {
        const speed = speedSlider.value;
        const speedLabel = document.getElementById('speedLabel');
        speedLabel.textContent = `${speed} WPM`;
        speedSlider.value = speed;
        // Send a message to the content script with the new speed value
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'set_speed', speed: speed});
        });
    });
});

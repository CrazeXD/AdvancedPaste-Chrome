console.log('Content script loaded');

function simulateKeypress(key) {
    // Create and dispatch the keydown event
    const keydownEvent = new KeyboardEvent('keydown', {
        key: key,
        code: key,
        keyCode: key.charCodeAt(0),
        which: key.charCodeAt(0),
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(keydownEvent);
    console.log(`Simulated keydown: ${key}`);

    // Create and dispatch the keyup event
    const keyupEvent = new KeyboardEvent('keyup', {
        key: key,
        code: key,
        keyCode: key.charCodeAt(0),
        which: key.charCodeAt(0),
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(keyupEvent);
    console.log(`Simulated keyup: ${key}`);
}

async function getPastedText() {
    try {
        const text = await navigator.clipboard.readText();
        return text;
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        return '';
    }
}

async function typeTextWithRandomSpeed(wordsPerMinute) {
    const text = await getPastedText();

    const meanSpeedMsPerChar = (60 / wordsPerMinute) / 5 * 1000;

    for (const char of text) {
        const speedDeviation = (Math.random() - 0.5) * meanSpeedMsPerChar * 0.5;
        const speed = Math.max(meanSpeedMsPerChar + speedDeviation, 0);

        await new Promise(resolve => setTimeout(resolve, speed));
        simulateKeypress(char); // You can replace this with actual typing action
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'advanced_paste') {
        typeTextWithRandomSpeed(100); // 100 WPM
    }
});

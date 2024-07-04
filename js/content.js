console.log('Content script loaded');

let typingSpeed = 150;
function simulateKeypress(element, key) {
    // Ensure the element is focused
    element.focus();
    // Press the key
    element.value += key;
}


async function getPastedText() {
    try {
        return await navigator.clipboard.readText();
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        return '';
    }
}

async function typeTextWithRandomSpeed(wordsPerMinute) {
    const text = await getPastedText();

    const meanSpeedMsPerChar = (60 / wordsPerMinute) / 5 * 1000;

    // Find the active input element
    const {activeElement} = document;
    if (!activeElement || !['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
        console.error('No active input element found');
        return;
    }

    for (const char of text) {
        const speedDeviation = (Math.random() - 0.5) * meanSpeedMsPerChar * 0.5;
        const speed = Math.max(meanSpeedMsPerChar + speedDeviation, 0);

        await new Promise(resolve => setTimeout(resolve, speed));
        simulateKeypress(activeElement, char);  // Simulate the keypress on the active element
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'advanced_paste') {
        typeTextWithRandomSpeed(typingSpeed); // 100 WPM
    } else if (request.action === 'set_speed') {
    typingSpeed = request.speed;
    console.log(`Typing speed set to: ${typingSpeed} WPM`);
    }
});
chrome.commands.onCommand.addListener(command => {
    if (command === 'advanced_paste') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'advanced_paste' }, response => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                    }
                });
            }
        });
    }
});

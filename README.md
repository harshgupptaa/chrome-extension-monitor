Chrome Extension Monitor : 
Steps to Run:

1. Clone repo
git clone https://github.com/harshgupptaa/chrome-extension-monitor.git
cd chrome-extension-monitor

2. Install dependencies
npm install

3. Start Chrome with debugging
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\chrome-debug"

4. Open Chrome extension popup once
(chrome://extensions then Developer mode then open extension)

5. Run monitor
node monitor.js

6. Select extension service worker number shown in terminal
<img width="1919" height="1020" alt="Evidence" src="https://github.com/user-attachments/assets/3661d8de-e471-47f5-9cb5-62973aa27768" />

const CDP = require('chrome-remote-interface');
const readline = require('readline');

(async () => {
  try {
    const targets = await CDP.List();

    const extensions = targets.filter(t =>
      t.url && t.url.startsWith('chrome-extension://')
    );

    if (extensions.length === 0) {
      console.log('No extension targets found.');
      console.log('👉 Open an extension popup and keep DevTools open.');
      process.exit(0);
    }

    console.log('\nAvailable Extension Targets:\n');
    extensions.forEach((t, i) => {
      console.log(`[${i}] ${t.type} → ${t.url}`);
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('\nSelect target number: ', async (index) => {
      const target = extensions[index];
      if (!target) {
        console.log('Invalid selection');
        rl.close();
        return;
      }

      console.log(`\n[*] Attaching to: ${target.url}`);

      const client = await CDP({ target });
      const { Runtime, DOM, Page } = client;

      await Promise.all([
        Runtime.enable(),
        DOM.enable(),
        Page.enable()
      ]);

      Runtime.consoleAPICalled(({ type, args }) => {
        console.log(`[Console:${type}]`, args.map(a => a.value).join(' '));
      });

      DOM.childNodeInserted(({ node }) => {
        console.log('[DOM] Node inserted:', node.nodeName);
      });

      DOM.attributeModified(({ name, value }) => {
        console.log(`[DOM] Attribute changed: ${name}=${value}`);
      });

      await Runtime.evaluate({
        expression: `
          document.addEventListener('click', e => {
            console.log('[EVENT] Click:', e.target.tagName);
          });
          document.addEventListener('input', e => {
            console.log('[EVENT] Input:', e.target.value);
          });
        `
      });

      console.log('\n[+] Monitoring active. Interact with the extension.\n');
      rl.close();
    });

  } catch (err) {
    console.error('Error:', err.message);
  }
})();

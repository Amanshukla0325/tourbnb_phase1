const fs = require('fs');
const fetch = require('node-fetch');

const FILE_KEY = process.env.VITE_FIGMA_FILE_KEY;
const TOKEN = process.env.VITE_FIGMA_TOKEN;

if (!FILE_KEY || !TOKEN) {
  console.error('VITE_FIGMA_FILE_KEY and VITE_FIGMA_TOKEN env variables are required. Set them before running this script.');
  process.exit(1);
}

async function run() {
  console.log('Fetching Figma file', FILE_KEY);
  const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}`, {
    headers: { 'X-Figma-Token': TOKEN }
  });
  if (!res.ok) {
    console.error('Failed to fetch Figma file', res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  // Save raw JSON for inspection
  fs.writeFileSync('src/assets/figma.json', JSON.stringify(data, null, 2));

  // Extract color styles & create CSS variables
  const styles = data ? data.styles : null;
  const colors = {};
  if (styles) {
    for (const [id, v] of Object.entries(styles)) {
      try {
        const style = v;
        // style may not contain paint data directly here; check document for paint nodes
        // This is a minimal fallback: write out style entries for further manual extraction
        colors[style.name] = style;
      } catch (e) {
        // ignore
      }
    }
  }

  fs.writeFileSync('src/assets/figma-styles.json', JSON.stringify(styles || {}, null, 2));
  // Generate a CSS file with placeholder variables (manual mapping may still be needed)
  let css = ':root {\n';
  Object.keys(colors).forEach((k, idx) => {
    const varName = `--figma-${k.replace(/\s+/g, '-').toLowerCase()}`;
    css += `  ${varName}: /* value to populate from figma */;\n`;
  });
  css += '}\n';
  fs.writeFileSync('src/assets/figma-tokens.css', css);

  console.log('Figma data saved to src/assets/figma.json and figma-styles.json. CSS variables saved to src/assets/figma-tokens.css (fill values manually or extend script).');
}

run().catch(e => { console.error(e); process.exit(1); });

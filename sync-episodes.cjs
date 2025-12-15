const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'data', 'episodes');
const destDir = path.join(__dirname, 'public', 'episodes');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md') || f.endsWith('.mp3') || f.endsWith('.m4a'));

for (const file of files) {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  console.log(`Copied ${file}`);
}

console.log('Episodios y audios sincronizados.');

const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx')) {
      callback(path.join(dirPath));
    }
  });
}

const pattern = /\s*onFocus=\{\(\) \=\> \{\s*if \(typeof window !== "undefined" && \(window as any\)\.gtag\) \{\s*\(window as any\)\.gtag\('event', 'conversion', \{\s*'send_to': '[^']+',\s*\}\);\s*\}\s*\}\}/g;

let changedFiles = 0;
walkDir(path.join(__dirname, 'src'), file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.match(pattern)) {
        const newContent = content.replace(pattern, '');
        fs.writeFileSync(file, newContent);
        console.log(`Updated ${file}`);
        changedFiles++;
    }
});
console.log(`Changed ${changedFiles} files.`);

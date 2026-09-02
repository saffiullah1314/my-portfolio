const fs = require('fs');
const path = require('path');

let data = fs.readFileSync(path.join(__dirname, '../src/data/constants.js'), 'utf8');

// Replace all imports with dummy variable declarations so it parses correctly
data = data.replace(/import\s+([a-zA-Z0-9_]+)\s+from\s+['"].*?['"];/g, 'const $1 = "image_url";');

// Replace exports with const
data = data.replace(/export\s+const/g, 'const');

// Append module.exports
data += '\nmodule.exports = { Bio, skills, experiences, education, projects };\n';

fs.writeFileSync(path.join(__dirname, 'seedData.js'), data);
console.log('Successfully created seedData.js');

// 把 dev-glb 打包成单文件（three.js + GLB base64）
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const dev = path.join(dir, 'dev-glb-engine');
const read = f => fs.readFileSync(path.join(dev, f), 'utf8');

let html = read('index.html');
const css = read('styles.css');
const vendor = ['vendor/three.min.js', 'vendor/GLTFLoader.js', 'vendor/OrbitControls.js', 'vendor/RoomEnvironment.js']
  .map(f => `/* ${f} */\n` + read(f)).join('\n;\n');
const app = read('app.js');

const glb = fs.readFileSync(path.join(dev, 'engine.glb')).toString('base64');

const safe = s => s.replace(/<\/script/gi, '<\\/script');

const bundle =
  'window.__GLB_B64__="' + glb + '";\n' +
  safe(vendor) + '\n;\n' + safe(app);

html = html
  .replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
  .replace(/<script src="vendor\/three\.min\.js"><\/script>\s*<script src="vendor\/GLTFLoader\.js"><\/script>\s*<script src="vendor\/OrbitControls\.js"><\/script>\s*<script src="vendor\/RoomEnvironment\.js"><\/script>\s*<script src="app\.js"><\/script>/,
    '<script>\n' + bundle + '\n</script>');

const out = path.join(dir, '热机-3D-threejs.html');
fs.writeFileSync(out, html, 'utf8');
console.log('built:', out, (html.length / 1024 / 1024).toFixed(2) + ' MB', 'glb:', (glb.length / 1024).toFixed(0) + ' KB b64');

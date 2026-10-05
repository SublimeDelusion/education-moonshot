import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let marked;
try { ({ marked } = await import('marked')); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  const require = createRequire(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'package.json'));
  ({ marked } = await import(require.resolve('marked')));
}
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const base = 'https://SublimeDelusion.github.io/education-moonshot/';
const repo = 'https://github.com/SublimeDelusion/education-moonshot/blob/main/';
const pages = [
  { route: '', label: 'Home', title: 'To make education more human.', source: 'src/messaging/home.md', eyebrow: 'Education Moonshot', description: 'A proposed model for purpose-driven, AI-accelerated post-secondary education.' },
  { route: 'students/', label: 'Student Q&A', title: 'Your questions, answered.', source: 'src/messaging/student-qa.md', eyebrow: 'For students', description: 'Twelve questions about learning, AI, professional experience, and the proposed University of Impact.' },
  { route: 'parents/', label: 'Parent Q&A', title: 'A clearer picture of the proposal.', source: 'src/messaging/parent-qa.md', eyebrow: 'For parents · First draft', description: 'What the proposed education model means for families, and what remains to be resolved.' },
  { route: 'operating-model/', label: 'Operating model', title: 'The university changes form each year.', source: 'src/model/operating-model.md', eyebrow: 'The model · In development', description: 'Explore the four-year operating model, from purpose and exploration to professional delivery.' }
];
function render(md) {
  let html = marked.parse(md);
  // Source-document links resolve to their authoritative repository homes.
  html = html.replace(/href="([^"]+\.md(?:#[^"]*)?)"/g, (_, href) => {
    if (/^https?:/.test(href)) return 'href="' + href + '"';
    const source = path.posix.normalize(path.posix.join('src/model', href));
    return 'href="' + repo + source + '"';
  });
  const ids = new Map();
  return html.replace(/<h([1-3])>(.*?)<\/h\1>/g, (_, level, text) => {
    let id = text.replace(/<[^>]+>/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const count = ids.get(id) || 0; ids.set(id, count + 1);
    if (count) id += '-' + count;
    return '<h' + level + ' id="' + id + '">' + text + '</h' + level + '>';
  }).replace(/<table>/g, '<div class="table-scroll" tabindex="0" aria-label="Scrollable table"><table>').replace(/<\/table>/g, '</table></div>');
}
for (const page of pages) {
  const prefix = page.route ? '../' : './';
  let content = read(page.source).replace(/^# .+\n/, '');
  let intro = '';
  if (!page.route) {
    content += '\n## Founding principles\n' + read('src/model/founding-principles.md').split('## 1.')[1].replace(/^/, '\n## 1.');
    intro = '<div class="pathways">' + pages.slice(1).map(p => '<a href="' + prefix + p.route + '"><span>' + p.label + '</span><p>' + p.description + '</p></a>').join('') + '</div>';
  }
  if (page.route === 'students/') {
    intro = '<p class="notice">These answers describe the proposed University of Impact. The institution and operating arrangements remain under development.</p>';
  }
  if (page.route === 'operating-model/') {
    content = content.slice(content.indexOf('# The Four-Year Shape'));
    intro = '<p class="notice"><strong>Working model.</strong> Year One, Year Two, and the Summer Founders Program incorporate the September 27 review. Year Three and later sections remain working drafts. Admissions, institutional economics, accreditation, ownership, and several operating mechanics remain open.</p>';
  }
  const body = render(content);
  const headingLevel = page.route === 'operating-model/' ? '1' : '2';
  const toc = [...body.matchAll(new RegExp('<h' + headingLevel + ' id="([^"]+)">(.*?)</h' + headingLevel + '>', 'g'))].map(m => '<a href="#' + m[1] + '">' + m[2] + '</a>').join('');
  // Only the page title is H1; manuscript section headings become H2/H3/H4.
  const article = page.route === 'operating-model/' ? body.replace(/<(\/?)(h[1-3])\b/g, (_, close, tag) => '<' + close + 'h' + (Number(tag[1]) + 1)) : body;
  const html = '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + esc(page.label + ' | Education Moonshot') + '</title><meta name="description" content="' + esc(page.description) + '"><link rel="canonical" href="' + base + page.route + '"><link rel="icon" href="' + prefix + 'assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="' + prefix + 'assets/site.css"></head><body><a class="skip" href="#main">Skip to content</a><header><div class="header-inner"><a class="brand" href="' + prefix + '">Education<br><strong>Moonshot<span> / </span></strong></a><nav aria-label="Main navigation">' + pages.map(p => '<a ' + (page.route === p.route ? 'aria-current="page" ' : '') + 'href="' + prefix + p.route + '">' + p.label + '</a>').join('') + '</nav></div></header><main id="main"><section class="masthead"><p class="eyebrow">' + page.eyebrow + '</p><h1>' + page.title + '</h1></section>' + intro + '<div class="reading-layout"><aside aria-label="On this page"><p class="eyebrow">On this page</p>' + toc + '</aside><article>' + article + '</article></div><div class="source"><a href="' + repo + page.source + '">Read the source document</a>' + (!page.route ? ' · <a href="' + repo + 'src/model/founding-principles.md">Founding principles source</a>' : '') + '</div></main><footer><p>To make education more human.</p><p>A proposed model. University of Impact is a working name.</p><a href="https://github.com/SublimeDelusion/education-moonshot">Education Moonshot repository</a></footer></body></html>\n';
  const dest = path.join(root, 'docs', page.route);
  fs.mkdirSync(dest, { recursive: true }); fs.writeFileSync(path.join(dest, 'index.html'), html);
}
fs.writeFileSync(path.join(root, 'docs', '.nojekyll'), '');
fs.mkdirSync(path.join(root, 'docs', 'diploma'), { recursive: true });
fs.copyFileSync(path.join(root, 'src', 'demo', 'graduate.json'), path.join(root, 'docs', 'diploma', 'graduate.json'));
const homePath = path.join(root, 'docs', 'index.html');
const diplomaLink = '<section class="notice"><h2>Explore a diploma of the future.</h2><p>Inspect a fictional graduate’s knowledge, people, and professional work. Ask a mock Professional Agent to find the evidence.</p><a href="./diploma/">Open the interactive diploma</a></section>';
fs.writeFileSync(homePath, fs.readFileSync(homePath, 'utf8').replace('<div class="reading-layout">', diplomaLink + '<div class="reading-layout">'));
console.log('Built four pages in docs/ from canonical src/ documents.');

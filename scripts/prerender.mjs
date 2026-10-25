// 빌드 후 실행: 글마다 본문이 담긴 HTML, robots.txt, sitemap.xml 생성 (검색엔진·SNS 미리보기용)
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://giujeong.me';
const DIST = 'dist';
const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function parse(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const meta = {};
  if (!m) return { meta, body: raw };
  m[1].split('\n').forEach((l) => { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
  return { meta, body: m[2].trim() };
}

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const homeDesc = '정기우 - 믿는 자, 질문하는 자, 문제 푸는 사람. 막연함에서 명료함으로.';

const headTags = ({ title, desc, url, type }) => `
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="정기우 | Digital Self" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="ko_KR" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@giujeong_me" />`;

// 홈에도 미리보기 카드 정보 추가
fs.writeFileSync(path.join(DIST, 'index.html'),
  template.replace('</head>', `${headTags({ title: '정기우 | Digital Self', desc: homeDesc, url: SITE + '/', type: 'website' })}\n  </head>`));

const dir = 'content/works';
const works = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  .map((f) => parse(fs.readFileSync(path.join(dir, f), 'utf8'))).filter((w) => w.meta.slug);

for (const { meta, body } of works) {
  const url = `${SITE}/works/${meta.slug}`;
  const title = `${meta.title} | 정기우`;
  const desc = meta.question ? `Q. ${meta.question} — ${body.split('\n')[0]}` : body.split('\n')[0];
  const article = `<article><p>Q. ${esc(meta.question || '')}</p><h1>${esc(meta.title)}</h1>` +
    body.split(/\n\s*\n/).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('') + `</article>`;
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace('</head>', `${headTags({ title, desc, url, type: 'article' })}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${article}</div>`);
  fs.mkdirSync(path.join(DIST, 'works', meta.slug), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'works', meta.slug, 'index.html'), html);
}

// 프로젝트 페이지 (글 목록 포함)
const pdir = 'content/projects';
const projects = fs.existsSync(pdir) ? fs.readdirSync(pdir).filter((f) => f.endsWith('.md'))
  .map((f) => parse(fs.readFileSync(path.join(pdir, f), 'utf8'))).filter((p) => p.meta.slug) : [];
for (const { meta, body } of projects) {
  const posts = works.filter((w) => w.meta.project === meta.slug).sort((a, b) => (b.meta.date || '').localeCompare(a.meta.date || ''));
  const url = `${SITE}/projects/${meta.slug}`;
  const title = `${meta.title} | 정기우`;
  const desc = meta.question ? `Q. ${meta.question} — ${body.split('\n')[0]}` : body.split('\n')[0];
  const article = `<article><p>Q. ${esc(meta.question || '')}</p><h1>${esc(meta.title)}</h1><p>${esc(body).replace(/\n/g, '<br>')}</p><ul>` +
    posts.map((w) => `<li><a href="/works/${w.meta.slug}">${esc(w.meta.title)}</a></li>`).join('') + `</ul></article>`;
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(desc)}" />`)
    .replace('</head>', `${headTags({ title, desc, url, type: 'website' })}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${article}</div>`);
  fs.mkdirSync(path.join(DIST, 'projects', meta.slug), { recursive: true });
  fs.writeFileSync(path.join(DIST, 'projects', meta.slug, 'index.html'), html);
  meta.updated = posts[0]?.meta.date;
}

const urls = [{ loc: SITE + '/' },
  ...projects.map((p) => ({ loc: `${SITE}/projects/${p.meta.slug}`, lastmod: p.meta.updated })),
  ...works.map((w) => ({ loc: `${SITE}/works/${w.meta.slug}`, lastmod: w.meta.date }))];
fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') + `\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`prerender: 프로젝트 ${projects.length}개, 글 ${works.length}개, sitemap.xml, robots.txt`);

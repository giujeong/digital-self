// content/works/*.md 를 빌드 시점에 읽어 글 자산으로 만든다 (원본 = 마크다운 파일, 이력 = git)
const files = import.meta.glob('../content/works/*.md', { as: 'raw', eager: true });

function parse(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  m[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return { meta, body: m[2].trim() };
}

export const mdWorks = Object.values(files)
  .map((raw) => {
    const { meta, body } = parse(raw);
    return { ...meta, body, origin: 'md' };
  })
  .filter((w) => w.slug)
  // 같은 날짜가 여러 편이면 frontmatter time:(HH:MM)이 늦은 글이 먼저 — RECENT가 날짜만으로는 순서를 못 정함
  .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.time || '').localeCompare(a.time || ''));

export const findWork = (slug) => mdWorks.find((w) => w.slug === slug);

// content/projects/*.md — 프로젝트(여러 글을 묶는 단위). 글은 frontmatter project: <slug> 로 연결
const projectFiles = import.meta.glob('../content/projects/*.md', { as: 'raw', eager: true });

export const mdProjects = Object.values(projectFiles)
  .map((raw) => {
    const { meta, body } = parse(raw);
    return { ...meta, body };
  })
  .filter((p) => p.slug)
  .map((p) => {
    const posts = mdWorks.filter((w) => w.project === p.slug);
    const base = { ...p, posts, updated: posts[0]?.date || '' };
    if (p.type !== 'book' && p.type !== 'guide') return base;
    // 책: 본문의 '목차' 줄 아래가 살아있는 목차. 글은 frontmatter toc: 로 목차 줄과 연결
    const [intro, tocRaw = ''] = p.body.split(/\n목차\n/);
    const toc = tocRaw.split('\n').filter((l) => l.trim()).map((l) => {
      const text = l.trim();
      return { text, sub: /^\s/.test(l), post: posts.find((w) => w.toc === text) || null };
    });
    const reading = toc.filter((t) => t.post).map((t) => t.post);
    return { ...base, intro: intro.trim(), toc, reading };
  })
  .sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99) || (b.updated || '').localeCompare(a.updated || ''));

export const findProject = (slug) => mdProjects.find((p) => p.slug === slug);
export const standaloneWorks = mdWorks.filter((w) => !w.project);

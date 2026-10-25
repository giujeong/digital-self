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
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

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
    return { ...p, posts, updated: posts[0]?.date || '' };
  })
  .sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99) || (b.updated || '').localeCompare(a.updated || ''));

export const findProject = (slug) => mdProjects.find((p) => p.slug === slug);
export const standaloneWorks = mdWorks.filter((w) => !w.project);

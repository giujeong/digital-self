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
    return { ...meta, body, source: 'md' };
  })
  .filter((w) => w.slug)
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

export const findWork = (slug) => mdWorks.find((w) => w.slug === slug);

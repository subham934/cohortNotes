import React, { useRef, useEffect, useState } from 'react';

const KEYWORDS = new Set(['function','const','let','var','return','if','else','for','while','throw','new','class','import','export','default','typeof','true','false','null','undefined','async','await','try','catch','of','in','switch','case','break','continue']);

const tokenizeLine = (line) => {
  const parts = [];
  let rem = line, key = 0;
  while (rem.length > 0) {
    if (rem.startsWith('//')) {
      parts.push(<span key={key++} style={{ color: '#4b5563', fontStyle: 'italic' }}>{rem}</span>);
      rem = ''; continue;
    }
    const strM = rem.match(/^(["'`])(?:(?!\1)[^\\]|\\.)*\1/);
    if (strM) { parts.push(<span key={key++} style={{ color: '#86efac' }}>{strM[0]}</span>); rem = rem.slice(strM[0].length); continue; }
    const numM = rem.match(/^\b\d+\.?\d*\b/);
    if (numM) { parts.push(<span key={key++} style={{ color: '#fbbf24' }}>{numM[0]}</span>); rem = rem.slice(numM[0].length); continue; }
    const wordM = rem.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/);
    if (wordM) {
      const w = wordM[0];
      const isKw = KEYWORDS.has(w);
      const isFn = !isKw && rem[w.length] === '(';
      const isCap = !isKw && !isFn && /^[A-Z]/.test(w);
      const color = isKw ? '#c084fc' : isFn ? '#93c5fd' : isCap ? '#67e8f9' : '#e2e8f0';
      const fw = isKw ? 600 : 400;
      parts.push(<span key={key++} style={{ color, fontWeight: fw }}>{w}</span>);
      rem = rem.slice(w.length); continue;
    }
    parts.push(<span key={key++}>{rem[0]}</span>);
    rem = rem.slice(1);
  }
  return parts;
};

const CodeBlock = ({ code, lang = 'js' }) => {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden', margin: '12px 0',
      background: 'rgba(0, 0, 8, 0.7)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Traffic light dots */}
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.6 }} />
          ))}
          <span style={{ marginLeft: 4, fontSize: 10, color: '#475569', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {lang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 6, padding: '2px 10px',
            fontSize: 10, color: copied ? '#34d399' : '#64748b',
            cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em',
            transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        {/* Line numbers */}
        <div style={{
          padding: '14px 0', minWidth: 40,
          background: 'rgba(0,0,0,0.2)',
          borderRight: '1px solid rgba(255,255,255,0.03)',
          userSelect: 'none', flexShrink: 0,
        }}>
          {lines.map((_, i) => (
            <div key={i} style={{ padding: '0 10px 0 12px', fontSize: 11, lineHeight: '22px', color: '#1e293b', fontFamily: 'monospace', textAlign: 'right' }}>
              {i + 1}
            </div>
          ))}
        </div>
        {/* Code lines */}
        <pre style={{ margin: 0, padding: '14px 16px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12.5, lineHeight: '22px', color: '#e2e8f0', flex: 1, minWidth: 0 }}>
          <code>
            {lines.map((line, i) => (
              <div key={i}>{tokenizeLine(line.length ? line : ' ')}</div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

const parseInline = (text) => {
  const parts = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let i = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > i) parts.push(text.slice(i, m.index));
    if (m[2]) parts.push(<strong key={m.index} style={{ fontWeight: 600, color: '#f1f5f9' }}>{m[2]}</strong>);
    if (m[3]) parts.push(<code key={m.index} style={{ fontFamily: 'monospace', fontSize: '0.85em', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 4, padding: '1px 5px', color: '#a5b4fc' }}>{m[3]}</code>);
    i = re.lastIndex;
  }
  if (i < text.length) parts.push(text.slice(i));
  return parts;
};

const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const parts = [];
  const codeRe = /```([\w]*)\n?([\s\S]*?)```/g;
  let last = 0, m;
  while ((m = codeRe.exec(content)) !== null) {
    if (m.index > last) parts.push({ type: 'text', val: content.slice(last, m.index) });
    parts.push({ type: 'code', lang: m[1] || 'js', val: m[2].trim() });
    last = codeRe.lastIndex;
  }
  if (last < content.length) parts.push({ type: 'text', val: content.slice(last) });

  const renderText = (text, bi) =>
    text.split('\n').map((line, li) => {
      const t = line.trim();
      if (!t) return null;
      if (t.startsWith('### ')) return <h3 key={`${bi}-${li}`} style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '16px 0 6px' }}>{parseInline(t.slice(4))}</h3>;
      if (t.startsWith('## ')) return <h2 key={`${bi}-${li}`} style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', margin: '14px 0 6px' }}>{parseInline(t.slice(3))}</h2>;
      if (t.match(/^[-*] /)) return <div key={`${bi}-${li}`} style={{ display: 'flex', gap: 8, margin: '3px 0' }}><span style={{ color: '#4b5563', flexShrink: 0, marginTop: 2 }}>›</span><span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{parseInline(t.slice(2))}</span></div>;
      const nm = t.match(/^(\d+)\. (.*)/);
      if (nm) return <div key={`${bi}-${li}`} style={{ display: 'flex', gap: 8, margin: '3px 0' }}><span style={{ color: '#4b5563', flexShrink: 0, fontSize: 11, fontFamily: 'monospace', minWidth: 16 }}>{nm[1]}.</span><span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{parseInline(nm[2])}</span></div>;
      return <p key={`${bi}-${li}`} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: '5px 0' }}>{parseInline(line)}</p>;
    });

  return (
    <div>
      {parts.map((p, i) =>
        p.type === 'code'
          ? <CodeBlock key={i} code={p.val} lang={p.lang} />
          : <div key={i}>{renderText(p.val, i)}</div>
      )}
    </div>
  );
};

export default MarkdownRenderer;

import { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import { colors, btn } from '../tokens';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const SYSTEM_PROMPT =
  'Du är ett AI-säljstöd för fältsäljare i dagligvaruhandeln. Ge korta, konkreta och handlingsorienterade svar på svenska. Fokusera på orderrekommendationer, kampanjmöjligheter och butiksanpassade råd. Håll svar under 3 meningar.';

const SUGGESTIONS = [
  'Orderrekommendation för Willys Södermalm',
  'Vilka kampanjer passar ICA Maxi?',
  'Space-rekommendation för Coop Forum Nacka',
];

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'ai',
    text: 'Hej! Jag har analyserat din butikslista och har rekommendationer för dig idag. Vill du se orderrekommendationer för Willys Södermalm?',
  },
];

export default function AIAdvisory() {
  const [chat, setChat] = useState<Message[]>(INITIAL_MESSAGES);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const send = async (text?: string) => {
    const t = text ?? msg;
    if (!t.trim() || loading) return;
    setMsg('');
    setChat((prev) => [...prev, { role: 'user', text: t }]);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
      if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          // Required for browser: CORS support must be enabled on the proxy
          // For production, route this through a server-side proxy instead.
          'anthropic-dangerous-request-proxy': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            ...chat.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: t },
          ],
        }),
      });

      const data = await res.json();
      const reply =
        (data.content as { type: string; text: string }[] | undefined)?.find((b) => b.type === 'text')?.text ??
        'Tyvärr kunde jag inte svara just nu.';
      setChat((prev) => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setChat((prev) => [...prev, { role: 'ai', text: 'Tyvärr uppstod ett fel. Kontrollera att VITE_ANTHROPIC_API_KEY är satt.' }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>
      {/* Header + suggestions */}
      <div style={{ padding: '20px 20px 0', flexShrink: 0 }}>
        <h1 style={{ margin: '0 0 2px', fontSize: 26, fontWeight: 700, color: colors.text }}>AI Rådgivning</h1>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: colors.mid }}>Butiksanpassade rekommendationer</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                ...btn(colors.blueBg, colors.blue, {
                  border: `1px solid ${colors.blueBorder}`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: 13,
                  fontWeight: 500,
                  minHeight: 44,
                }),
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Message list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {chat.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              style={{
                maxWidth: '82%',
                background: m.role === 'user' ? colors.blue : colors.bg,
                border: m.role === 'ai' ? `1px solid ${colors.border}` : 'none',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '11px 14px',
              }}
            >
              <p style={{ margin: 0, fontSize: 14, color: m.role === 'user' ? '#fff' : colors.text, lineHeight: 1.55 }}>
                {m.text}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '16px 16px 16px 4px',
                padding: '11px 16px',
              }}
            >
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      background: colors.soft,
                      animation: `pulse ${0.6 + i * 0.2}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          padding: '10px 16px',
          background: colors.bg,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <button
          style={{
            ...btn(colors.bgMuted, colors.mid, {
              width: 40,
              height: 40,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }),
          }}
        >
          <Icon name="mic" size={18} color={colors.mid} />
        </button>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ställ en fråga…"
          style={{
            flex: 1,
            border: `1px solid ${colors.border}`,
            borderRadius: 10,
            padding: '10px 13px',
            fontSize: 15,
            outline: 'none',
            color: colors.text,
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={() => send()}
          style={{
            ...btn(colors.blue, '#fff', {
              width: 40,
              height: 40,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }),
          }}
        >
          <Icon name="send" size={17} color="#fff" />
        </button>
      </div>

      <style>{`@keyframes pulse { from { transform: scale(1) } to { transform: scale(1.4) } }`}</style>
    </div>
  );
}

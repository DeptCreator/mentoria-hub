'use client';

export default function CTASection() {
  return (
    <section className="px-6 py-[60px] pb-[100px]" style={{ background: 'var(--bg)' }}>
      <div className="glass glass-xl max-w-[600px] mx-auto p-10 text-center">
        <h3 className="font-display text-[2rem] font-bold mb-2" style={{ color: 'var(--fg)' }}>
          Join Mentoria
        </h3>
        <p className="mb-6" style={{ color: 'var(--fg-dim)' }}>
          Get personalized recommendations straight to your inbox.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); alert('Welcome to Mentoria! 🎉'); }}
          className="flex gap-2.5 flex-wrap justify-center">
          <input
            type="email"
            placeholder="your@email.com"
            required
            className="flex-1 min-w-[200px] rounded-full px-5 py-3 text-[15px] outline-none font-sans"
            style={{
              border: '1.5px solid var(--border-strong)',
              background: 'var(--surface)',
              color: 'var(--fg)',
            }}
          />
          <button
            type="submit"
            className="rounded-full px-7 py-3 text-[15px] font-semibold transition-all cursor-pointer font-sans"
            style={{
              background: 'var(--accent)',
              color: '#0a0a0f',
              boxShadow: '0 0 40px var(--accent-glow)',
            }}
            onMouseOver={e => { e.currentTarget.style.filter = 'brightness(1.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; }}
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

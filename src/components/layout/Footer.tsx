export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]" style={{ background: 'var(--bg-alt)' }}>
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo-icon.svg" alt="M" className="w-8 h-8" />
              <span className="font-display text-[20px] font-bold" style={{ color: 'var(--fg)' }}>Mentoria</span>
            </div>
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--fg-dim)' }}>
              Empowering students in Kazakhstan & CIS with educational opportunities and async learning.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-[14px] mb-4 uppercase tracking-wider" style={{ color: 'var(--fg)' }}>Platform</h4>
            <ul className="space-y-2">
              {['Opportunities', 'Courses', 'Roadmap', 'Dashboard'].map(item => (
                <li key={item}>
                  <a href={`/${item.toLowerCase()}`} className="text-[14px] no-underline transition-all" style={{ color: 'var(--fg-dim)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-dim)'}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[14px] mb-4 uppercase tracking-wider" style={{ color: 'var(--fg)' }}>Resources</h4>
            <ul className="space-y-2">
              {['Help Center', 'Blog', 'Community', 'Mentors'].map(item => (
                <li key={item}>
                  <span className="text-[14px] cursor-default" style={{ color: 'var(--fg-dim)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[14px] mb-4 uppercase tracking-wider" style={{ color: 'var(--fg)' }}>Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <li key={item}>
                  <span className="text-[14px] cursor-default" style={{ color: 'var(--fg-dim)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[13px]" style={{ color: 'var(--muted)' }}>
            © 2026 Mentoria Hub. Built for students in Kazakhstan & CIS.
          </p>
          <div className="flex items-center gap-4">
            {['🇰🇿', '🇷🇺', '🇬🇧'].map(flag => (
              <span key={flag} className="text-[18px] cursor-pointer opacity-60 hover:opacity-100 transition-opacity">{flag}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

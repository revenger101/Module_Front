import { Link } from 'react-router-dom';

function SignInPage({ form, onFormChange, onSubmit, loading, status, theme, onToggleTheme }) {
  return (
    <div className="auth-shell">
      <section className="auth-card">
        <div className="top-actions">
          <span className="eyebrow">TuniShop Commerce</span>
          <button type="button" className="theme-toggle" onClick={onToggleTheme}>
            {theme === 'night' ? 'Aurora Theme' : 'Night Theme'}
          </button>
        </div>
        <h1>Sign In</h1>
        <p className="muted">Access your account to continue.</p>
        <form className="stack" onSubmit={onSubmit}>
          <input
            placeholder="Username"
            value={form.username}
            onChange={(event) => onFormChange((prev) => ({ ...prev, username: event.target.value }))}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => onFormChange((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <button type="submit" disabled={loading}>Enter</button>
        </form>
        <p className="status" aria-live="polite">{loading ? 'Working...' : status}</p>
        <p className="auth-footnote">
          No account yet? <Link to="/signup">Create one</Link>
        </p>
      </section>
    </div>
  );
}

export default SignInPage;

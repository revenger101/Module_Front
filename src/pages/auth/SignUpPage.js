import { Link } from 'react-router-dom';

function SignUpPage({ form, onFormChange, onSubmit, loading, status, theme, onToggleTheme }) {
  return (
    <div className="auth-shell">
      <section className="auth-card">
        <div className="top-actions">
          <span className="eyebrow">TuniShop Commerce</span>
          <button type="button" className="theme-toggle" onClick={onToggleTheme}>
            {theme === 'night' ? 'Aurora Theme' : 'Night Theme'}
          </button>
        </div>
        <h1>Sign Up</h1>
        <p className="muted">Create a customer account to browse products.</p>
        <form className="stack" onSubmit={onSubmit}>
          <input
            placeholder="Username"
            value={form.username}
            onChange={(event) => onFormChange((prev) => ({ ...prev, username: event.target.value }))}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => onFormChange((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => onFormChange((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <button type="submit" disabled={loading}>Create Account</button>
        </form>
        <p className="status" aria-live="polite">{loading ? 'Working...' : status}</p>
        <p className="auth-footnote">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </section>
    </div>
  );
}

export default SignUpPage;

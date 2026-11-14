import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('MLZIDLA page render failed', error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main role="alert" className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <h1 className="mb-3 text-2xl font-semibold">Stránku se nepodařilo zobrazit</h1>
        <p className="mb-6 max-w-lg text-sm text-slate-300">
          Zkuste stránku znovu načíst. Pokud chyba přetrvává, kontaktujte správce webu MLŽIDLA.cz.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
        >
          Načíst znovu
        </button>
      </main>
    );
  }
}

import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

const AUTH_LOGOUT_URL = 'https://auth.polisportivacastelvieto.it/api/logout';

export default function Logout(): React.ReactElement {
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    fetch(AUTH_LOGOUT_URL, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          setStatus('done');
          window.location.href = '/';
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout title="Esci" description="Disconnessione">
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        {status === 'loading' && <p>Disconnessione in corso…</p>}
        {status === 'done' && <p>Disconnesso. Reindirizzamento…</p>}
        {status === 'error' && (
          <p>
            Non è stato possibile uscire automaticamente.{' '}
            <a href="https://auth.polisportivacastelvieto.it/" rel="noopener noreferrer">
              Apri la porta Authelia
            </a>{' '}
            e usa Esci da lì.
          </p>
        )}
      </main>
    </Layout>
  );
}

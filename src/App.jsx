import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';

export default function App() {
  const [page, setPage] = useState('home');
  const [answers, setAnswers] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tm_answers');
      if (saved) {
        setAnswers(JSON.parse(saved));
        setPage('result');
      }
    } catch {
      // ignore
    }
  }, []);

  function save(ans) {
    setAnswers(ans);
    try {
      localStorage.setItem('tm_answers', JSON.stringify(ans));
    } catch {
      // ignore
    }
  }
  function reset() {
    setAnswers(null);
    try {
      localStorage.removeItem('tm_answers');
    } catch {
      // ignore
    }
    setPage('home');
  }

  return (
    <div className="app">
      {page === 'home' && <Home onStart={() => setPage('quiz')} onRestore={(ans) => { save(ans); setPage('result'); }} />}
      {page === 'quiz' && <Quiz onDone={(ans) => { save(ans); setPage('result'); }} onHome={reset} />}
      {page === 'result' && answers && <Result answers={answers} onReset={reset} />}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Room from './pages/Room';

function useAnswers() {
  const [answers, setAnswers] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tm_answers');
      if (saved) setAnswers(JSON.parse(saved));
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
  }

  return { answers, save, reset };
}

function HomeOrResult({ answers, save }) {
  const navigate = useNavigate();
  if (answers) return <Result answers={answers} onReset={() => navigate('/reset')} />;
  return (
    <Home
      onStart={() => navigate('/quiz')}
      onRestore={(ans) => {
        save(ans);
        navigate('/');
      }}
    />
  );
}

function QuizPage({ save }) {
  const navigate = useNavigate();
  return (
    <Quiz
      onDone={(ans) => {
        save(ans);
        navigate('/');
      }}
      onHome={() => navigate('/')}
    />
  );
}

function ResetPage({ reset }) {
  const navigate = useNavigate();
  useEffect(() => {
    reset();
    navigate('/', { replace: true });
  }, []);
  return null;
}

export default function App() {
  const { answers, save, reset } = useAnswers();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <HomeOrResult answers={answers} save={save} />
            </div>
          }
        />
        <Route
          path="/quiz"
          element={
            <div className="app">
              <QuizPage save={save} />
            </div>
          }
        />
        <Route path="/reset" element={<ResetPage reset={reset} />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

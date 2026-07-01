import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Detail from './Detail';
import type { Goal } from './types';
import { colors, maxWidth } from './theme';

export default function LiftApp() {
  const [goal, setGoal] = useState<Goal>('total');

  return (
    <BrowserRouter>
      <div
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          background: colors.bg,
          color: colors.text,
          minHeight: '100vh',
          maxWidth,
          margin: '0 auto',
        }}
      >
        <Routes>
          <Route path="/" element={<Home goal={goal} onGoalChange={setGoal} />} />
          <Route path="/exercise/:id" element={<Detail goal={goal} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

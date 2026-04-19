import React, { useState } from 'react';
import Intro from './components/Intro';
import A2ZSheetLayout from './components/A2ZSheetLayout';

function App() {
  const [showMain, setShowMain] = useState(false);

  if (!showMain) {
    return <Intro onStart={() => setShowMain(true)} />;
  }
  return <A2ZSheetLayout />;
}

export default App;
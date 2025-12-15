import { useState, useEffect } from 'react';
import DigitalSelf from './DigitalSelf';
import Admin from './Admin';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkPath = () => {
      setIsAdmin(window.location.hash === '#/admin');
    };
    
    checkPath();
    window.addEventListener('hashchange', checkPath);
    return () => window.removeEventListener('hashchange', checkPath);
  }, []);

  if (isAdmin) {
    return <Admin />;
  }

  return <DigitalSelf />;
}

export default App;

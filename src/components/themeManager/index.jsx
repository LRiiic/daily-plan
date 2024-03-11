import React, { useEffect, useState } from 'react';

const ThemeManager = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    const updateTheme = (e) => {
      setDarkMode(e.matches);
    };
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', updateTheme);
    return () => {
      darkModeQuery.removeEventListener('change', updateTheme);
    };
  }, []);

  return (
    <div className={darkMode ? 'dark-theme' : 'light-theme'}>
      {children}
    </div>
  );
};

export default ThemeManager;

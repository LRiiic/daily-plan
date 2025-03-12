import React, { useEffect, useState } from 'react';

const ThemeManager = ({ children }) => {
  // Estado para controlar o modo escuro
  const [darkMode, setDarkMode] = useState(false);

  // Efeito para verificar a preferência inicial do sistema
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
    
    // Aplicar a classe diretamente ao elemento document.body
    if (prefersDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, []);

  // Efeito para detectar mudanças na preferência do sistema
  useEffect(() => {
    const updateTheme = (e) => {
      setDarkMode(e.matches);
      
      // Atualizar classes no body quando a preferência do sistema mudar
      if (e.matches) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      }
    };
    
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Usar o método de evento correto dependendo do navegador
    if (darkModeQuery.addEventListener) {
      darkModeQuery.addEventListener('change', updateTheme);
      return () => darkModeQuery.removeEventListener('change', updateTheme);
    } else {
      // Fallback para navegadores mais antigos
      darkModeQuery.addListener(updateTheme);
      return () => darkModeQuery.removeListener(updateTheme);
    }
  }, []);

  // Função para alternar o tema manualmente (pode ser exposta via contexto)
  const toggleTheme = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      
      if (newMode) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      }
      
      return newMode;
    });
  };

  return (
    <div className={darkMode ? 'theme-container dark-theme' : 'theme-container light-theme'}>
      {/* Opcionalmente adicionar um botão para alternar o tema */}
      {/* <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? '☀️' : '🌙'}
      </button> */}
      {children}
    </div>
  );
};

export default ThemeManager;
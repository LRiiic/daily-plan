import React, { useEffect, useState } from 'react';

const ThemeManager = ({ children }) => {
  // Estado para controlar o modo escuro
  // Verifica se há uma preferência salva no localStorage, caso contrário, usa light como padrão
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Efeito para aplicar o tema inicial
  useEffect(() => {
    // Aplicar o tema com base no estado atual
    if (darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // Função para alternar o tema manualmente
  const toggleTheme = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      
      // Salvar a preferência no localStorage
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      return newMode;
    });
  };

  // Em seu componente principal ou ThemeProvider
  useEffect(() => {
    // Seleciona a meta tag theme-color ou cria uma se não existir
    let metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    // Atualiza a cor com base no tema atual
    metaThemeColor.content = darkMode ? '#1E1E2E' : '#F8F9FA';
  }, [darkMode]);

  return (
    <div className={darkMode ? 'theme-container dark-theme' : 'theme-container light-theme'}>
      {/* Botão para alternar o tema */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? '☀️' : '🌙'}
      </button>
      {children}
    </div>
  );
};

export default ThemeManager;
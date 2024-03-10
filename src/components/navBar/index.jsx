import { React } from "react";
import DailyPlanLogo from '/dailyplan-logo.svg'
import '../../index.css';
import './style.css';
import { useEffect, useState } from "react";

function NavBar({ setTasks }) {
  const [showHelp, setShowHelp] = useState(false);
  const [exportedData, setExportedData] = useState('');
  const [messageImport, setMessageImport] = useState('');

  function toggleHelp() {
    setShowHelp(!showHelp);
  }

  function exportData() {
    const data = localStorage.getItem('tasks');
    setExportedData(data);

    navigator.clipboard.writeText(data);
  }

  function importData() {
    if (exportedData) {
      try {
        setTasks(JSON.parse(exportedData));
        setMessageImport('Tarefas importadas com sucesso!');
      } catch (error) {
        setMessageImport('Erro ao importar tarefas.');
        console.error(error);
        return;
      }
    }
  }

  function copyData() {
    navigator.clipboard.writeText(exportedData);
  }

  return (
    <>
      <nav>
        <img src={DailyPlanLogo} alt="Daily Plan Logo" width="50%"/>

        <span className="helpBtn" onClick={toggleHelp}><i></i></span>
      </nav>

      {showHelp &&
      <div className='helpContainer'>
        <h2><i></i>Ajuda</h2>
        <h3><small>●</small>Tarefas gerais</h3>
        <p>No bloco tarefas gerais, você pode criar tarefas permanentes que seu status só mudarão ao apertar para marcar ou desmarcar.</p>

        <h3><small>●</small> Manhã / Tarde / Noite</h3>
        <p>Blocos para organizar a rotina. <br/>Neles você pode criar tarefas para cada periodo do dia. Todas essas tarefas serão resetadas ao iniciar de cada dia.</p>
        <h3><small>●</small>Funções</h3>
        <p>Você pode remover uma tarefa ao arrastar ela para a esquerda.</p>
        <h3><small>●</small>Progresso</h3>
        <p>Somente tarefas da rotina contam para o progresso. Seu progresso é calculado pelo total de tarefas cadastradas e por tarefas concluídas.</p>

        <div className="importExport">
          <h4>Importar / Exportar tarefas</h4>
          <span className="message">{messageImport}</span>
          <input type="text" value={exportedData} onChange={(e) => setExportedData(e.target.value)}/>
          <button className="copyBtn" onClick={copyData}><i></i></button>
          <button onClick={importData}>Importar</button>
          <button onClick={exportData}>Exportar</button>
        </div>

        <span className="close" onClick={toggleHelp}>Fechar</span>
      </div>}
    </>
  );
}

export default NavBar;
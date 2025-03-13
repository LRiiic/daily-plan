import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/navBar";
import TaskList from "../../components/taskList";
import Toast from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import { Droppable } from 'react-beautiful-dnd';
import { parse, format, subDays, set } from 'date-fns';
import '../../App.css';
import './style.css';

function Home() {
    const navigate = useNavigate();
  
    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [points, setPoints] = useState(0);
    const [currentPoints, setCurrentPoints] = useState(0);
  
    const [morningTotal, setMorningTotal] = useState(0);
    const [morningCompleted, setMorningCompleted] = useState(0);
    const [afternoonTotal, setAfternoonTotal] = useState(0);
    const [afternoonCompleted, setAfternoonCompleted] = useState(0);
    const [nightTotal, setNightTotal] = useState(0);
    const [nightCompleted, setNightCompleted] = useState(0);
  
    const [isIOS, setIsIOS] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [pwaFullScreen, setPwaFullScreen] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    
    // Toast state
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });
  
    // Estados para controlar a abertura/fechamento das seções
    const [sectionStates, setSectionStates] = useState({
        general: { isOpen: true, autoCollapse: false, wasManuallyOpened: false },
        morning: { isOpen: true, autoCollapse: false, wasManuallyOpened: false },
        afternoon: { isOpen: true, autoCollapse: false, wasManuallyOpened: false },
        night: { isOpen: true, autoCollapse: false, wasManuallyOpened: false }
    });
  
    // Função para mostrar toast
    const showToast = (message, type = 'success') => {
        setToast({
            show: true,
            message,
            type
        });
    };
    
    // Função para fechar toast
    const closeToast = () => {
        setToast(prev => ({
            ...prev,
            show: false
        }));
    };
    
    // Efeito para verificar se todas as tarefas de uma seção estão concluídas
    useEffect(() => {
        if (tasks && tasks.length > 0) {
            const newSectionStates = { ...sectionStates };
            
            // Verifica cada seção
            ['general', 'morning', 'afternoon', 'night'].forEach(section => {
                const sectionTasks = tasks.filter(task => task.tag === section);
                const allCompleted = sectionTasks.length > 0 && sectionTasks.every(task => task.completed);
                
                // Só colapsa automaticamente se não foi aberto manualmente após completar
                if (allCompleted && !newSectionStates[section].wasManuallyOpened) {
                    newSectionStates[section] = {
                        ...newSectionStates[section],
                        isOpen: false,
                        autoCollapse: true
                    };
                } else if (!allCompleted && newSectionStates[section].autoCollapse) {
                    // Se alguma tarefa foi desmarcada, reseta o estado
                    newSectionStates[section] = {
                        ...newSectionStates[section],
                        autoCollapse: false,
                        wasManuallyOpened: false
                    };
                }
            });
            
            setSectionStates(newSectionStates);
        }
    }, [tasks]);
  
    // Carrega as tarefas do localStorage ao inicializar
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(storedTasks);
        
        // Verificar preferência de tema
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
            setDarkMode(savedTheme === 'true');
        }
    }, []);
  
    // Aplica o tema quando darkMode muda
    useEffect(() => {
        document.body.classList.toggle('dark-theme', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);
  
    // Atualiza as tarefas e pontos periodicamente
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const updatedTasks = tasks.map(task => ({
                ...task,
                date: parse(format(parse(task.date, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy'), 'dd/MM/yyyy', new Date()).getDate() !== now.getDate() && task.tag !== 'general' ? new Date().toLocaleDateString() : task.date,
                completed: parse(format(parse(task.date, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy'), 'dd/MM/yyyy', new Date()).getDate() !== now.getDate() && task.tag !== 'general' ? false : task.completed
            }));
            setTasks(updatedTasks);
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }, 1000);
  
        // Calcula pontos e tarefas completas
        if (tasks) {
            const totalTasks = tasks.filter(task => task.tag !== 'general');
            setPoints(totalTasks.length * 100);
  
            const totalCompleted = tasks.filter(task => task.completed && task.tag !== 'general');
            setCurrentPoints(totalCompleted.length * 100);
  
            const totalMorning = tasks.filter(task => task.tag === 'morning');
            const totalMorningCompleted = tasks.filter(task => task.tag === 'morning' && task.completed);
            setMorningTotal(totalMorning.length);
            setMorningCompleted(totalMorningCompleted.length);
  
            const totalAfternoon = tasks.filter(task => task.tag === 'afternoon');
            const totalAfternoonCompleted = tasks.filter(task => task.tag === 'afternoon' && task.completed);
            setAfternoonTotal(totalAfternoon.length);
            setAfternoonCompleted(totalAfternoonCompleted.length);
  
            const totalNight = tasks.filter(task => task.tag === 'night');
            const totalNightCompleted = tasks.filter(task => task.tag === 'night' && task.completed);
            setNightTotal(totalNight.length);
            setNightCompleted(totalNightCompleted.length);
        }
  
        return () => clearInterval(interval);
    }, [tasks]);
  
    // Cria uma nova tarefa
    function createTask(tag) {
        if (!taskTitle.trim()) {
            document.querySelector(`#${tag} .new-task-display`).style.display = '';
            return;
        }
  
        const newTask = {
            id: Date.now(),
            title: taskTitle,
            time: '00:00',
            tag: tag,
            completed: false,
            date: new Date().toLocaleDateString(),
        };
  
        const newTasks = tasks ? [...tasks, newTask] : [newTask];
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        setTasks(newTasks);
        setTaskTitle('');
        document.querySelector(`#${tag} .new-task-display`).style.display = '';
        
        // Mostrar toast de confirmação
        showToast(`Tarefa "${taskTitle}" criada.`, 'success');
        
        // Quando uma nova tarefa é criada, abre a seção automaticamente
        setSectionStates(prev => ({
            ...prev,
            [tag]: {
                ...prev[tag],
                isOpen: true,
                autoCollapse: false
            }
        }));
    }
  
    // Manipula o pressionar de teclas no input de nova tarefa
    function keydown(e, tag) {
        if (e.key === 'Enter') {
            createTask(tag);
        }
    }
  
    // Exibe o input para nova tarefa
    function handleNewTask(tag) {
        document.querySelector(`#${tag} .new-task-display`).style.display = 'flex';
        document.querySelector(`#${tag} .new-task-input`).focus();
        
        // Quando o usuário vai adicionar uma tarefa, abre a seção automaticamente
        setSectionStates(prev => ({
            ...prev,
            [tag]: {
                ...prev[tag],
                isOpen: true,
                autoCollapse: false
            }
        }));
    }
  
    // Completa ou descompleta uma tarefa
    function completeTask(task) {
        const updatedTasks = tasks.map(t =>
            t.id === task.id ? { ...t, completed: !t.completed } : t
        );
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    }
  
    // Remove uma tarefa
    function removeTask(taskId) {
        // Encontrar a tarefa para usar o título na mensagem de toast
        const taskToRemove = tasks.find(t => t.id === taskId);
        const taskTitle = taskToRemove ? taskToRemove.title : 'Tarefa';
        
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        
        // Mostrar toast de remoção
        showToast(`Tarefa "${taskTitle}" removida.`, 'error');
    }
  
    // Alterna a exibição de seções de tarefas
    function toggleSection(section) {
        setSectionStates(prev => {
            const newState = { ...prev };
            const isCurrentlyOpen = newState[section].isOpen;
            
            // Se estiver fechando, apenas fecha
            if (isCurrentlyOpen) {
                newState[section] = {
                    ...newState[section],
                    isOpen: false
                };
            } else {
                // Se estiver abrindo, marca que foi aberto manualmente
                newState[section] = {
                    ...newState[section],
                    isOpen: true,
                    wasManuallyOpened: newState[section].autoCollapse
                };
            }
            
            return newState;
        });
    }
  
    // Alterna entre modo claro e escuro
    function toggleDarkMode() {
        setDarkMode(!darkMode);
    }
  
    // Verifica se o app está em modo PWA ou iOS
    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setPwaFullScreen(true);
        } else {
            setPwaFullScreen(false);
        }
  
        const userAgent = window.navigator.userAgent;
        setIsIOS(/iPad|iPhone|iPod/.test(userAgent));
  
        const handleBeforeInstallPrompt = (event) => {
            setDeferredPrompt(event);
        };
  
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);
  
    // Instala o PWA
    const handleInstallClick = () => {
        if (isIOS) {
            alert('No iOS, toque no ícone de compartilhamento e selecione "Adicionar à Tela de Início" para instalar este aplicativo.');
        } else if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('PWA instalado com sucesso');
                } else {
                    console.log('Instalação do PWA cancelada');
                }
                setDeferredPrompt(null);
            });
        }
    };
  
    // Parâmetros passados para o componente TaskList
    const taskListParams = {
        tasks: tasks,
        handleNewTask: handleNewTask,
        createTask: createTask,
        keydown: keydown,
        taskTitle: taskTitle,
        setTaskTitle: setTaskTitle,
        completeTask: completeTask,
        removeTask: removeTask
    };
  
    return (
        <>
            <NavBar setTasks={setTasks} />
            <Outlet />
            {/* Toast notification */}
            <Toast 
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
            <div className="home">
                {/* Botão de instalação do PWA */}
                <button id="install-button" style={{ display: pwaFullScreen ? 'none' : isIOS || deferredPrompt ? 'flex' : 'none' }}
                    onClick={handleInstallClick}>
                    <i className="download-icon"></i>Adicionar à tela inicial
                </button>
    
                {/* Progresso */}
                <div className="progress-container">
                    <div className="progress-header">
                        <p className="progress-label">Progresso</p>
                        <span className="progress-count">{currentPoints}/{points}</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${points > 0 ? (currentPoints / points) * 100 : 0}%` }}></div>
                    </div>
                </div>
    
                {/* Seções de tarefas */}
                <div id="general" className="task-section">
                    <h2 
                        className={`titleSection general ${!sectionStates.general.isOpen ? 'collapsed' : ''} ${sectionStates.general.autoCollapse ? 'auto-collapsed' : ''}`} 
                        onClick={() => toggleSection('general')}
                    >
                        Tarefas gerais
                        <span className="task-count">{tasks.filter(t => t.tag === 'general').length}</span>
                    </h2>
                    <div className={`task-content ${!sectionStates.general.isOpen ? 'collapsed' : ''}`}>
                        <TaskList tag="general" {...taskListParams} />
                    </div>
                </div>
    
                <div id="morning" className="task-section">
                    <h2 
                        className={`titleSection morning ${!sectionStates.morning.isOpen ? 'collapsed' : ''} ${morningCompleted === morningTotal && morningTotal !== 0 ? 'completed' : ''} ${sectionStates.morning.autoCollapse ? 'auto-collapsed' : ''}`} 
                        onClick={() => toggleSection('morning')}
                    >
                        Manhã
                        <span className="task-count">{morningCompleted}/{morningTotal}</span>
                    </h2>
                    <div className={`task-content ${!sectionStates.morning.isOpen ? 'collapsed' : ''}`}>
                        <TaskList tag="morning" {...taskListParams} />
                    </div>
                </div>
    
                <div id="afternoon" className="task-section">
                    <h2 
                        className={`titleSection afternoon ${!sectionStates.afternoon.isOpen ? 'collapsed' : ''} ${afternoonCompleted === afternoonTotal && afternoonTotal !== 0 ? 'completed' : ''} ${sectionStates.afternoon.autoCollapse ? 'auto-collapsed' : ''}`} 
                        onClick={() => toggleSection('afternoon')}
                    >
                        Tarde
                        <span className="task-count">{afternoonCompleted}/{afternoonTotal}</span>
                    </h2>
                    <div className={`task-content ${!sectionStates.afternoon.isOpen ? 'collapsed' : ''}`}>
                        <TaskList tag="afternoon" {...taskListParams} />
                    </div>
                </div>
    
                <div id="night" className="task-section">
                    <h2 
                        className={`titleSection night ${!sectionStates.night.isOpen ? 'collapsed' : ''} ${nightCompleted === nightTotal && nightTotal !== 0 ? 'completed' : ''} ${sectionStates.night.autoCollapse ? 'auto-collapsed' : ''}`} 
                        onClick={() => toggleSection('night')}
                    >
                        Noite
                        <span className="task-count">{nightCompleted}/{nightTotal}</span>
                    </h2>
                    <div className={`task-content ${!sectionStates.night.isOpen ? 'collapsed' : ''}`}>
                        <TaskList tag="night" {...taskListParams} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
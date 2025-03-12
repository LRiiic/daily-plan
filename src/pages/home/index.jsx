import { React, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/navBar";
import TaskList from "../../components/taskList";
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

    // Carrega as tarefas do localStorage ao inicializar
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(storedTasks);
    }, []);

    // Atualiza as tarefas e pontos periodicamente
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const updatedTasks = tasks.map(task => ({
                ...task,
                date: parse(format(parse(task.date, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy'), 'dd/MM/yyyy', new Date()).getDate() !== now.getDate() && task.tag !== 'general' ? new Date().toLocaleDateString() : task.date,
                completed: parse(format(parse(task.date, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy', new Date()).getDate() !== now.getDate() && task.tag !== 'general' ? false : task.completed)
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
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    }

    // Alterna a exibição de seções de tarefas
    function handleCollapse(e) {
        e.target.classList.toggle('active');
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
            <div className="home">
                {/* Botão de instalação do PWA */}
                <button id="install-button" style={{ display: pwaFullScreen ? 'none' : isIOS || deferredPrompt ? 'flex' : 'none' }}
                    onClick={handleInstallClick}>
                    <i></i>Adicionar à tela inicial
                </button>

                {/* Data atual */}
                <p className="date">
                    {new Date().toLocaleDateString('pt-br', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                {/* Progresso */}
                <div className="progress-container">
                    <p className="progress-label">Progresso</p>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(currentPoints / points) * 100}%` }}></div>
                    </div>
                    <span>{currentPoints}/{points}</span>
                </div>

                {/* Seções de tarefas */}
                <div id="general">
                    <h2 className="titleSection general" onClick={handleCollapse}>
                        Tarefas gerais
                    </h2>
                    <TaskList tag="general" {...taskListParams} />
                </div>

                <div id="morning">
                    <h2 className={`titleSection morning ${morningCompleted === morningTotal && morningTotal !== 0 ? 'active' : ''}`} onClick={handleCollapse}>
                        Manhã <small>{morningCompleted}/{morningTotal}</small>
                    </h2>
                    <TaskList tag="morning" {...taskListParams} />
                </div>

                <div id="afternoon">
                    <h2 className={`titleSection afternoon ${afternoonCompleted === afternoonTotal && afternoonTotal !== 0 ? 'active' : ''}`} onClick={handleCollapse}>
                        Tarde <small>{afternoonCompleted}/{afternoonTotal}</small>
                    </h2>
                    <TaskList tag="afternoon" {...taskListParams} />
                </div>

                <div id="night">
                    <h2 className={`titleSection night ${nightCompleted === nightTotal && nightTotal !== 0 ? 'active' : ''}`} onClick={handleCollapse}>
                        Noite <small>{nightCompleted}/{nightTotal}</small>
                    </h2>
                    <TaskList tag="night" {...taskListParams} />
                </div>
            </div>
        </>
    );
}

export default Home;
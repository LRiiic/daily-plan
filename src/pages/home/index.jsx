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

    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        setTasks(tasks);
    }, []);

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

        if (tasks) {
            const totalTasks = tasks.filter(task => {
                return task.tag !== 'general';
            })
    
            setPoints(totalTasks.length*100);
    
            const totalCompleted = tasks.filter(task => {
                return task.completed === true && task.tag !== 'general';
            })
    
            setCurrentPoints(totalCompleted.length*100);
    
            const totalMorning = tasks.filter(task => {
                return task.tag === 'morning';
            });
    
            const totalMorningCompleted = tasks.filter(task => {
                return task.tag === 'morning' && task.completed === true;
            })
    
            setMorningTotal(totalMorning.length);
            setMorningCompleted(totalMorningCompleted.length);
    
            const totalAfternoon = tasks.filter(task => {
                return task.tag === 'afternoon';
            });
    
            const totalAfternoonCompleted = tasks.filter(task => {
                return task.tag === 'afternoon' && task.completed === true;
            })
            setAfternoonTotal(totalAfternoon.length);
            setAfternoonCompleted(totalAfternoonCompleted.length);
    
            const totalNight = tasks.filter(task => {
                return task.tag === 'night';
            });
    
            const totalNightCompleted = tasks.filter(task => {
                return task.tag === 'night' && task.completed === true;
            })
            setNightTotal(totalNight.length);
            setNightCompleted(totalNightCompleted.length);
        }


        return () => clearInterval(interval);
    }, [tasks]);

    function addTask(tag) {
        document.querySelector('#' + tag + ' .new-task-display').style.display = 'inline-flex';
        let inputNewTask = document.querySelector('#' + tag + ' .new-task-input')
        inputNewTask.focus();

        let taskTitleTemp = '';

        inputNewTask.addEventListener('change', (e) => {
            taskTitleTemp = e.target.value;
        });

        inputNewTask.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                inputNewTask.blur();
            }
        })

        inputNewTask.addEventListener('focus', () => {});
    
        inputNewTask.addEventListener('blur', () => {
            if (taskTitleTemp === '') {
                document.querySelector('#' + tag + ' .new-task-display').style.display = '';
                return;
            }
            const newTask = {
                id: Date.now(),
                title: taskTitleTemp,
                time: '00:00',
                tag: tag,
                completed: false,
                date: new Date().toLocaleDateString(),
            };

            const newTasks = !tasks ? [newTask] : [...tasks, newTask];

            localStorage.setItem('tasks', JSON.stringify(newTasks));
            setTasks(newTasks);
            setTaskTitle('');
            document.querySelector('#' + tag + ' .new-task-display').style.display = '';

        });
        return;
    }

    function completeTask(task) {
        const newTasks = tasks.map(t => {
            if (t.id === task.id) {
                return {
                    ...t,
                    completed: !t.completed,
                };
            }
            return t;
        });
    
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        setTasks(newTasks);
    }

    function removeTask(taskId) {
        const newTasks = tasks.filter(t => t.id !== taskId);

        localStorage.setItem('tasks', JSON.stringify(newTasks));
        setTasks(newTasks);
    }

    function handleCollapse(e) {
        e.target.classList.toggle('active');
    }

    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
          setPwaFullScreen(true);
        } else {
          setPwaFullScreen(false);
        }
    
        const userAgent = window.navigator.userAgent;
        setIsIOS(/iPad|iPhone|iPod/.test(userAgent));
    
        const handleBeforeInstallPrompt = (event) => {
          // Salvar o evento para poder chamar prompt() posteriormente
          setDeferredPrompt(event);
        };
    
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
        return () => {
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
      }, []);
    
      const handleInstallClick = () => {
        if (isIOS) {
          showIOSInstructions();
        } else {
          deferredPrompt.prompt();
    
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('O usuário aceitou instalar o PWA');
            } else {
              console.log('O usuário cancelou a instalação do PWA');
            }
    
            setDeferredPrompt(null);
          });
        }
      };
    
    
      const showIOSInstructions = () => {
        const instructions = 'No iOS, toque no ícone de compartilhamento e selecione "Adicionar à Tela de Início" para instalar este aplicativo.';
        alert(instructions);
      };

    return (
        <>
        <NavBar setTasks={setTasks}/>
        <Outlet />
        <div className="home">
            <button id="install-button" style={{ display: pwaFullScreen ? 'none' : isIOS ? 'flex' : (deferredPrompt ? 'flex' : 'none') }} onClick={handleInstallClick}>
            <i></i>Adicionar à tela inicial
            </button>
            <p>{new Date().toLocaleDateString('pt-br', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <div className="points">
                <p>Progresso</p>
                <div className="progress">
                    <i></i>
                    <span>{currentPoints}/{points}</span>
                    <div className={currentPoints >= points ? 'progress-bar complete' : 'progress-bar'} style={{width: `${currentPoints/points*100}%`}}></div>
                </div>
            </div>
            {/* <button className="new-taskButton" onClick={focus}><i></i></button> */}

            <div id="general">
                <h2 className="titleSection general" onClick={(e) => handleCollapse(e)}><i></i>Tarefas gerais</h2>
                <TaskList tag="general" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>

            <div id="morning">
                <h2 className={morningCompleted === morningTotal && morningTotal !== 0  ? 'titleSection morning active' : 'titleSection morning'} onClick={(e) => handleCollapse(e)}><i></i>Manhã <small>{morningCompleted}/{morningTotal}</small></h2>

                <TaskList tag="morning" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>

            <div id="afternoon">
                <h2 className={afternoonCompleted === afternoonTotal && afternoonTotal !== 0 ? 'titleSection afternoon active' : 'titleSection afternoon'} onClick={(e) => handleCollapse(e)}><i></i>Tarde <small>{afternoonCompleted}/{afternoonTotal}</small></h2>

                <TaskList tag="afternoon" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>

            <div id="night">
                <h2 className={nightCompleted === nightTotal && nightTotal !== 0 ? 'titleSection night active' : 'titleSection night'} onClick={(e) => handleCollapse(e)}><i></i>Noite <small>{nightCompleted}/{nightTotal}</small></h2>

                <TaskList tag="night" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>
        </div>
        </>
    );
}

export default Home;
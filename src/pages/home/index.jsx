import { React, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/navBar";
import TaskList from "../../components/taskList";
import { useNavigate } from "react-router-dom";
import { Droppable } from 'react-beautiful-dnd';
import { parse, format, subDays } from 'date-fns';
import '../../App.css';
import './style.css';

function Home() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState('');

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

    return (
        <>
        <NavBar />
        <Outlet />
        <div className="home">
            <p>{new Date().toLocaleDateString('pt-br', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            {/* <button className="new-taskButton" onClick={focus}><i></i></button> */}

            <div id="general">
                <h2 className="titleSection general" onClick={(e) => handleCollapse(e)}><i></i>Tarefas de Hoje</h2>
                <TaskList tag="general" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>

            <div id="morning">
                <h2 className="titleSection morning" onClick={(e) => handleCollapse(e)}><i></i>Manhã</h2>

                <TaskList tag="morning" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>

            <div id="afternoon">
                <h2 className="titleSection afternoon" onClick={(e) => handleCollapse(e)}><i></i>Tarde</h2>

                <TaskList tag="afternoon" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>

            <div id="night">
                <h2 className="titleSection night" onClick={(e) => handleCollapse(e)}><i></i>Noite</h2>

                <TaskList tag="night" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>
        </div>
        </>
    );
}

export default Home;
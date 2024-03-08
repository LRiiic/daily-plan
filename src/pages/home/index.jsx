import { React, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/navBar";
import TaskList from "../../components/taskList";
import { useNavigate } from "react-router-dom";
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

    function addTask(tag) {
        document.querySelector('#' + tag + ' .new-task-display').style.display = 'inline-flex';
        let inputNewTask = document.querySelector('#' + tag + ' .new-task-input')
        inputNewTask.focus();

        let taskTitleTemp = '';

        inputNewTask.addEventListener('change', (e) => {
            taskTitleTemp = e.target.value;
        });

        inputNewTask.addEventListener('focus', () => {});
    
        inputNewTask.addEventListener('blur', () => {
            if (taskTitleTemp === '') return;
            const newTask = {
                id: Date.now(),
                title: taskTitleTemp,
                time: '00:00',
                tag: tag,
                completed: false,
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

    function focus() {
        document.getElementById("new-task-input").focus();
    }
    

    return (
        <>
        <NavBar />
        <Outlet />
        <div className="home">
            {/* <button className="new-taskButton" onClick={focus}><i></i></button> */}

            <div id="general">
                <h2 className="titleSection">Tarefas de Hoje</h2>
                <TaskList tag="general" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>

            <div id="morning">
                <h2 className="titleSection">Manhã</h2>

                <TaskList tag="morning" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>

            <div id="afternoon">
                <h2 className="titleSection">Tarde</h2>

                <TaskList tag="afternoon" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>

            <div id="night">
                <h2 className="titleSection">Noite</h2>

                <TaskList tag="night" tasks={tasks} addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} completeTask={completeTask} removeTask={removeTask}/>
            </div>
        </div>
        </>
    );
}

export default Home;
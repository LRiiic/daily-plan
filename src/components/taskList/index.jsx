import { React, useEffect, useState, useRef } from "react";

function TaskList({ tag, tasks, addTask, taskTitle, setTaskTitle, completeTask, removeTask }) {
    const [startX, setStartX] = useState(0);

    const handleStart = (e, taskId) => {
        setStartX({ taskId, x: e.touches ? e.touches[0].clientX : e.clientX });
    };

    const handleEnd = (e, taskId) => {
        e.target.style.transform = 'translateX(0px)';
        setStartX(0);
    };

    const handleMove = (e, taskId) => {
        if (e.target.id !== 'taskNode') return;
        if (!startX || taskId !== startX.taskId) return;
           
        const endX = e.touches ? e.touches[0].clientX : e.clientX;
        const distance = endX - startX.x;

        if (distance > 0) return;
    
        e.target.style.transform = 'translateX(3*' + distance + 'px)';

        if (distance < -50) {
            e.target.style.transform = 'translateX(-100%)';
            e.target.style.height = '0px';
            setTimeout(() => {
                removeTask(taskId);
            }, 500);
            setStartX(null);
        }
    };

    return (
        <ul className="tasksList">
            {tasks && tasks.length > 0 && tasks.filter(task => task.tag === tag).map(task => (
                <li key={task.id}
                    id="taskNode"
                    onTouchStart={(e) => handleStart(e, task.id)}
                    onTouchEnd={(e) => handleEnd(e, task.id)}
                    onTouchMove={(e) => handleMove(e, task.id)}
                    onMouseDown={(e) => handleStart(e, task.id)}
                    onMouseMove={(e) => handleMove(e, task.id)}
                    onMouseUp={(e) => handleEnd(e, task.id)}
                    onClick={() => completeTask(task)}
                >
                    <span className={task.completed ? 'checkbox checked nt' : 'checkbox'}><i></i></span>
                    <p className={task.completed ? 'completed' : ''}>{task.title}</p>
                </li>
            ))}

            <li className="new-task-display">
                <span className='checkbox nt'><i></i></span>
                <input 
                    type="text"
                    name="new-task-input"
                    className="new-task-input"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                />
            </li>
            <li className='new-task' onClick={() => addTask(tag)}>
                <span><i></i></span>
                <p>Nova tarefa...</p>
            </li>
        </ul>
    )
}

export default TaskList
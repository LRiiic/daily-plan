import React, { useState } from "react";

function TaskList({ tag, tasks, handleNewTask, taskTitle, setTaskTitle, completeTask, removeTask, createTask, keydown }) {
    const [startX, setStartX] = useState(0);

    const handleStart = (e, taskId) => {
        setStartX({ taskId, x: e.touches ? e.touches[0].clientX : e.clientX });
    };

    const handleEnd = (e, taskId) => {
        setStartX(0);
    };

    const handleMove = (e, taskId) => {
        if (e.target.id !== 'taskNode') return;
        if (!startX || taskId !== startX.taskId) return;

        const endX = e.touches ? e.touches[0].clientX : e.clientX;
        const distance = endX - startX.x;

        if (distance <= -80) {
            e.target.classList.add('active');
            e.target.nextElementSibling.classList.add('active');
            return;
        } else {
            e.target.classList.remove('active');
            e.target.nextElementSibling.classList.remove('active');
        }
    };

    // Filtra tarefas pela tag atual
    const filteredTasks = tasks && tasks.length > 0 
        ? tasks.filter(task => task.tag === tag) 
        : [];

    return (
        <ul className="tasksList">
            {filteredTasks.map(task => (
                <div className="task" key={task.id}
                    onTouchStart={(e) => handleStart(e, task.id)}
                    onTouchEnd={(e) => handleEnd(e, task.id)}
                    onTouchMove={(e) => handleMove(e, task.id)}
                    onMouseDown={(e) => handleStart(e, task.id)}
                    onMouseMove={(e) => handleMove(e, task.id)}
                    onMouseUp={(e) => handleEnd(e, task.id)}
                >
                    <li id="taskNode" onClick={() => completeTask(task)}>
                        <span className={task.completed ? 'checkbox checked' : 'checkbox'}>
                            <i></i>
                        </span>
                        <p className={task.completed ? 'completed' : ''}>
                            {task.title}
                        </p>
                    </li>
                    <span className="remove" onClick={() => removeTask(task.id)}>
                        Remover
                    </span>
                </div>
            ))}

            <li className="new-task-display">
                <span className='checkbox nt'><i></i></span>
                <input 
                    type="text"
                    name="new-task-input"
                    className="new-task-input"
                    placeholder="O que você precisa fazer?"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    onKeyDown={(e) => keydown(e, tag)}
                    onBlur={(e) => createTask(tag)}
                />
            </li>
            
            <li className='new-task' onClick={() => handleNewTask(tag)}>
                <span><i></i></span>
                <p>Nova tarefa...</p>
            </li>
        </ul>
    );
}

export default TaskList;
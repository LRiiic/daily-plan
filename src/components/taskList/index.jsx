import React, { useState } from "react";

function TaskList({ tag, tasks, handleNewTask, taskTitle, setTaskTitle, completeTask, removeTask, createTask, keydown }) {
    return (
        <ul className="tasksList">
            {tasks && tasks
                .filter(task => task.tag === tag) // Filtra tarefas pela tag
                .map(task => (
                    <div className="task" key={task.id}>
                        <li onClick={() => completeTask(task)}>
                            <span className={task.completed ? 'checkbox checked' : 'checkbox'}></span>
                            <p className={task.completed ? 'completed' : ''}>
                                {task.title}
                            </p>
                            {/* Botão de remover */}
                            <button 
                                className="remove-task-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // Evita que o clique propague para o li
                                    removeTask(task.id);
                                }}
                            >
                                <span className="delete-icon"></span>
                            </button>
                        </li>
                    </div>
                ))}

            {/* Input para nova tarefa */}
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
            
            {/* Botão para adicionar nova tarefa */}
            <li className='new-task' onClick={() => handleNewTask(tag)}>
                <span><i></i></span>
                <p>Nova tarefa...</p>
            </li>
        </ul>
    );
}

export default TaskList;
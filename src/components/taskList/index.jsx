import React from "react";

function TaskList({ tag, tasks, handleNewTask, taskTitle, setTaskTitle, completeTask, removeTask, createTask, keydown }) {
    return (
        <ul className="tasksList">
            {tasks && tasks
                .filter(task => task.tag === tag)
                .map(task => (
                    <div className="task" key={task.id}>
                        <li onClick={() => completeTask(task)}>
                            <div className="checkbox-wrapper-12">
                                <div className="cbx">
                                    <input 
                                        type="checkbox" 
                                        id={`cbx-${task.id}`} 
                                        checked={task.completed}
                                        onChange={() => completeTask(task)}
                                    />
                                    <label htmlFor={`cbx-${task.id}`}></label>
                                    <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                                        <path d="M2 8.36364L6.23077 12L13 2"></path>
                                    </svg>
                                </div>
                            </div>
                            
                            <p className={task.completed ? 'completed' : ''}>
                                {task.title}
                            </p>
                            
                            {/* Botão de remover */}
                            <button 
                                className="remove-task-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
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
                <div className="checkbox-wrapper-12">
                    <div className="cbx">
                        <input 
                            type="checkbox" 
                            id="cbx-new-task" 
                            disabled 
                        />
                        <label htmlFor="cbx-new-task"></label>
                        <svg fill="none" viewBox="0 0 15 14" height="14" width="15">
                            <path d="M2 8.36364L6.23077 12L13 2"></path>
                        </svg>
                    </div>
                </div>
                
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
import { React, useEffect, useState } from "react";

function TaskList({ tag, tasks, addTask, taskTitle, setTaskTitle, completeTask }) {
    return (
        <ul className="tasksList">
            {tasks && tasks.length > 0 && tasks.filter(task => task.tag === tag).map(task => (
                <li key={task.id} onClick={() => completeTask(task)}>
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
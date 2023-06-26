import React, { FC, useState } from 'react';
import './TaskTable.scss';
import Notification from '../../atoms/Notification/Notificacion';
import { Button } from 'react-bootstrap';

interface Person {
    id: number;
    name: string;
    lastName: string;
}

interface Group {
    id: number;
    name: string;
    people: Person[];
}

interface Task {
    id: number;
    tagId: number;
    startTime: string;
    endTime: string;
    person: Person | null;
    group: Group | null;
    completedTasks: number;
}

interface TaskTableProps {
    tasks: Task[];
    onDeleteTask: (taskId: number) => Promise<void>;
    isLoggedIn: boolean;
}

const TaskTable: FC<TaskTableProps> = ({ tasks, onDeleteTask, isLoggedIn }) => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleNameHover = (task: Task) => {
        setSelectedTask(task);
    };

    const handleNameLeave = () => {
        setSelectedTask(null);
    };

    const handleDelete = (taskId: number) => {
        onDeleteTask(taskId);
    };

    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

    return (
        <>
            <table className="task-table">
                <thead>
                <tr>
                    <th>Número de Tag</th>
                    <th>Hora de Inicio</th>
                    <th>Fecha y Hora de Finalización</th>
                    <th>Grupo o Persona</th>
                    <th>Tareas realizadas al momento</th>
                    {isLoggedIn && <th>Acciones</th>}
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id}>
                        <td>{task.tagId}</td>
                        <td>{formatDateTime(task.startTime)}</td>
                        <td>{formatDateTime(task.endTime)}</td>
                        <td
                            className="name-cell"
                            onMouseEnter={() => handleNameHover(task)}
                            onMouseLeave={handleNameLeave}
                        >
                            {task.group !== null ? (
                                <>
                                    {task.person === null ? (
                                        <>
                                            {task.group.name} (Grupo)
                                            {task.group.people !== null && (  // Agrega esta condición para verificar si 'people' no es nulo
                                                <ul>
                                                    {task.group.people.map((person) => (
                                                        <li key={person.id}>
                                                            {person.name} {person.lastName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {task.person.name} {task.person.lastName} (Persona)
                                        </>
                                    )}
                                </>
                            ) : task.person !== null ? (
                                <>
                                    {task.person.name} {task.person.lastName} (Persona)
                                </>
                            ) : (
                                <span>No se encontró información de persona o grupo</span>
                            )}
                        </td>
                        <td>{task.completedTasks}</td>
                        {isLoggedIn && (
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(task.id)}>
                                    Eliminar
                                </Button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedTask && <Notification message="Acerque el tag para terminar la tarea" />}
        </>
    );
};

export default TaskTable;

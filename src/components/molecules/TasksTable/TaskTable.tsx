import React, { FC, useState, useEffect } from 'react';
import './TaskTable.scss';
import Notification from '../../atoms/Notification/Notificacion';
import { Button, Modal } from 'react-bootstrap';
import axios from "axios";

interface Tag {
    id: number;
    codeNumber: string;
    customId: number | null;
}
interface Task {
    id: number;
    tagId: number | null;
    tag: Tag | null;
    startTime: string;
    endTime: string | null;
    personId: number | null;
    groupId: number | null;
}

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

interface TaskTableProps {
    tasks: Task[];
    groups: Group[];
    people: Person[];
    onDeleteTask: (taskId: number) => Promise<void>;
    isLoggedIn: boolean;
}

const TaskTable: FC<TaskTableProps> = ({
                                           tasks,
                                           groups,
                                           people,
                                           onDeleteTask,
                                           isLoggedIn
                                       }) => {
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [, setSelectedTaskId] = useState<number | null>(null);
    const [isTagDetected, setTagDetected] = useState(false);

    useEffect(() => {
        if (isTagDetected) {
            const timer = setTimeout(() => {
                setTagDetected(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isTagDetected]);

    const handleGroupSelect = (group: Group) => {
        setSelectedGroup(group);
        setSelectedPerson(null);
        setModalVisible(true);
    };

    const handlePersonSelect = (person: Person) => {
        setSelectedPerson(person);
        setSelectedGroup(null);
        setModalVisible(true);
    };

    const handleDelete = async (taskId: number) => {
        await onDeleteTask(taskId);
    };

    const createTaskWithoutTagId = async () => {
        try {
            const taskData = {
                description: 'string',
                personId: selectedPerson ? selectedPerson.id : null,
                groupId: selectedGroup ? selectedGroup.id : null,
                tagId: null
            };

            const response = await axios.post(
                'https://espapi32.azurewebsites.net/api/Tasks',
                taskData
            );
            setSelectedTaskId(response.data.id);
            setModalVisible(false);
            setTagDetected(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleTagDetection = () => {
        if (selectedGroup || selectedPerson) {
            createTaskWithoutTagId();
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
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
                {groups.map((group) => (
                    <tr key={group.id}>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                <span onClick={() => handleGroupSelect(group)}>
                  {group.name} (Grupo)
                </span>
                        </td>
                        <td>-</td>
                    </tr>
                ))}
                {people.map((person) => (
                    <tr key={person.id}>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                <span onClick={() => handlePersonSelect(person)}>
                  {person.name} {person.lastName} (Persona)
                </span>
                        </td>
                        <td>-</td>
                        <td></td>
                    </tr>
                ))}
                {tasks.map((task) => {
                    const person = people.find((p) => p.id === task.personId);
                    const group = groups.find((g) => g.id === task.groupId);

                    return (
                        <tr key={task.id}>
                            <td>{task.tag?.customId}</td>
                            <td>-</td>
                            <td>{formatDateTime(task.endTime as string)}</td>
                            <td>
                                {person && (
                                    <span onClick={() => handlePersonSelect(person)}>
                      {person.name} {person.lastName} (Persona)
                    </span>
                                )}
                                {group && (
                                    <span onClick={() => handleGroupSelect(group)}>
                      {group.name} (Grupo)
                    </span>
                                )}
                            </td>
                            <td>-</td>
                            {isLoggedIn && (
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(task.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            )}
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <Modal show={isModalVisible} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar selección</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de realizar la selección?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleTagDetection}
                        disabled={!selectedGroup && !selectedPerson}
                    >
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
            {isTagDetected && <Notification message="Acercar tag" />}
        </>
    );
};

export default TaskTable;

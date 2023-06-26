import React from 'react';
import './GroupTable.scss';
import {Button} from "react-bootstrap";

type GroupTableProps = {
    groups: any[]; // Reemplaza any[] con el tipo adecuado para la lista de grupos
    onDeleteGroup: (groupId: number) => Promise<void>; // Agrega esta propiedad
};

const GroupTable: React.FC<GroupTableProps> = ({ groups, onDeleteGroup }) => {
    return (
        <div>
            <h2>Tabla de Grupos</h2>
            <table className="group-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Personas</th>
                    <th>Acciones</th> {/* Agrega una columna para las acciones */}
                </tr>
                </thead>
                <tbody>
                {groups.map((group) => (
                    <tr key={group.id}>
                        <td>{group.id}</td>
                        <td>{group.name}</td>
                        <td>
                            {/* Muestra la lista de personas en el grupo */}
                            {group.people.map((person: any) => (
                                <div key={person.id}>
                                    {person.name} {person.lastName}
                                </div>
                            ))}
                        </td>
                        <td>
                            <Button variant="danger" onClick={() => onDeleteGroup(group.id)}>Eliminar</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GroupTable;

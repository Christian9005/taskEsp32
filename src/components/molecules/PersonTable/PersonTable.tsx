import React from 'react';
import './PersonTable.scss';
import {Button} from "react-bootstrap";

type PersonTableProps = {
    people: any[]; // Reemplaza any[] con el tipo adecuado para la lista de personas
    onDeletePerson: (personId: number) => Promise<void>; // Agrega esta propiedad
};

const PersonTable: React.FC<PersonTableProps> = ({ people, onDeletePerson }) => {
    return (
        <div>
            <h2>Tabla de Personas</h2>
            <table className="person-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Acciones</th> {/* Agrega una columna para las acciones */}
                </tr>
                </thead>
                <tbody>
                {people.map((person) => (
                    <tr key={person.id}>
                        <td>{person.id}</td>
                        <td>{person.name}</td>
                        <td>{person.lastName}</td>
                        <td>
                            <Button variant="danger" onClick={() => onDeletePerson(person.id)}>Eliminar</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PersonTable;

import React from 'react';
import './TagTable.scss';
import {Button} from "react-bootstrap";

type TagTableProps = {
    tags: any[]; // Reemplaza any[] con el tipo adecuado para la lista de tags
    onDeleteTag: (tagId: number) => Promise<void>; // Agrega esta propiedad
};

const TagTable: React.FC<TagTableProps> = ({ tags, onDeleteTag }) => {
    return (
        <div>
            <h2>Tabla de Tags</h2>
            <table className="tag-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>CodeNumber</th>
                    {/* Agrega más columnas según las propiedades de un tag */}
                    <th>Acciones</th> {/* Agrega una columna para las acciones */}
                </tr>
                </thead>
                <tbody>
                {tags.map((tag) => (
                    <tr key={tag.id}>
                        <td>{tag.id}</td>
                        <td>{tag.codeNumber}</td>
                        {/* Agrega más columnas según las propiedades de un tag */}
                        <td>
                            <Button variant="danger" onClick={() => onDeleteTag(tag.id)}>Eliminar</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TagTable;

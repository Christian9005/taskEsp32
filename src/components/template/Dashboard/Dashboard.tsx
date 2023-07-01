import React from 'react';
import { Chart } from 'react-google-charts';
import "./Dashboard.scss";
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
    tagId: number | null;
    tag: Tag | null;
    startTime: string;
    endTime: string | null;
    personId: number | null;
    person: Person | null;
    groupId: number | null;
    group: Group | null;
}

interface Tag {
    id: number;
    codeNumber: string;
    customId: number | null;
}

interface DashboardProps {
    tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
    // Calcular el número de tareas por persona o grupo
    const taskCounts: { [key: string]: number } = {};
    tasks.forEach((task) => {
        const key = task.personId ? `person_${task.personId}` : `group_${task.groupId}`;
        taskCounts[key] = taskCounts[key] ? taskCounts[key] + 1 : 1;
    });

    // Crear datos para el gráfico de torta
    const pieChartData: any[][] = [['Persona o Grupo', 'Cantidad de Tareas']];
    Object.keys(taskCounts).forEach((key) => {
        const label =
            key.startsWith('person') && tasks.find((task) => task.personId?.toString() === key.split('_')[1])?.person?.name
                ? tasks.find((task) => task.personId?.toString() === key.split('_')[1])?.person?.name
                : tasks.find((task) => task.groupId?.toString() === key.split('_')[1])?.group?.name;
        const count = taskCounts[key];
        if (label) {
            pieChartData.push([label, count]);
        }
    });

    return (
        <div className="dashboard">
            <h2>Gráfico de Tareas por Persona o Grupo</h2>
            <Chart
                chartType="PieChart"
                loader={<div>Cargando gráfico...</div>}
                data={pieChartData}
                options={{
                    title: 'Tareas por Persona o Grupo',
                    is3D: true,
                }}
                width="100%"
                height="400px"
            />
            <Chart
                chartType="Bar"
                loader={<div>Cargando gráfico...</div>}
                data={pieChartData}
                options={{
                    title: 'Tareas por Persona o Grupo'
                }}
                width="100%"
                height="400px"
            />
        </div>
    );
};

export default Dashboard;
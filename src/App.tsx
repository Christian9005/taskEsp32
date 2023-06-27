import React, {FC, useState, useEffect, useRef} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import TaskTable from './components/molecules/TasksTable/TaskTable';
import LoginForm from "./components/molecules/LoginForm/LoginForm";
import PersonTable from './components/molecules/PersonTable/PersonTable';
import TagTable from './components/molecules/TagTable/TagTable';
import GroupTable from './components/molecules/GroupTable/GroupTable';
import { Button, Modal } from 'react-bootstrap';

enum UserRole {
  Admin = 'admin',
  User = 'user',
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

interface Task {
  id: number;
  tagId: number | null;
  tag: Tag;
  startTime: string;
  endTime: string | null;
  personId: number | null;
  groupId: number | null;
}

interface Tag {
  id: number;
  codeNumber: string;
  customId: number;
}

const App: FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [, setUserRole] = useState<UserRole | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
  const [openCreateTagModal, setOpenCreateTagModal] = useState(false);
  const [openCreatePersonModal, setOpenCreatePersonModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const handleCloseCreateTaskModal = () => {
    setOpenCreateTaskModal(false);
  };

  const handleCloseCreateGroupModal = () => {
    setOpenCreateGroupModal(false);
  };

  const handleCloseCreateTagModal = () => {
    setOpenCreateTagModal(false);
  };

  const handleCloseCreatePersonModal = () => {
    setOpenCreatePersonModal(false);
  };

  const handleCreateTask = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const selectTagElement = document.getElementById('selectTag') as HTMLSelectElement;
      const selectPersonElement = document.getElementById('selectPerson') as HTMLSelectElement;
      const selectGroupElement = document.getElementById('selectGroup') as HTMLSelectElement;
      const startTimeElement = document.getElementById('startTime') as HTMLInputElement;

      const newTaskData = {
        description: "string",
        startTime: startTimeElement.value,
        personId: selectPersonElement.value ? Number(selectPersonElement.value) : null,
        groupId: selectGroupElement.value ? Number(selectGroupElement.value) : null,
        tagId: Number(selectTagElement.value),
      };

      const response = await axios.post('https://esp32api.azurewebsites.net/api/Tasks', newTaskData);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setOpenCreateTaskModal(false);
    } catch (error) {
      console.error('Error al crear la tarea: ', error);
    }
  };


  const groupNameRef = useRef<HTMLInputElement>(null);
  const selectPeopleRef = useRef<HTMLSelectElement>(null);

  const handleCreateGroup = async () => {
    try {
      const groupName = groupNameRef.current?.value;
      const selectedOptions = selectPeopleRef.current?.selectedOptions;

      if (!groupName || !selectedOptions || selectedOptions.length === 0) {
        console.error('Error: Nombre del grupo y personas requeridos');
        return;
      }

      const peopleIds = Array.from(selectedOptions, (option) => Number(option.value));

      const newGroupData = {
        name: groupName,
        peopleIds: peopleIds,
      };

      const response = await axios.post('https://esp32api.azurewebsites.net/api/Groups', newGroupData);
      setGroups((prevGroups) => [...prevGroups, response.data]);
      setOpenCreateGroupModal(false);
    } catch (error) {
      console.error('Error al crear el grupo: ', error);
    }
  };

  const handleCreateTag = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const tagElement = document.getElementById('tag') as HTMLInputElement;
      const customIdElement = document.getElementById('customId') as HTMLInputElement; // Obtén el valor de customId
      const newTagData = {
        codeNumber: tagElement.value,
        customId: customIdElement.value // Agrega el valor de customId en los datos enviados
      };
      const response = await axios.post('https://esp32api.azurewebsites.net/api/Tags', newTagData);
      setTags((prevTags) => [...prevTags, response.data]);
      setOpenCreateTagModal(false);
    } catch (error) {
      console.error('Error al crear la etiqueta: ', error);
    }
  };


  const handleCreatePerson = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const nameElement = document.getElementById('name') as HTMLInputElement;
      const lastNameElement = document.getElementById('lastName') as HTMLInputElement;

      const newPersonData = {
        name: nameElement.value,
        lastName: lastNameElement.value,
      };

      const response = await axios.post('https://esp32api.azurewebsites.net/api/People', newPersonData);
      setPeople((prevPeople) => [...prevPeople, response.data]);
      setOpenCreatePersonModal(false);
    } catch (error) {
      console.error('Error al crear la persona: ', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://esp32api.azurewebsites.net/api/Tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener las tareas: ', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get('https://esp32api.azurewebsites.net/api/Groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error al obtener los grupos: ', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('https://esp32api.azurewebsites.net/api/Tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error al obtener las etiquetas: ', error);
    }
  };

  const fetchPeople = async () => {
    try {
      const response = await axios.get('https://esp32api.azurewebsites.net/api/People');
      setPeople(response.data);
    } catch (error) {
      console.error('Error al obtener las personas: ', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const confirmDeleteTask = async () => {
    try {
      await axios.delete(`https://esp32api.azurewebsites.net/api/Tasks/${selectedTaskId}`);
      setTasks(tasks.filter(task => task.id !== selectedTaskId));
      setSelectedTaskId(null);
    } catch (error) {
      console.error('Error al eliminar la tarea: ', error);
    }
  };

  const handleDeletePerson = async (personId: number) => {
    try {
      await axios.delete(`https://esp32api.azurewebsites.net/api/People/${personId}`);
      setPeople(people.filter(person => person.id !== personId));
    } catch (error) {
      console.error('Error al eliminar la persona: ', error);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      await axios.delete(`https://esp32api.azurewebsites.net/api/Tags/${tagId}`);
      setTags(tags.filter(tag => tag.id !== tagId));
    } catch (error) {
      console.error('Error al eliminar la etiqueta: ', error);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await axios.delete(`https://esp32api.azurewebsites.net/api/Groups/${groupId}`);
      setGroups(groups.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('Error al eliminar el grupo: ', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchGroups();
    fetchTags();
    fetchPeople();
  }, []);



  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await axios.get('https://esp32api.azurewebsites.net/api/Admin');
      const admins = response.data;
      const admin = admins.find((admin: any) => admin.username === username && admin.password === password);

      if (admin) {
        setLoggedIn(true);
        setUserRole(UserRole.Admin);
      } else {
        setLoggedIn(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error al verificar las credenciales: ', error);
    }
  };

  return (
      <div className="app">
        <nav>
          <h1>Web App</h1>
          {isLoggedIn ? (
              <div>
                <p>Bienvenido, Administrador</p>
              </div>
          ) : (
              <LoginForm handleLogin={handleLogin} />
          )}
        </nav>
        <div>
          <h1>Tabla de Tareas</h1>
          <TaskTable tasks={tasks} groups={groups} people={people} onDeleteTask={handleDeleteTask} isLoggedIn={isLoggedIn} />
          {isLoggedIn && (
              <>
                <Button variant="primary" onClick={() => setOpenCreateTaskModal(true)}>Crear Tarea</Button>
                <PersonTable people={people} onDeletePerson={handleDeletePerson} />
                <Button variant="primary" onClick={() => setOpenCreatePersonModal(true)}>Crear Persona</Button>
                <TagTable tags={tags} onDeleteTag={handleDeleteTag} />
                <Button variant="primary" onClick={() => setOpenCreateTagModal(true)}>Crear Etiqueta</Button>
                <GroupTable groups={groups} onDeleteGroup={handleDeleteGroup} />
                <Button variant="primary" onClick={() => setOpenCreateGroupModal(true)}>Crear Grupo</Button>
              </>
          )}
        </div>

        <Modal show={openCreateTaskModal} onHide={handleCloseCreateTaskModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Tarea</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label>Etiqueta:</label>
              <select id="selectTag">
                {/* Renderiza las opciones de etiquetas */}
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.codeNumber}
                    </option>
                ))}
              </select>
            </div>
            <div>
              <label>Hora de inicio:</label>
              <input type="datetime-local" id="startTime" />
            </div>
            <div>
              <label>Persona asignada:</label>
              <select id="selectPerson">
                <option value="">Ninguna</option> {/* Opción adicional de null */}
                {/* Renderiza las opciones de personas */}
                {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name} {person.lastName}
                    </option>
                ))}
              </select>
            </div>
            <div>
              <label>Grupo asignado:</label>
              <select id="selectGroup">
                <option value="">Ninguno</option> {/* Opción adicional de null */}
                {/* Renderiza las opciones de grupos */}
                {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                ))}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCreateTaskModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateTask}>
              Crear Tarea
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={openCreateGroupModal} onHide={handleCloseCreateGroupModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Grupo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label>Nombre del grupo:</label>
              <input type="text" ref={groupNameRef} />
            </div>
            <div>
              <label>Personas en el grupo:</label>
              <select multiple ref={selectPeopleRef}>
                {/* Renderiza las opciones de personas */}
                {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name} {person.lastName}
                    </option>
                ))}
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCreateGroupModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateGroup}>
              Crear Grupo
            </Button>
          </Modal.Footer>
        </Modal>


        <Modal show={openCreateTagModal} onHide={handleCloseCreateTagModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Etiqueta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label>Número de código:</label>
              <input type="text" id="tag" />
            </div>
            <div> {/* Agrega un nuevo campo para el customId */}
              <label>ID personalizado:</label>
              <input type="text" id="customId" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCreateTagModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateTag}>
              Crear Etiqueta
            </Button>
          </Modal.Footer>
        </Modal>


        <Modal show={openCreatePersonModal} onHide={handleCloseCreatePersonModal}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Persona</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label>Nombre:</label>
              <input type="text" id="name" /> {/* Asegúrate de tener el atributo "id" como "name" */}
            </div>
            <div>
              <label>Apellido:</label>
              <input type="text" id="lastName" /> {/* Asegúrate de tener el atributo "id" como "lastName" */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCreatePersonModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreatePerson}>
              Crear Persona
            </Button>
          </Modal.Footer>
        </Modal>


        <Modal show={selectedTaskId !== null} onHide={() => setSelectedTaskId(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas eliminar esta tarea?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedTaskId(null)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmDeleteTask}>Eliminar</Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
};

export default App;

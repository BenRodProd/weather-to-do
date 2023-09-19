import { useState } from 'react';
import { Button, TaskCard, TaskBoard, EditButton, CardHeader, DeleteButton } from './Styles';
import Image from 'next/image';
import HandleDeleteTask from '@/service/deleteTask';
import fetchUserTasksFromFirestore from '@/service/fetchTasks';
import EditTask from './EditTask';
import HandleDeleteTaskFinally from '@/service/deleteTaskFinal';
export default function DisplayTasks({ displayTasks, user, setAllTasks }) {
 const [editActive, setEditActive] = useState(false);
 const [editTaskId, setEditTaskId] = useState(null);
  async function DeleteTask(id) {
    await HandleDeleteTask(id);
    fetchUserTasksFromFirestore(user.email).then((tasks) => {
      setAllTasks(tasks);
    });
  }
function editTask (task) {
  setEditActive(true);
  setEditTaskId(task);
}
async function deleteTask(task) {
  await HandleDeleteTaskFinally(task.id);
  fetchUserTasksFromFirestore(user.email).then((tasks) => {
    setAllTasks(tasks);
  });
}

  return (
    <>
      <TaskBoard>
        {displayTasks.map((task) => {
          return (
            <TaskCard key={task.id}>
              <li><EditButton onClick={() => editTask(task)}><Image src="/edit.png" alt="edit" width="30" height="30" /></EditButton></li>
              <li><DeleteButton onClick={() => deleteTask(task)}><Image src="/delete.png" alt="delete" width="30" height="30" /></DeleteButton></li>
              <li>
                <CardHeader>{task.name}</CardHeader>
              </li>
              <hr width="100%" color="black" size="10px" align="center" />
              <br></br>
              <li>
                {task.timeOption === 'egal wann'
                  ? ''
                  : task.timeOption === 'Nacht'
                  ? 'in der '
                  : 'am '}
                {task.timeOption}
              </li>
              <hr></hr>
              <li>für {task.weatherOption}</li>
              <br />
              <Button onClick={() => DeleteTask(task.id)}>
                <Image src="/done.png" alt="done" width="30" height="30" />
              </Button>
            </TaskCard>
          );
        })}
      </TaskBoard>
      {editActive && (
        <EditTask task={editTaskId} user={user} setAllTasks={setAllTasks} editActive={editActive} setEditActive={setEditActive} />
      )}
    </>
  );
}

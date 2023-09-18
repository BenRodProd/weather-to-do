import { Button, TaskCard, TaskBoard } from './Styles';
import Image from 'next/image';
import HandleDeleteTask from '@/service/deleteTask';
import fetchUserTasksFromFirestore from '@/service/fetchTasks';
export default function DisplayTasks({ displayTasks, user, setAllTasks }) {
  async function DeleteTask(id) {
    await HandleDeleteTask(id);
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
              <li>
                <h2>{task.name}</h2>
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
    </>
  );
}

import styled from "styled-components";
import DisplayTasks from "./DisplayTasks";
import { Button } from "./Styles";

const AllTasksWrapper = styled.div`
    display: flex;
    position:absolute;
    top:0;
    left:0;
    background-color: rgba(0, 0, 0, 0.8);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    
`

export default function ShowAllTasks({ setShowAllTasks, allTasks, setAllTasks, user, setSettings }) {
 
    return (
        <AllTasksWrapper>
            <Button onClick={() => setShowAllTasks(false)}>Schließen</Button>
            <DisplayTasks displayTasks={allTasks} user={user} setAllTasks={setAllTasks} />
       </AllTasksWrapper>
    );
    }
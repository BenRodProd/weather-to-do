import { BackDropper, StyledModal, Button } from './Styles';
import { ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
export function TaskSelect({ setSelectedTask, selectedTask }) {
  return (
    <>
      <BackDropper>
        <StyledModal isOpen={true} onClose={() => setSelectedTask(null)}>
          <ModalContent>
            <ModalHeader>Ich habe diese Aufgabe ausgesucht:</ModalHeader>
            <ModalBody>
              <div>
                <hr></hr>
                <h2>{selectedTask.name}</h2>
                <br></br>
                <hr></hr>
                <p>Hau rein!</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setSelectedTask(null)}>Schließen</Button>
            </ModalFooter>
          </ModalContent>
        </StyledModal>
      </BackDropper>
    </>
  );
}

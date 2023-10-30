import { BackDropper, StyledModal, StyledForm, StyledInput, Button, ErrorMessage } from './Styles';
import { ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import handleLogout from '@/service/logout';
import ChooseStyling from './ChooseStyling';

export default function Settings({
  setShowAllTasks,
  settings,
  setSettings,
  city,
  user,
  handleChangeCity,
  error,
  setStyle,
  style
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  function handleShowAllTasks() {
    setSettings(false);
    setShowAllTasks(true);
  }
  return (
    <BackDropper>
      <StyledModal isOpen={settings} onOpenChange={setSettings} onClose={setSettings}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">ausgewählte Stadt: {city}</ModalHeader>

              <StyledForm onSubmit={(e) => handleChangeCity(e)}>
                <StyledInput required type="text" name="city" placeholder={city}></StyledInput>

                <Button type="submit">Suche</Button>
              </StyledForm>
              {error && <ErrorMessage>Stadt nicht gefunden...</ErrorMessage>}

              <hr width="100%"></hr>

              <Button onClick={() => handleShowAllTasks()}>Alle Aufgaben anzeigen</Button>
              <hr width="100%"></hr>
              <ChooseStyling style={style} user={user.email} setStyle={setStyle} />
              <hr width="100%"></hr>
              <Button onClick={() => handleLogout()}>Logout</Button>

              <hr width="100%"></hr>

              <Button onClick={() => setSettings(false)}>Schließen</Button>
            </>
          )}
        </ModalContent>
      </StyledModal>
    </BackDropper>
  );
}

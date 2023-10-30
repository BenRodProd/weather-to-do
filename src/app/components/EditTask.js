import { useState } from 'react';
import { BackDropper, StyledAddModal, StyledForm, StyledInput, Button, NoRadio } from './Styles';
import { ModalContent, ModalHeader, ModalBody } from '@nextui-org/react';
import updateTaskInDatabase from '@/service/updateTask';
import fetchUserTasksFromFirestore from '@/service/fetchTasks';

export default function EditTask({ task, editActive, setEditActive, user, setAllTasks }) {
  const [showRepeatOptions, setShowRepeatOptions] = useState(task.doesRepeat === 'on');
  const [timeOption, setTimeOption] = useState(task.timeOption);
  const [repeatOption, setRepeatOption] = useState(task.repeatOption);
  const [allDayChecked, setAllDayChecked] = useState(task.isAllDay === 'on');
  const [weatherOption, setWeatherOption] = useState(task.weatherOption);
  const [weatherChecked, setWeatherChecked] = useState(task.dependsOnWeather === 'on');
  const [taskName, setTaskName] = useState(task.name);

  const handleSubmitTask = async (e) => {
    e.preventDefault();

    const dependsOnWeather = weatherChecked ? 'on' : 'off';
    const timeOptionValue = !allDayChecked ? 'egal wann' : timeOption;
    const repeatOptionValue = showRepeatOptions ? repeatOption : 'no repeat';
    const weatherOptionValue = !weatherChecked ? 'jedes Wetter' : weatherOption;
    const isAllDay = allDayChecked ? 'on' : 'off';
    const doesRepeat = showRepeatOptions ? 'on' : 'off';

    await updateTaskInDatabase(
      task.id,
      taskName,
      dependsOnWeather,
      weatherOptionValue,
      isAllDay,
      timeOptionValue,
      doesRepeat,
      repeatOptionValue,
      user.email
    );

    const tasks = await fetchUserTasksFromFirestore(user.email);
    setAllTasks(tasks);
  };

  return (
    <>
      <BackDropper>
        <StyledAddModal
          backdrop="blur"
          isOpen={editActive}
          onOpenChange={setEditActive}
          onClose={setEditActive}>
          <ModalContent>
            <ModalHeader>Aufgabe bearbeiten:</ModalHeader>
            <hr width="100%"></hr>
            <ModalBody>
              <StyledForm onSubmit={handleSubmitTask}>
                <StyledInput
                  maxLength="23"
                  required
                  type="text"
                  name="name"
                  placeholder={task.name}
                  defaultValue={task.name}
                  onChange={(e) => setTaskName(e.target.value)}
                />

                <label htmlFor="weather">Hängt sie vom Wetter ab?</label>
                <Button
                  type="button"
                  name="weather"
                  id="weather"
                  onClick={() => setWeatherChecked(!weatherChecked)}>
                  {weatherChecked ? 'Nein' : 'Ja'}
                </Button>

                {weatherChecked && (
                  <div>
                    <label
                      htmlFor="goodWeather"
                      style={{ color: weatherOption === 'gutes Wetter' ? 'green' : 'black' }}>
                      <NoRadio
                        type="radio"
                        id="goodWeather"
                        name="weatherOption"
                        value="gutes Wetter"
                        checked={weatherOption === 'gutes Wetter'}
                        onChange={(e) => setWeatherOption(e.target.value)}
                      />{' '}
                      gutes Wetter
                    </label>
                    <label
                      htmlFor="badWeather"
                      style={{ color: weatherOption === 'schlechtes Wetter' ? 'green' : 'black' }}>
                      <NoRadio
                        type="radio"
                        id="badWeather"
                        name="weatherOption"
                        value="schlechtes Wetter"
                        checked={weatherOption === 'schlechtes Wetter'}
                        onChange={(e) => setWeatherOption(e.target.value)}
                      />{' '}
                      schlechtes Wetter
                    </label>
                  </div>
                )}
                <hr width="100%"></hr>
                <label htmlFor="allDay">Tageszeit egal?</label>
                <Button
                  type="button"
                  name="allDay"
                  id="allDay"
                  onClick={() => setAllDayChecked(!allDayChecked)}>
                  {allDayChecked ? 'Ja' : 'Nein'}
                </Button>

                {allDayChecked && (
                  <div>
                    <label
                      htmlFor="Morgen"
                      style={{ color: timeOption === 'Morgen' ? 'green' : 'black' }}>
                      <NoRadio
                        type="radio"
                        id="Morgen"
                        name="timeOption"
                        value="Morgen"
                        checked={timeOption === 'Morgen'}
                        onChange={(e) => setTimeOption(e.target.value)}
                      />{' '}
                      Morgen
                    </label>
                    <label
                      htmlFor="Mittag"
                      style={{ color: timeOption === 'Mittag' ? 'green' : 'black' }}>
                      <NoRadio
                        type="radio"
                        id="Mittag"
                        name="timeOption"
                        value="Mittag"
                        checked={timeOption === 'Mittag'}
                        onChange={(e) => setTimeOption(e.target.value)}
                      />{' '}
                      Mittag
                    </label>
                    <label
                      htmlFor="Nachmittag"
                      style={{ color: timeOption === 'Nachmittag' ? 'green' : 'black' }}>
                      <NoRadio
                        type="radio"
                        id="Nachmittag"
                        name="timeOption"
                        value="Nachmittag"
                        checked={timeOption === 'Nachmittag'}
                        onChange={(e) => setTimeOption(e.target.value)}
                      />{' '}
                      Nachmittag
                    </label>
                    <label
                      htmlFor="Abend"
                      style={{ color: timeOption === 'Abend' ? 'green' : 'black' }}>
                      <NoRadio
                        type="radio"
                        id="Abend"
                        name="timeOption"
                        value="Abend"
                        checked={timeOption === 'Abend'}
                        onChange={(e) => setTimeOption(e.target.value)}
                      />{' '}
                      Abend
                    </label>
                    <label
                      htmlFor="Nacht"
                      style={{ color: timeOption === 'Nacht' ? 'green' : 'black' }}>
                      <NoRadio
                        type="radio"
                        id="Nacht"
                        name="timeOption"
                        value="Nacht"
                        checked={timeOption === 'Nacht'}
                        onChange={(e) => setTimeOption(e.target.value)}
                      />{' '}
                      Nacht
                    </label>
                  </div>
                )}
                <hr width="100%"></hr>
                <label htmlFor="repeat">Wiederholen?</label>
                <Button
                  type="button"
                  name="repeat"
                  id="repeat"
                  onClick={() => setShowRepeatOptions(!showRepeatOptions)}>
                  {showRepeatOptions ? 'Nein' : 'Ja'}
                </Button>

                {showRepeatOptions && (
                  <div>
                    <label
                      htmlFor="daily"
                      style={{ color: repeatOption === 'täglich' ? 'green' : 'black' }}>
                      <NoRadio
                        type="radio"
                        id="daily"
                        name="repeatOption"
                        value="täglich"
                        checked={repeatOption === 'täglich'}
                        onChange={(e) => setRepeatOption(e.target.value)}
                      />{' '}
                      Täglich
                    </label>
                    <label
                      htmlFor="weekly"
                      style={{ color: repeatOption === 'wöchentlich' ? 'green' : 'black' }}>
                      <NoRadio
                        type="radio"
                        id="weekly"
                        name="repeatOption"
                        value="wöchentlich"
                        checked={repeatOption === 'wöchentlich'}
                        onChange={(e) => setRepeatOption(e.target.value)}
                      />{' '}
                      Wöchentlich
                    </label>
                    {/* Add other repeat options here */}
                  </div>
                )}
                <hr width="100%"></hr>
                <Button type="submit">Speichern</Button>
                <hr width="100%"></hr>
              </StyledForm>
            </ModalBody>
            <Button
              onClick={() => {
                setEditActive(false);
              }}>
              Schließen
            </Button>
          </ModalContent>
        </StyledAddModal>
      </BackDropper>
    </>
  );
}

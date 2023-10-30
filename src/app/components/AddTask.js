import { useState } from 'react';
import { BackDropper, StyledAddModal, StyledForm, StyledInput, Button, NoRadio } from './Styles';
import { ModalContent, ModalHeader, ModalBody } from '@nextui-org/react';
import writeTaskToDatabase from '@/service/writeTask';
import fetchUserTasksFromFirestore from '@/service/fetchTasks';
export default function AddTask({ add, setAdd, user, setAllTasks }) {
  const [showWeatherOptions, setShowWeatherOptions] = useState(false);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [timeOption, setTimeOption] = useState('egal wann');
  const [repeatOption, setRepeatOption] = useState('täglich');
  const [allDayChecked, setAllDayChecked] = useState(true);
  const [weatherOption, setWeatherOption] = useState('jedes Wetter');
  const [weatherChecked, setWeatherChecked] = useState(false);

  function handleSubmitTask(e) {
    e.preventDefault();
    let dependsOnWeather = 'off';
    let timeOptionValue = 'egal wann';
    let repeatOptionValue = 'no repeat';

    if (allDayChecked) {
      timeOptionValue = 'egal wann';
    } else {
      timeOptionValue = e.target.timeOption.value;
    }
    if (!weatherChecked) {
      setWeatherOption('jedes Wetter');
    }
    if (!showRepeatOptions) {
      repeatOptionValue = 'no repeat';
    } else if (showRepeatOptions) {
      repeatOptionValue = e.target.repeatOption.value;
    }
    if (weatherChecked) {
      dependsOnWeather = 'on';
    } else {
      dependsOnWeather = 'off';
    }
    writeTaskToDatabase(
      e.target.name.value,
      dependsOnWeather,
      weatherOption,
      e.target.allDay.value,
      timeOptionValue,
      e.target.repeat.value,
      repeatOptionValue,
      user.email
    );

    // Reset the form
    e.target.reset();
    fetchUserTasksFromFirestore(user.email).then((tasks) => {
      setAllTasks(tasks);
    });

    setShowRepeatOptions(false);
    setShowTimeOptions(false);
    setShowWeatherOptions(false);
    setAllDayChecked(true);
    setWeatherChecked(false);
  }

  const handleWeatherChange = (e) => {
    setShowWeatherOptions((prev) => !prev);
    setWeatherChecked((prev) => !prev);
  };
  const handleRepeatOptionChange = (e) => {
    setRepeatOption(e.target.value);
  };
  const handleAllDayChange = (e) => {
    setShowTimeOptions((prev) => !prev);
    setAllDayChecked((prev) => !prev);
  };
  const handleWeatherOptionChange = (e) => {
    setWeatherOption(e.target.value);
  };
  const handleTimeOptionChange = (e) => {
    setTimeOption(e.target.value);
  };
  const handleRepeatChange = (e) => {
    setShowRepeatOptions((prev) => !prev);
  };

  return (
    <>
      <BackDropper>
        <StyledAddModal backdrop="blur" isOpen={add} onOpenChange={setAdd} onClose={setAdd}>
          <ModalContent>
            <ModalHeader>Neue Aufgabe:</ModalHeader>
            <hr width="100%"></hr>
            <ModalBody>
              <StyledForm onSubmit={handleSubmitTask}>
                <StyledInput
                  maxLength="23"
                  required
                  type="text"
                  name="name"
                  placeholder="Name der Aufgabe"
                />

                <label htmlFor="weather">Hängt sie vom Wetter ab?</label>
                <Button
                  type="button"
                  name="weather"
                  id="weather"
                  onClick={handleWeatherChange}
                  checked={weatherChecked}>
                  {weatherChecked ? 'Nein' : 'Ja'}
                </Button>

                {showWeatherOptions && (
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
                        onChange={handleWeatherOptionChange}
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
                        onChange={handleWeatherOptionChange}
                      />{' '}
                      schlechtes Wetter
                    </label>
                  </div>
                )}
                <hr width="100%"></hr>
                <label htmlFor="allDay">Tageszeit egal?</label>
                <Button type="button" name="allDay" id="allDay" onClick={handleAllDayChange}>
                  {allDayChecked ? 'Nein' : 'Ja'}
                </Button>

                {showTimeOptions && (
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
                        onChange={handleTimeOptionChange}
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
                        onChange={handleTimeOptionChange}
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
                        onChange={handleTimeOptionChange}
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
                        onChange={handleTimeOptionChange}
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
                        onChange={handleTimeOptionChange}
                      />{' '}
                      Nacht
                    </label>
                  </div>
                )}
                <hr width="100%"></hr>
                <label htmlFor="repeat">Wiederholen?</label>
                <Button type="button" name="repeat" id="repeat" onClick={handleRepeatChange}>
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
                        onChange={handleRepeatOptionChange}
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
                        onChange={handleRepeatOptionChange}
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
                setAdd(false);
              }}>
              Schließen
            </Button>
          </ModalContent>
        </StyledAddModal>
      </BackDropper>
    </>
  );
}

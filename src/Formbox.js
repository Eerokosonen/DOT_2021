import React, { useState, useEffect } from 'react';
import './content.css'; // Styling for Formbox & Databox components
import './App.css'; // Basic styling

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";

import InputRange from 'react-input-range'; // Range module for the slide input
import "react-input-range/lib/css/index.css";

import { useForm } from "react-hook-form"; // Form validation module

import fi from 'date-fns/locale/fi'; //Finnish formatting for date and time

registerLocale('fi', fi);

/*
Simple REST API with Node.js json-server to read and write a local JSON file.
json-server startup:
json-server --watch obs.json
*/

function Formbox({ setIsupdated, modifiedId, Email }) {
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (modifiedId !== undefined) // If there is a ID to modify with
      fetchtomodify(modifiedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifiedId]);

  // Data collected on the form:
  var yesterday = new Date();  // Initializing tosleep value to last night
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(20);
  let [tosleep, setTosleep] = useState(yesterday);

  let today = new Date(); // Initializing fromsleep value to this morning
  today.setHours(7);
  let [fromsleep, setFromsleep] = useState(today);

  let [range, setRange] = useState(1);
  let [desc, setDesc] = useState('');
  //* Data collected on the form:

  var totalHours = (fromsleep - tosleep) / 36e5; // Calculating total sleeping hours 

  const onSubmit = data => { // When save-button is pressed we format the data  and post it to the server
    data.tosleep = tosleep;
    data.fromsleep = fromsleep;
    data.range = range;
    data.desc = desc;
    data.totalHours = totalHours;

    if (modifiedId === undefined) { // If we post new obs      
      postObs(data);
    } else { // If we modify a certain obs      
      putObs(data, modifiedId);
    }
    setIsupdated(false);
  }

  async function postObs(data) { // Post a new observation:
    await fetch('http://localhost:3000/' + Email, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(() => { formreset(); setIsupdated(true); })
      .catch(error => console.error("error: " + error))
  }

  async function fetchtomodify(id) { // Fetch the right observation to modify
    fetch('http://localhost:3000/' + Email + '/' + id)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .then(data => { // Set fetched data to the form
        setTosleep(new Date(data.tosleep));
        setFromsleep(new Date(data.fromsleep));
        setRange(data.range);
        setDesc(data.desc);
      })
      .catch(error => console.error('Error:', error))
  }

  async function putObs(data, modifiedId) { // Modify an existing observation:
    await fetch('http://localhost:3000/' + Email + '/' + modifiedId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(() => { formreset(); setIsupdated(true); }) // After fetching form reset and array refresh
      .catch(error => console.error("error: " + error))
  }

  let formreset = () => {
    setTosleep(yesterday);
    setFromsleep(today);
    setRange(1);
    setDesc('');
  }

  return (
    <div className="box">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Kävin nukkumaan:</label><br></br>
        <DatePicker
          selected={tosleep}
          onChange={e => setTosleep(e)}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="Pp"
          locale="fi"
          timeIntervals={15}
          ref={register({ name: 'tosleep', value: tosleep })}
        />

        <br></br><label>Heräsin:</label><br></br>
        <DatePicker
          selected={fromsleep}
          onChange={e => setFromsleep(e)}
          minDate={tosleep}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="Pp"
          locale="fi"
          timeIntervals={15}
          ref={register({ name: 'fromsleep', value: fromsleep })}
        />
        <br></br>
        <label>Unen laatu:</label>

        <InputRange
          value={range}
          name="range"
          style={{ width: '50%' }}
          onChange={e => setRange(e)}
          maxValue={5}
          minValue={1}
          ref={register({ name: 'range', value: range })}
        />

        <label>Sanallinen arvio:</label><br></br>
        <textarea
          placeholder='Vapaa kuvaus nukutusta yöstä, ja sen vaikutuksista päivän vireystilaan'
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
          ref={register({ name: 'desc', value: desc })}
        ></textarea>
        <br></br>

        <button className="buttonstyling" type="submit">Tallenna</button>
        <button className="buttonstyling" type="button" onClick={formreset}>Tyhjennä</button>
      </form>

    </div>
  );
}

export default Formbox;
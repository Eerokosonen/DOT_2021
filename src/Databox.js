import React, { useState, useEffect } from 'react';
import './content.css'; // Styling for Formbox & Databox components
import './App.css'; // Basic styling
import { FaEdit, FaTrashAlt, FaInfoCircle } from "react-icons/fa"; // FontAwesome icons

import { useRechartToPng } from "recharts-to-png"; // PNG Download
import { saveAs } from 'file-saver';

import Modal from 'react-modal'; // Modal package
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'; // React-tabs module for array/graph tabs
import 'react-tabs/style/react-tabs.css';

import moment from 'moment'; // Module for date formatting

import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from 'recharts'; // Recharts.js module for the graph

function Databox({ isupdated, setModifiedId, Email }) {

  // If isupdated variable is changed -this component fetches data from the API.
  // with setModifiedID this component sends the observation ID to Formbox component for editing.
  // Email variable contains the users username for API calls.

  const [dataset, setDataset] = useState([]);
  let [modalOpen, setModalOpen] = useState(false);
  let [modaldata, setModaldata] = useState();

  useEffect(() => {
    getData(); // Whenever API is updated - new data is fetched from the API.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isupdated]);

  // PNG Download
  const [png, ref] = useRechartToPng();
  const handleDownload = React.useCallback(async () => {
    saveAs(png, "myChart.png");
  }, [png]);
  // PNG Download
  
  async function getData() {
    fetch('http://localhost:3000/' + Email)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .then(data => { setDataset(data); setModifiedId(); }) // Set fetched data to an array
      .catch(error => console.error('Error:', error))
  }
  
  async function removeObs(obs) {
    await fetch('http://localhost:3000/' + Email + '/' + obs.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => { getData(); }) // Refresh Array when obs deleted
      .catch(error => console.error("error: " + error))
  }

  async function openObs(id) {
    await fetch('http://localhost:3000/' + Email + '/' + id,)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .then(data => { openModal(data) }) // Set fetched data to an array
      .catch(error => console.error('Error:', error))
  }


  function openModal(data) {// Modal functions
    setModalOpen(true);
    fillmodaldata(data);
  }

  function fillmodaldata(data) {
    setModaldata(
      <p>
        <b>Havainnon numero:</b> {data.id}<br></br><br />
        <b>Nukkumaan käyty:</b> {moment(data.tosleep).format("DD.MM.YYYY HH:mm")}<br></br><br />
        <b>Herätty:</b> {moment(data.fromsleep).format("DD.MM.YYYY HH:mm")} <br></br><br />
        <b>Nukuttu aika tunteina:</b> {data.totalHours.toPrecision(2)} <br></br><br />
        <b>Koettu unen laatu:</b> {data.range} <br></br><br />
        <b>Kuvaus unen vaikutuksista päivään:</b> {data.desc}<br></br><br />
      </p>
    )
  }

  function closeModal() {
    setModalOpen(false);
  }//*Modal functions

  const formattosleep = (tickItem) => {
    return moment(tickItem).format("DD.MM"); //Formatting data for the graph
  }

  const formathours = (tickItem) => {
    return tickItem + 'h'; //Formatting data for the graph
  }

  return (
    <Tabs className="box databox">
      <TabList>
        <Tab>Taulukko</Tab>
        <Tab>Graafi</Tab>
      </TabList>

      <TabPanel>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Havainto nro:</th>
              <th>Nukkumaan</th>
              <th>Herätty</th>
              <th>Nukuttu aika</th>
              <th>Unen laatu</th>
            </tr>
          </thead>
          <tbody>
            {dataset.map((c, index) =>
              <tr key={c.id}>
                <td><FaInfoCircle onClick={() => openObs(c.id)} className="iconbtn" /></td>
                <td>{c.id}</td>
                <td>{moment(c.tosleep).format("DD.MM.YYYY HH:mm")}</td>
                <td>{moment(c.fromsleep).format("DD.MM.YYYY HH:mm")}</td>
                <td>{c.totalHours.toPrecision(2)}</td>
                <td>{c.range}</td>
                <td><FaEdit onClick={() => setModifiedId(c.id)} className="iconbtn" /></td>
                <td><FaTrashAlt onClick={() => removeObs(c)} className="iconbtn" /></td>
              </tr>)}
          </tbody>
        </table>
      </TabPanel>

      <TabPanel>
        <BarChart width={450} height={250} data={dataset} ref={ref} className="barchart">
          <CartesianGrid />
          <XAxis dataKey="tosleep" tickFormatter={formattosleep} />
          <YAxis tickFormatter={formathours} />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalHours" name="Nukuttu aika tunteina" fill="#8884d8" />
          <Bar dataKey="range" name="Unen laatu" fill="#82ca9d" />
        </BarChart>
        <button style={{margin:'3rem'}} className="buttonstyling" onClick={handleDownload}>Lataa kuvio png-tiedostona</button>
      </TabPanel>

      <Modal ariaHideApp={false} isOpen={modalOpen} onRequestClose={closeModal} contentLabel="Modal" className="modal">
        {modaldata}                
      </Modal>

    </Tabs>
  );
}

export default Databox;

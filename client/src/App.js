import React, { useState, useEffect } from 'react';
import ReactMapGL , { Marker, Popup }from 'react-map-gl';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {

  const [logEntries, setLogEntries] = useState([]);
  const [showPopups, setShowPopups] = useState({});
  const [logEntryPopup, setLogEntryPopup] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 4
  });

  const getEntries = async () => {
    try{
      const logEntries = await listLogEntries();
      console.log(logEntries);
      setLogEntries(logEntries);
    }catch(error){
      console.error(error);
      
    }
  }


  useEffect(() => {
    getEntries();
  }, []);


  const showAddMarkerPopup = (event) => {
    const [ longitude, latitude ] = event.lngLat;
    setLogEntryPopup({
      latitude,
      longitude,
    });
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/thoratvinod/ck9wr360m0plq1iphj6t3cr7u"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={setViewport}
      onDblClick={showAddMarkerPopup}
    >
    {
      logEntries.map(entry => (
        <React.Fragment key={entry._id}>
          <Marker
            latitude={entry.latitude} 
            longitude={entry.longitude} 
            offsetLeft={-12} 
            offsetTop={-24}
           
          >
            <div 
              onClick={ () => {
                setShowPopups({
                  [entry._id]:true,
                })
              }}
            >
              <svg
                className="marker"
                style={{
                  height: `${6 * viewport.zoom}px`,
                  width: `${6 * viewport.zoom}px`,
                }}
                version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512">
                <g>
                  <g>
                    <path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                      c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                      c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
                  </g>
                </g>
              </svg>
              
            </div>
          </Marker>
          {
            showPopups[entry._id] ? (
              <Popup
                latitude={entry.latitude} 
                longitude={entry.longitude} 
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setShowPopups({})}
                anchor="top" >
                {entry.image ? <img className="image" src={entry.image} alt={entry.title}/> : null}
                <div>
                  <h4>{ entry.title }</h4>
                  <p>{ entry.comments }</p>
                  <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                </div>
              </Popup>
            ) : null

          }
          
          
        </React.Fragment>
      ))
      }
      {
        logEntryPopup ? (
          <>
            <Marker
              latitude={logEntryPopup.latitude} 
              longitude={logEntryPopup.longitude} 
              offsetLeft={-12} 
              offsetTop={-24}
            >
              <div>
                <svg
                  className="logEntryMarker"
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                  version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512">
                  <g>
                    <g>
                      <path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
                        c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
                        c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
                    </g>
                  </g>
                </svg>
                
              </div>
            </Marker>
            <Popup
              className="logEntryPopup"
              latitude={logEntryPopup.latitude} 
              longitude={logEntryPopup.longitude} 
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={false}
              onClose={() => setLogEntryPopup(null)}
              anchor="top" >
                <LogEntryForm 
                  onClose={ () => {
                    setLogEntryPopup(null);
                    getEntries();
                  }} 
                  latitude={logEntryPopup.latitude} 
                  longitude={logEntryPopup.longitude}/>
            </Popup>
          </>
        ) : null
      }
    }
    </ReactMapGL>
  );
}
export default App;

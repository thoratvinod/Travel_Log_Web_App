import React, { useState } from 'react';                             
import { useForm } from 'react-hook-form';
import { createLogEntries } from "./API";

const LogEntryForm = ({ latitude, longitude, onClose }) => {

  const { register, handleSubmit } = useForm();
  const [loading, setLoading ] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {

      setLoading(true);
      data.latitude = latitude;
      data.longitude = longitude;
      await createLogEntries(data);
      onClose();

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }
  return (
    <>
      <h3>Add Travel Log Entry</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="entry-form" action="">
        { error ? <h3 style={{color: 'red'}}>{ error }</h3> : null}
        <div>
          <label htmlFor="apikey">API Key: </label>
          <input name="apikey" type="text" id="apikey" ref={register} required/>
        </div>
        <div>
          <label htmlFor="title">Title: </label>
          <input name="title" type="text" id="title" ref={register} required/>
        </div>
        <div>
          <label htmlFor="description">Description: </label>
          <textarea name="description" id="description" rows={3} ref={register} required></textarea>
        </div>
        <div>
          <label htmlFor="comments">Comments: </label>
          <textarea name="comments" id="comments" rows={3} ref={register}></textarea>
        </div>
        <div>
          <label htmlFor="visit">Visit Date: </label>
          <input name="visitDate" id="visit" type="date" ref={register} required/>
        </div>
        <div>
          <label htmlFor="image">Image: </label>
          <input name="image" type="text" id="image" ref={register}/>
        </div>
        <button disabled={loading}>{loading ? 'loading...' : 'Add Travel Entry'}</button>
      </form>
    </>
  );
}

export default LogEntryForm;
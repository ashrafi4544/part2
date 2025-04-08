import { useState, useEffect } from 'react';
import personsService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import './styles.css'
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const handleAddPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        personsService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ));
            setNotification(`Updated ${returnedPerson.name}'s number successfully!`);
            setTimeout(() => setNotification(null), 5000);
          })
          .catch(error => {
            setErrorMessage(`Error: ${newName} has already been removed from the server.${error}`);
            setTimeout(() => setErrorMessage(null), 5000);
            setPersons(persons.filter(person => person.id !== existingPerson.id));
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNotification(`Added ${returnedPerson.name}`);
          setTimeout(() => setNotification(null), 5000);
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          setErrorMessage(`Error: Could not add person.${error}`);
          setTimeout(() => setErrorMessage(null), 5000);
        });
    }
  };

  const handleDeletePerson = (id) => {
    const person = persons.find(p => p.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setNotification(`Deleted ${person.name}`);
          setTimeout(() => setNotification(null), 5000);
        })
        .catch(error => {
          setErrorMessage(`Error: ${person.name} was already removed. ${error}`);
          setTimeout(() => setErrorMessage(null), 5000);
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type="success" />
      <Notification message={errorMessage} type="error" />
      <Filter search={search} setSearch={setSearch} />
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        handleAddPerson={handleAddPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} search={search} handleDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;

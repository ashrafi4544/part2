const Persons = ({ persons, search, handleDeletePerson }) => {
  return (
    <ul>
      {persons
        .filter(person => person.name.toLowerCase().includes(search.toLowerCase()))
        .map(person => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDeletePerson(person.id)}>Delete</button>
          </li>
        ))}
    </ul>
  );
};

export default Persons;

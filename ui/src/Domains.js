import React, { useState, useEffect } from 'react';

function CreateDomain({ onDomainCreated }) {
  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('/cc/api-domains', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    const data = await response.json();
    onDomainCreated(data);
    setName('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Domain</h2>
      <label>
        Name:
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <button type="submit">Create</button>
    </form>
  );
}

function Domains() {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);

  const fetchDomains = async () => {
    const response = await fetch('/cc/api-domains');
    const data = await response.json();
    setDomains(data);
  }

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleDomainClick = (domain) => {
    setSelectedDomain(domain);
  }

  const handleDomainCreated = (domain) => {
    setDomains([...domains, domain]);
  }

  const handleDomainDeleted = async (id) => {
    await fetch(`/cc/api-domains/${id}`, { method: 'DELETE' });
    setDomains(domains.filter((domain) => domain.id !== id));
    setSelectedDomain(null);
  }

  return (
    <div>
      <h1>Domains</h1>
      <ul>
        {domains.map((domain) => (
          <li key={domain.id} onClick={() => handleDomainClick(domain)}>
            {domain.name}
          </li>
        ))}
      </ul>
      {selectedDomain && (
        <div className="domain">
          <h2>{selectedDomain.name}</h2>
          <p>ID: {selectedDomain.id}</p>
          <div className="button-container">
            <button className="button" onClick={() => handleDomainDeleted(selectedDomain.id)}>Delete</button>
          </div>
        </div>
      )}
      <div>
        <CreateDomain onDomainCreated={handleDomainCreated} />
      </div>
    </div>
  );
}

export default Domains;


import React, { useState } from 'react';
import Domains from './Domains';
import Domain from './Domain';

function App() {
  const [selectedDomain, setSelectedDomain] = useState(null);

  const handleDomainClick = domain => {
    setSelectedDomain(domain);
  };

  return (
    <div>
      {selectedDomain ? (
        <Domain domain={selectedDomain} />
      ) : (
        <Domains onDomainClick={handleDomainClick} />
      )}
    </div>
  );
}

export default App;

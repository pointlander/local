import React from 'react';

function Domain({ domain }) {
  return (
    <div>
      <h2>{domain.name}</h2>
      <p>{domain.description}</p>
      <p>{domain.date_created}</p>
      {/* display other information about the domain */}
    </div>
  );
}

export default Domain;

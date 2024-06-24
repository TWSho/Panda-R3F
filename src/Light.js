// Light.js
import React from 'react';

export default function Light() {
  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={1} />
    </>
  );
}

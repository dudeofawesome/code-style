import React from 'react';

export default function foo() {
  alert(window.location.href);
  return <h1>{document.body.innerHTML}</h1>;
}

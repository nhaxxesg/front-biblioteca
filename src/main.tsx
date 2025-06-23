// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' 

// ➡️➡️➡️ ¡¡ASEGÚRATE DE QUE ESTA LÍNEA EXISTE!! ⬅️⬅️⬅️
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
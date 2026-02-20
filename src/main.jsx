// React 앱 시작점: 루트에 App을 마운트한다.
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App.jsx'

// Vite 기본 루트에 렌더링
createRoot(document.getElementById('root')).render(
    <App />
)

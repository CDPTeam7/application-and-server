import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {BrowserRouter as Router} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <App />
  </Router> 
)

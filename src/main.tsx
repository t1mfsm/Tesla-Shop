import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store.ts';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/Tesla-Shop">
    <Provider store={store}>
                <App />
            </Provider>
  </BrowserRouter>
)

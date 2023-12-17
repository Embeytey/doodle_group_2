import Layout from "./components/Layout/Layout";
import axios from "axios";
import Cookies from 'js-cookie';
import "./index.css";
import "./App.css";

function App() {
  //axios defaults
  axios.defaults.headers.common['withCredentials'] = true;

  return (
    <div className="App">
      <Layout />
    </div>
  );
}

export default App;

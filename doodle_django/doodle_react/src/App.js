import Layout from "./components/Layout/Layout";
import axios from "axios";
import { AuthProvider } from "./components/Login/AuthProvider";
import "./index.css";
import "./App.css";
import './components/Feedback/styles.css'; // Import the CSS file
function App() {
  //axios defaults
  axios.defaults.headers.common['withCredentials'] = true;

  return (
    <AuthProvider>
      <div className="App">
        <Layout />
      </div>
    </AuthProvider>
  );
}

export default App;

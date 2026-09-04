import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Agence from './pages/Agence';


const App = () => {


  return (
    <div>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/agence" element={<Agence />} />
      </Routes>
    </div>
  );
};

export default App;

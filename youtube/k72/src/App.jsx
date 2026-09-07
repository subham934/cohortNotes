import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Agence from './pages/Agence';
import Navbar from './components/Navigation/Navbar';
import FullScreenNav from './components/Navigation/FullScreenNav';


const App = () => {


  return (
    <div className='overflow-x-hidden'>
      <Navbar/>
      <FullScreenNav/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/agence" element={<Agence />} />
      </Routes>
    </div>
  );
};

export default App;

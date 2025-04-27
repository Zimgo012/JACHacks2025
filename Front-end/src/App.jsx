import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import InHome from './pages/InHome';
import SelectPet from './pages/SelectPet';

function App() {  

  return (
    <>
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/home' element={<InHome />}></Route>
      <Route path='/select-pet' element={<SelectPet />}></Route>
    </Routes>
    </>
  );
}

export default App

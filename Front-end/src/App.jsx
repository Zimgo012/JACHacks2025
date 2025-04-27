import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import InHome from './pages/InHome';
import SelectPet from './pages/SelectPet';
import Loading from './pages/Loading';

function App() {  

  return (
    <>
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/home' element={<InHome />}></Route>
      <Route path='/select-pet' element={<SelectPet />}></Route>
      <Route path='/loading' element={<Loading />}></Route>
    </Routes>
    </>
  );
}

export default App

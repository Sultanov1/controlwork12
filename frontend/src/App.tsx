import AppToolbar from './components/Header/AppToolbar.tsx';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Login from './features/Login.tsx';
import Register from './features/Register.tsx';
import './App.css'

const App = () => {
    return (
      <>
      <header>
        <AppToolbar/>
      </header>
      <main className="app-main">
      <Container maxWidth="xl" sx={{marginTop: '50px'}}>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path="*" element={<h3>No image</h3>}/>
        </Routes>
      </Container>
      </main>
</>
);
};

export default App;
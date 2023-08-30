import './App.css';
import Homepage from './pages/Homepage';
import ErrorPage from './pages/ErrorPage';
import LogIn from './pages/LogIn';
import SignIn from './pages/SignIn';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddPost from './pages/AddPost';
import { ProtectedRoutes } from './middlewares/ProtectedRoutes';
import SinglePost from './pages/SinglePost';
import Success from './pages/Success';

function App() {
  const baseUrl = process.env.REACT_APP_URL;
  return (
    <BrowserRouter>
      <Routes>

        <Route exact path='/' element={<Homepage />} />

        <Route path='/logIn' element={<LogIn />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/success' element={<Success />} />
        <Route path='/SinglePost/:id' element={<SinglePost />} />

        <Route element={<ProtectedRoutes />}>
          <Route path='/AddPost' element={<AddPost />} />
        </Route>

        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Signup from './components/Signup';
import { Toaster } from 'react-hot-toast';
import HomePage from './components/HomePage';
import Entry from './components/Entry';
import CreateEntry from './components/CreateEntry'
import DiaryState from './context/DiaryState';
import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';
import ForgotPassword from './components/ForgotPassword';

function App() {
  return (
    <div className="App">
    <div>
      <Toaster position="top-center"
        toastOptions={{
          success:{
            theme:{
              primary:'#4aed88'
            }
          }
        }}/>
      </div>
      <DiaryState>
    <Router>
      <Routes>
        <Route exact path='/login' element={<Login />}></Route>
        <Route exact path='/signup' element={<Signup />}></Route>
        <Route exact path='/' element={<HomePage />}></Route>
        <Route exact path ='/createentry' element = {<CreateEntry />}></Route> 
        <Route exact path='/diaryentry/:date' element={<Entry />}></Route>
        <Route exact path='/changepassword' element={<ChangePassword />}></Route>
        <Route exact path='/deleteaccount' element={<DeleteAccount />}></Route>
        <Route exact path='/forgotpassword' element={<ForgotPassword />}></Route>
      </Routes>
    </Router>
    </DiaryState>
    </div>
  );
}

export default App;

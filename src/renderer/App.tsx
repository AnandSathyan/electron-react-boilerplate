import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
// import './App.css';
import LoginScreen from './screens/Login/index';

// function Hello() {
//   return (
//     <></>
//   );
// }

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
      </Routes>
    </Router>
  );
}

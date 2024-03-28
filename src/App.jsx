import { useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import { ComponentSelection } from './context/componentSelection';
import Home from './pages/Home';
import About from './pages/About';
import Characters from './pages/Characters';
import Auction from './pages/Auction';
import CommonAlert from './components/CommonAlert';

function App() {
  const {currentComponent} = useContext(ComponentSelection);

  return (
    <>
      <Navbar />
      {currentComponent == 'Home' ? <Home /> : null}
      {currentComponent == 'Characters' ? <Characters /> : null}
      {currentComponent == 'About' ? <About /> : null}
      {currentComponent == 'Auction' ? <Auction /> : null}
      {currentComponent == 'IAM' ? <Auction /> : null}
      <CommonAlert />
    </>
  )
}

export default App

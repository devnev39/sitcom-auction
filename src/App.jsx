import { useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import { ComponentSelection } from './context/componentSelection';
import Home from './pages/Home';
import About from './pages/About';
import Auction from './pages/Auction';
import AuctionView from './pages/AuctionView';
import CommonAlert from './components/CommonAlert';
import IAM from './pages/IAM';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppView from './pages/AppView';

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppView />} />
          <Route path='/view' element={<AuctionView />}/>
        </Routes>
      </BrowserRouter>
      <CommonAlert />
    </>
  )
}

export default App

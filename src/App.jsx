import Navbar from './components/Navbar';
import AuctionView from './pages/AuctionView';
import CommonAlert from './components/CommonAlert';
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

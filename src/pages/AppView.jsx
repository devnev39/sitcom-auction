import { useContext } from 'react'
import { ComponentSelection } from '../context/componentSelection';
import Home from './Home';
import About from './About';
import Auction from './Auction';
import IAM from './IAM';
import TeamView from './TeamView';
import Footer from './Footer';

export default function AppView() {
    const {currentComponent} = useContext(ComponentSelection);
  return (
    <>
    {currentComponent == 'Home' ? <Home /> : null}
    {currentComponent == 'About' ? <About /> : null}
    {currentComponent == 'Auction' ? <Auction /> : null}
    {currentComponent == 'IAM' ? <IAM /> : null}
    {currentComponent == 'Team View' ? <TeamView /> : null}
    <Footer />
    </>
  )
}

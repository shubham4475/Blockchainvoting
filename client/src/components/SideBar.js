import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import image from './images/image_website_blockchain_app.jpg';


const SideBar = () => {
  return (
    <div>

      <div className="sidebar">
     
      <div className='sidebarContent'>
      <img src={image} alt='Vote it'className='myImage'></img>
        <Link to="/" className='sidebarText text-center' style={{paddingTop:'30px'}}><span>Register</span></Link>
        <Link to="/voteNow" className='sidebarText text-center'><span>Vote Now</span></Link>
        <Link to='/results' className='sidebarText'><i className="fas fa-home"></i> <span>How it Works</span></Link>
        </div>
      </div>
    </div>
  )
}

export default SideBar
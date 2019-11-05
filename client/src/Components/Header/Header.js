import React, {Component} from 'react';
import './Header.css';
import {Link} from 'react-router-dom';
export default class Header extends Component{

render() {
  return (
        <div className="headerContainer">
            <h1>
                Welcome to our awesome blog page !
            </h1>
            <p>
                Here yo have two chooses: 
            </p>
            <div className="headerButtonContainer">
                <Link to='/BlogList'><button>All blog posts</button></Link>
                <Link to='/BLogCreate'><button>Make new blog post</button></Link>
            </div>
        </div>
        );
    }
}
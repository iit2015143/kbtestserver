import React from "react";

import ImageBox from './components/ImageBox';

const axios = require('axios');
const _ = require('lodash');
const $ = require('jquery');

class UserProfileBox extends React.Component {
  constructor(){
    super();
    this.state = {
      username : null,
      location : null,
      following : 0,
      posts : 0,
      reviews : 0,
      description : null,
      setName : false,
      setDes : false,
      setLoc : false
    }
    this.getData();
    this.setUsername =  this.setUsername.bind(this);
    this.setLocation =  this.setLocation.bind(this);
    this.setDescription =  this.setDescription.bind(this);
  }
  getData(){
    axios.get('http://localhost:8000/getData').then((data)=>{
      if(data.number !== undefined){
        console.log(JSON.Stringify(data));
        this.setState({
          username : data.number,
          location : JSON.stringify({Lat : data.Location.lat,Long : data.Location.long}),
          following : 2,
          posts : 3,
          reviews : 5,
          description : data._id
        });
      }
    });
  }
  setUsername(){
    //Connect to backend
    this.setState({
      username : 'Hello',
      setName : true,
      setDes : false,
      setLoc : false
    });
  }
  setDescription(){
    //Connect to backend
    this.setState({
      description : 'Khasha Mana Kha Karo Na',
      setName : false,
      setDes : true,
      setLoc : false
    });
  }
  setLocation(){
    //Connect to backend
    this.setState({
      location : 'Some where on earth goddamn it',
      setName : false,
      setDes : false,
      setLoc : true
    });
  }
  render(){
    return (
      <div className="card">
        <ImageBox />
          <div className="details">
            <h3 onClick={this.setUsername}>{this.state.username}</h3>
            <p>@{this.state.location}</p>
            <div className="location-set"  onClick={this.setLocation}>
              <i className="fa fa-map-marker"></i>
            </div>
          </div>
        <div className="container-card">
          <div onClick={this.setDescription}>{this.state.description} <i className="fa fa-pencil"></i></div>
          <hr />
          <div className="row">
            <div className="col-4">
              <p>{this.state.following}</p>
              <p>Following</p>
            </div>
            <div className="col-4">
              <p>{this.state.following}</p>
              <p>Posts</p>
            </div>
            <div className="col-4">
              <p>{this.state.following}</p>
              <p>Reviews</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfileBox;

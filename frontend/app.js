const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

class UserBox extends React.Component {
  constructor(dunno){
    super(dunno);
    this.state = {
      username : 'null',
      location : 'null',
      following : 0,
      posts : 0,
      reviews : 0,
      description : 'null',
      setName : false,
      setDes : false,
      setLoc : false

    }
    this.getData()
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
      setName : true
    });
  }
  setDescription(){
    //Connect to backend
    this.setState({
      description : 'Khasha Mana Kha Karo Na',
      setDes : true
    });
  }
  setLocation(){
    //Connect to backend
    this.setState({
      location : 'Some where on earth goddamn it',
      setName : true
    });
  }
  render(){
    const stateee = JSON.stringify(this.state);
    if(this.state.username !== null){
      return (
        <div className="container">
          <div className="card">
            <div className="card-img">
            <img src="./images/user.png" alt="user" width='50%' height="50%"/>
            </div>
            <div className="card-header">
              <h2 onClick={this.setUsername}>{this.state.username}</h2>
              <p onClick={this.setLocation}>{ this.state.location }</p>
              <div className="col-1">
                <div className="col-3">
                </div>
                <div className="col-3">
                  <hr />
                </div>
                <div className="col-3">
                </div>
                <p onClick={this.setDescription}>{this.state.description}</p>
              </div>
            </div>
            <hr />
            <div className="card-body">
              <div className="col-3">
                <p>{this.state.following}</p>
                <h3>Following</h3>
              </div>
              <div className="col-3">
                <p>{this.state.posts}</p>
                <h3>Posts</h3>
              </div>
              <div className="col-3">
                <p>{this.state.reviews}</p>
                <h3>Reviews</h3>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <p> Please log in </p>
      );
    }
  }
}
export default UserBox;

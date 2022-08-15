import React from 'react';
import { useMutation } from '@apollo/client';
import queries from '../queries';
//import './home.scss'
import 
{ Card,
 CardActionArea, 
 CardContent, 
 CardMedia, 
 Grid, 
 Typography, 
 Button,
 makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});

const NewPost = () => {
  
  const[ addImage ] = useMutation(queries.ADD_IMG);
  const classes = useStyles();

  let url;
  let description;
  let posterName;  
  return (
    <div className = "newpost">
    <nav className="navbar">
        <div className="nav-center">
          <ul className="nav-links">   
            <li> <a href = "/" >Home</a></li>
            <li><a href= "/my-bin" >Binned Post</a></li>
            <li><a href = "/my-post" >My Post</a></li>
            <li><a href ="/popularity">Popularity</a></li>
          </ul>
          </div>
          </nav>
      <h1>New Post</h1>
      <form className = "form" id = "add-img" onSubmit={(e)=>{
        e.preventDefault()
        addImage({
          variables: {
              url: url.value,
              description: description.value,
              posterName: posterName.value
          }
        }); 
        url = '';
        description ='';
        posterName = '';
        alert('Post added successfully');
      }} >
        <label>
        Image url: 
        <input ref={(node) => url=node} required/>
        </label>
        <br />
        <label>
        Image description: 
          <input ref={(node) => description=node} required/>
        </label>
        <br />
        <label>
        Poster's Name: 
        <input ref={(node) => posterName=node} required />
        </label>
        <br />
        <button className="submit" type="submit">
        Add Post
        </button>
      </form>
    </div>
  )
}

export default NewPost;
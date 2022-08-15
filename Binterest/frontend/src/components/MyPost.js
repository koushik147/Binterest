import React from 'react';
import { useQuery, useMutation} from '@apollo/client';
import queries from '../queries';
//import './home.scss';
//import  ButtonComponent from  './Button'
import { Link } from "react-router-dom";
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


const MyPost = () => {
    const { error, data } = useQuery(queries.GET_USERPOSTED,{
        fetchPolicy: "cache-and-network",
        pollInterval: 500
    });
    const [removeFromBin] = useMutation(queries.UPDATE_IMG);
    const classes = useStyles();
    const [removeImage] = useMutation(queries.DELETE_IMG, {
        update(cache) {
            const { userPostedImages } = cache.readQuery({
                query: queries.GET_USERPOSTED,
            });
            cache.writeQuery({
                query: queries.GET_USERPOSTED,
                data: {
                    userPostedImages: userPostedImages.filter((e) => e.id === data.userPostedImages.id),
                },
            });
        },
    });
  if(typeof(data)=='object'){
    return (
    <div>
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
      <h1>My Posts</h1>
      <ul>
        {data.userPostedImages.map(element =>{
          return(  
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={element.id}>
            <Card className={classes.card} variant='outlined'>
                <CardActionArea>
                <div className = "post" key = {element.id}>
                <li>
                    <img src = {element.url} alt = "image" className = "image"/>
                    <p>Description: {element.description}</p>
                    <p>Author: {element.posterName}</p>
                    </li>
                    <br/>
                    
                </div>
                {element.binned && (
                <Button color = "primary" border = "5px solid #3200F8"
                className="navlink" style={{ margin: "auto", width: "200px", maxHeight: "200px" , backgroundColor: "#505050", border: "1px solid #000000", color: "white"}}
                onClick={async (e) => {
                  e.preventDefault();
                  await removeFromBin({
                    variables: {
                      id: element.id,
                      url: element.url,
                      posterName: element.posterName,
                      description: element.description,
                      userPosted: element.userPosted,
                      binned: false,
                      numBinned: element.numBinned
                    },
                  });
                }}
              >
                Remove from Bin
              </Button>
              )}
            {!element.binned && (
                <Button color = "primary" border = "5px solid #3200F8"
                className="navlink" style={{ margin: "auto", width: "200px", maxHeight: "200px" , backgroundColor: "#505050", border: "1px solid #000000", color: "white"}}
                onClick={async (e) => {
                  e.preventDefault();
                  await removeFromBin({
                    variables: {
                      id: element.id,
                      url: element.url,
                      posterName: element.posterName,
                      description: element.description,
                      userPosted: element.userPosted,
                      binned: true,
                      numBinned: element.numBinned
                    },
                  });
                }}
              >
                Add to Bin
              </Button>
              )}
              <Button className = "deleteButton" onClick = {()=>{
                    try{
                    removeImage(
                        {
                    variables:{
                        id: element.id  
                    }
                    })
                    alert("Deleted Successfully!")
                }catch(e){
                    alert("Error could not delete...")
                }
                }
                }>
                    Delete
                    </Button>
                </CardActionArea>
            </Card>
            </Grid>
          )}
        )}  
      </ul>
      <Link to = "/new-post" className = "link">Click here to create a new post!</Link>     
      </div>
      )
  }else if(error){
    return<div><p>{error.message}</p></div>
  }
};


export default MyPost;
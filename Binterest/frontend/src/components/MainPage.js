import React, { useState} from 'react';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';
//import './home.scss';
//import  ButtonComponent from  './Button'
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
		height: '600px', 
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
		height: '350px',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12, 
        marginLeft: '100px'
	} 
});


const Home = () => {
    const [pageNum, setPageNum] = useState(1);
    const classes = useStyles();
    const [addToBin] = useMutation(queries.UPDATE_IMG);
    const { error, data } = useQuery(queries.GET_UNSPLASH,{ 
      variables: {
        pageNum: pageNum,
      }
    });
    const handleMore = () => setPageNum(pageNum + 1);
  
    if(typeof data == 'object'){ 
    return (
    <div className = "home">
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
      <h1 >Welcome to Binterest!</h1>
      <ul>
        {data && data.unsplashImages.map(element =>{
          return(  
            <Grid item xs={10} md={1} lg={3} xl={1} key={element.id}>
            <Card className={classes.card} variant='outlined'>
                <CardActionArea>
                    <div className = "post" key = {element.id}>
                    <li>
                        <img src = {element.url} alt = "image" className = "image"/>
                        <p>Description: {element.description ? element.description : 'N/A'}</p>
                        <p>Author: {element.posterName}</p>
                        </li>
                        <br />
                    </div>
                    {element.binned && (
                <Button color = "primary" border = "5px solid #3200F8"
                className="navlink" style={{  margin: "auto", width: "200px", maxHeight: "200px" , backgroundColor: "#505050", border: "1px solid #000000", color: "white"}}
                onClick={async (e) => {
                    console.log(element);
                  e.preventDefault();
                  await addToBin({
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
                
                <Button   
                className="navlink" style={{ paddingLeft: "20px", width: "200px", maxHeight: "200px" , backgroundColor: "#505050", border: "1px solid #000000", color: "white" }}
                onClick={async (e) => {
                    console.log(element);
                  e.preventDefault();
                  await addToBin({
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
              
                </CardActionArea>
            </Card>
            </Grid>
          )}
        )}  
      </ul>
      <button className = "button" onClick = {handleMore}>Get More</button>
      </div>
    )
  } else if(error){
    return<div><p>{error.message}</p></div>
  }
};


export default Home;
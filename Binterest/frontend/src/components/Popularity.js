import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import "../App.css";
import queries from "../queries";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Button,
  Divider,
  CircularProgress,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    width: "400px",
    height: "550px",
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft:"10px",
    borderRadius: 5,
    border: "2px solid #000000",
    boxShadow: "0 19px 38px rgba(0,0,0,0), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "300px",
    width: "300px",
  },
  button: {
    color: "3200F8",  
    backgroundColor: "black",
    fontWeight: "bold",
    fontSize: 12,
  },
});

const Popularity = () => {
  const classes = useStyles();
  const { loading, data } = useQuery(queries.GET_TOP_BINNED
    , {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    pollInterval: 500,
  });
  console.log(data);
  const [removeFromBin] = useMutation(queries.UPDATE_IMG);
  let card = null;
  let count = 0;
  let user;
 
  const buildCard = (image) => {
    return (
        <>
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
        
        <Grid item xs={12} md={6} lg={12} xl={5} key={image.id}>
        <Card className={classes.card} variant="outlined">
          <img
            className={classes.media}
            src={image.url}
            title="image image"
            alt={image.posterName}
          />
 
          <CardContent>
            <h3>
              {image.description
                ? image.description
                : "Description not available"}
            </h3>
 
            <p>{image.posterName ? image.posterName : "No Author"}</p>
            <h3>
              Likes : 
              {image.numBinned}
            </h3>
            <Button
              className="navlink" style={{ margin: "auto", width: "200px", height: "30px" , backgroundColor: "#505050", border: "1px solid #000000", color: "white"}}
              onClick={() => {
                removeFromBin({
                  variables: {
                    id: image.id,
                    url: image.url,
                    description: image.description,
                    posterName: image.posterName,
                    binned: false,
                    userPosted: image.userPosted,
                    numBinned: image.numBinned,
                  },
                });
              }}
            >
              Remove From Bin
            </Button>
          </CardContent>
        </Card> 
      </Grid>
      </div>
      </>
    );
  };
 
  if (!loading && data && data.getTopTenBinnedPosts) {
    card =
      data.getTopTenBinnedPosts &&
      data.getTopTenBinnedPosts.map((image) => {
        count = count + image.numBinned;
        console.log(data.getTopTenBinnedPosts);
        return buildCard(image);
      });
  }
if (data && data.getTopTenBinnedPosts.length) {
    if (count <= 199) user = "Non-mainstream";
    else user = "Mainstream";
    return (
      <div>
        <h2>
         {count} {user} User's liked these posts!
        </h2>
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
      </div>
    );
  } else {
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
        <h2>No Popular Images</h2>
      </div>
    );
  }
};
export default Popularity;
const { ApolloServer, gql } = require('apollo-server');
//const lodash = require('lodash');
const uuid = require('uuid');
const axios = require('axios')
const redis = require("redis")
const client = redis.createClient();
client.on("error", function (e) {
    console.log("Error " + e);
});

const typeDefs =  gql`
    type Query {
        unsplashImages(page: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]
        getTopTenBinnedPosts: [ImagePost]
    }

    type ImagePost {
        id: ID!
        url: String!
        posterName: String!
        description: String
        userPosted: Boolean!
        binned: Boolean!
        numBinned: Int
    }   

    type Mutation{
        uploadImage(
            url: String!
            description: String 
            posterName: String) : ImagePost

        updateImage(
            id: ID! 
            url: String
            posterName: String 
            description: String
            userPosted: Boolean
            binned: Boolean,
            numBinned:Int) : ImagePost

        deleteImage(id: ID!) : ImagePost
}
`
async function getImage(page){
    try{
      const image = await axios.get(`https://api.unsplash.com/photos/?client_id=wulpE0D6O6aHihr5fdm06RBGE1E8ax9bYTRjvHXC2U0&page=${page}`);
      const imageData = image.data;
      const images = [];
    if(!client.isOpen) await client.connect();
      for(const i of imageData){
        const Img = await client.get(i.id);
        let binned = false;
        if(Img){
          binned = true;
        }
        //console.log("unsplash");
        let img = {
          id: i.id,
          url: i.urls.full,
          posterName: i.user.name,
          description: i.alt_description,
          userPosted: false,
          binned: binned,
          numBinned: i.likes
        }
          images.push(img);
      }
        return images; 
      } catch(e) {
            console.log(e);
      }
  }

async function getBinnedImages() {
    if(!client.isOpen) await client.connect();
    let binned = await client.lRange("binned", 0, -1)
    try{
      const images = [];
      for(const element of binned) {
        const imageData = await client.get(element);
        const imageObj = JSON.parse(imageData);
        if(typeof(imageObj)==='object' && imageObj!==null){
          if(imageObj.binned==true){      
            images.push(imageObj)
          }
        }
      }
      return images;
    } catch(e){
      console.log(e);
    }
  }

async function getUserPostedImages() {
    if(!client.isOpen) await client.connect();
    let posts = await client.lRange("userpost", 0, -1)
    try{
      let images = [];
      for(let element of posts){
        const imageData = await client.get(element)
        const imageObj = JSON.parse(imageData)
        if(typeof(imageObj) === 'object' && imageObj !== null){
          if(imageObj.userPosted == true){
            images.push(imageObj);
          }
        }
      }
      return images;
    } catch(e){
      console.log(e);
    }
  }

  async function topTenBinnedPosts() {
    if(!client.isOpen) await client.connect();
      try{
        console.log("popular");
          let topBinned = [];
          const binnedTop = await client.lRange("binned", 0, -1);
          for(let images of binnedTop){
              const popularity = await client.get(images);
              if(popularity){
                  topBinned.push(JSON.parse(popularity));
              }
          }
          topBinned.sort((a, b) => a.numBinned - b.numBinned);
          console.log(topBinned);
          return topBinned.reverse();
      }catch(e){
          console.log(e);
      }
  }


const resolvers = {
    Query:{
        unsplashImages: async (_, args) => getImage(args.page),
        binnedImages: () => getBinnedImages(),
        userPostedImages: () => getUserPostedImages(),
        getTopTenBinnedPosts: ()=> topTenBinnedPosts()
    },
    Mutation: {
        uploadImage: async (_, args) =>{
          if(!args.url || !args.description || !args.posterName) 
            throw `You must provide ${url}, ${description} and ${posterName}`
          if(typeof(args.url) !== "string" || typeof(args.description) !== "string" || typeof(args.posterName) !== "string") 
            throw `${args.url}, ${args.description} and ${args.posterName} must be a string`
          
          const imageData = {
            id:  uuid.v4(),
            url: args.url,
            description: args.description,
            posterName: args.posterName,
            userPosted: true,
            binned: false,
            numBinned: 0,
          };
          try{
            await client.set(imageData.id, JSON.stringify(imageData));
            await client.rPush('userpost', imageData.id);
        } catch(e){
          console.log(e)
        }
      return imageData;
      },
      updateImage: async (_, args) => {
        if (!client.isOpen) await client.connect();
        let updatedImage = {
                id: args.id,
                url: args.url,
                posterName: args.posterName,
                description: args.description,
                userPosted: args.userPosted,
                binned: args.binned,
                numBinned: args.numBinned,
            };
            console.log(updatedImage)
        const updatedImageData = JSON.stringify(updatedImage);
        let imageData = JSON.parse(await client.get(args.id));
        //console.log(imageData)
        try{
            if (args.binned == true){
              if (!imageData) {
                    await client.set(args.id, updatedImageData);
                    console.log(updatedImageData)
                if(args.binned) 
                    await client.rPush('binned', args.id)
                return updatedImage;
              } else{
                await client.set(args.id, updatedImageData);
                if (args.binned && !imageData.binned) 
                    await client.rPush('binned', args.id);
                if (imageData.binned && !args.binned) 
                    await client.lRem('binned', 0, args.id);
              }
            } 
            if(args.userPosted==true) {
                if (!imageData) {
                    await client.set(args.id, updatedImageData);
                  if (args.userPosted) 
                    await client.rPush('userpost', args.id);
                  return updatedImage;
                }else{
                    await client.set(args.id, updatedImageData);
                  if (args.userPosted && !imageData.userPosted) 
                    await client.rPush('userpost', id);
                  if (imageData.userPosted && !args.userPosted) 
                    await client.lRem('userpost', 0, args.id);
    
                }
                return updatedImage;
              }
            } catch(e){
              console.log(e)
            }          
              await client.del(args.id);
              if (imageData.userPosted) 
                await client.lRem('userpost', 0, args.id);
              if (imageData.binned) 
                await client.lRem('binned', 0, args.id);
              return updatedImage;
        },
        deleteImage: async (_, args) => {
            if(!args.id) 
                throw `You must provide an id`
            let imageData = JSON.parse(await client.get(args.id));
            try{
              await client.lRem('userpost', 0, args.id);
              await client.lRem('binned', 0, args.id);
              return imageData
            }catch(e){
              throw `not found`
            }
          }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
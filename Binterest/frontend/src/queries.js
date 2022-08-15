import { gql } from '@apollo/client';

const GET_UNSPLASH = gql `
  query getUnsplash($pageNum: Int!){
    unsplashImages(page: $pageNum){
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
}
`;
const GET_BINNED = gql `
  query binnedImages {
    binnedImages{
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`;

const GET_TOP_BINNED = gql`
query {
    getTopTenBinnedPosts{
        id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
}
`

const GET_USERPOSTED = gql `
  query userPost{
    userPostedImages{
      id
      url
      posterName
      description
      userPosted
      binned
      numBinned
    }
  }
`

const ADD_IMG = gql `
  mutation addImg($url: String!, $description: String, $posterName: String){
  uploadImage(url:$url, description:$description, posterName:$posterName){
    url
    description
    posterName
  }
}
`;

const UPDATE_IMG = gql `
  mutation updateImg($id: ID!, $url: String, $posterName: String, $description: String, $userPosted: Boolean, $binned: Boolean, $numBinned: Int){
  updateImage(id: $id, url:$url, posterName:$posterName, description:$description, userPosted:$userPosted, binned:$binned, numBinned: $numBinned){
    id
    url
    posterName
    description
    userPosted
    binned
    numBinned
  }
}
`
const DELETE_IMG = gql `
  mutation deleteImg($id: ID!){
  deleteImage(id: $id){
    id
  }
}
`;

let exp = { 
    GET_UNSPLASH,
    GET_BINNED, 
    GET_USERPOSTED, 
    ADD_IMG, 
    GET_TOP_BINNED,
    UPDATE_IMG, 
    DELETE_IMG }

export default exp;
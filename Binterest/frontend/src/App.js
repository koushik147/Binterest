import './App.css';
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import MainPage from "./components/MainPage"
import NewPost from "./components/NewPost"
import MyPost from "./components/MyPost"
//import Navbar from "./components/Navbar"
import BinnedPage from "./components/BinnedPage"
import Popularity from "./components/Popularity"
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link:new HttpLink({
    uri: 'http://localhost:4000'
  })
})

const App = ()=> {
  return (
  <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route exact path = "/" element = {<MainPage/>} />
        <Route exact path = "/my-bin" element = {<BinnedPage/>} />
        <Route exact path = "/my-post" element = {<MyPost/>} />
        <Route exact path = "/new-post" element = {<NewPost/>} />
        <Route exact path ="/popularity" element = {<Popularity />} />
      </Routes>
    </Router>
  </ApolloProvider>
  );
}

export default App;
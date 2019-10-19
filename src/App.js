
import React, { Component } from "react";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import axios from "axios";


const API_KEY = "eb2baf82f4897034f5e27180289f6624";


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}
//////////////////////////

class Tabs extends Component{
    
constructor(props) {
    
    super(props);
    
    this.state = {
        
        myFavList: {},
        myWatchList: {},
        hasErrors:false
        
    };
    
  
    
    }
    

    getWatchList = (event)=> {
        
         event.preventDefault();
   
        
          axios.get("https://api.themoviedb.org/3/account/{account_id}/watchlist/movies?api_key="+ API_KEY+"&sort_by=created_at.desc&session_id="+ this.props.session_id)
       .then( (response) => {
               
               
             this.setState({
                 
                 myWatchList: response.data.results,
             
                 
             });
             
             this.sendWatchData();
              
           
          }).catch( (error) => {
              
              this.setState({ hasErrors: true });
            // handle error
            console.log(error);
          });
   
        
    }
    ////////////////////////////////////////////////
    
    getFavList = (event)=> {
        
        event.preventDefault();
  
        
          axios.get("https://api.themoviedb.org/3/account/{account_id}/favorite/movies?api_key="+ API_KEY+"&sort_by=created_at.desc&session_id="+ this.props.session_id)
         .then( (response) => {
               
               
             this.setState({
                 myFavList: response.data.results,
        
                 
             });
              
              this.sendFavData();
              
          }).catch( (error) => {
              
              this.setState({ hasErrors: true });
            // handle error
            console.log(error);
          });
            
       
    }
    
    /////////////////////////////
    
    
    
    sendWatchData = () => {
        
         this.props.getwatchmovies(this.state.myWatchList);
         
    }
    
      sendFavData = () => {
          
         this.props.getfavmovies(this.state.myFavList);
         
    }
    /////////////////////////////
    
     render() {
         
        //   console.log(this.state.myWatchList)
        //   console.log(this.state.myFavList);
           
      
     if(this.props.logged){
         
         return(
             <div className = "tabs">
             <button
             onClick={this.getWatchList}
             userwatchlist = {this.state.myWatchList}
             >My Watchlist</button>
             
             <button
             onClick={this.getFavList}
             userfavlist = {this.state.myFavList}
             >My Favorites</button>
             </div>
             )
     }else{
         return false;
     }
     
     
     }
     
    
   
}


//////////////////////


export default class Movies extends Component {
 
 constructor(props) {
  super(props);

  
 this.state = {
    hasErrors: false,
    successMessage: '',
    latestMovies: {},
    movies: {},
    query: '',
    movieHeading: '',
    showModal: false,
    accessGranted: false,
    authToken: '',
    authenticated: false,
    userToken : '',
    session_id: '',
    loggedIn: false,
    action: '',

   
    
  };
}

  

  componentDidMount() {
      
      Modal.setAppElement('#auth-modal');
      

   
    fetch("https://api.themoviedb.org/3/movie/latest?api_key="+ API_KEY)
      .then(res => res.json())
      .then(res => this.setState({ latestMovies: res }))
      .catch(() => this.setState({ hasErrors: true }));
  }
  
  
    onInputChange = (event) =>{
     
     
     this.setState({
      
       query: event.target.value
     })
     
   //  console.log(event.target.value);
     
   
        }
  
  
  
  onSubmit =  (event) => {
   
   const queryString = this.state.query;

   
   event.preventDefault();
   
   fetch("https://api.themoviedb.org/3/search/movie?api_key="+ API_KEY +"&query="+queryString)
      .then(res => res.json())
      .then(res => this.setState({ 
          
          movies: res.results ,
          action: "searchmovies",
         movieHeading: "Search Results"
          
      }))
      .catch(() => this.setState({ hasErrors: true }));
      

  }


// ////////////////////////////////////////////////////////////////////////  request  auth token

  requestFavToken = (event) => {
      
     event.stopPropagation(); 

    event.preventDefault();
    
    const mov_id = event.target.value;
    
    // console.log(this.state.loggedIn);
    // console.log(this.state.session_id);
    
    ////////////////get token if not logged in
    
    
    if(!this.state.loggedIn){
     
      axios.get("https://api.themoviedb.org/3/authentication/token/new?api_key="+ API_KEY)
           .then( (response) => {
               
               
             this.setState({
                 authToken: response.data.request_token,
                 showModal: true
                 
             });
              
           
          }).catch( (error) => {
              
              this.setState({ hasErrors: true });
            // handle error
            console.log(error);
          });
            
          
      }else{
          
          
          ///////////////add movie to fav list
          
          this.addToFavourite(mov_id);
          
          
      }
      
  }
     ////////////////////////////////////////////////////////////
     
     
     
  requestWatchToken = (event) => {
      
   
       event.preventDefault();
       event.stopPropagation(); 
       
       const mov_id = event.target.value;
       
    //   console.log(this.state.loggedIn);
    //   console.log(this.state.session_id);
       
    if(!this.state.loggedIn){
        
      axios.get("https://api.themoviedb.org/3/authentication/token/new?api_key="+ API_KEY)
           .then( (response) => {
               
               
             this.setState({
                 authToken: response.data.request_token,
                 showModal: true
                 
                 
             });
            
              
           
          }).catch( (error) => {
              
              this.setState({ hasErrors: true });
            // handle error
            console.log(error);
          });
          
          
      }else{
          
          
          ///////////////add movie to watchlist
          this.addToWatchlist(mov_id);
          
          
      }
     
  }

      
//////////////////////////////////////////////




addToFavourite = (mov_id) =>{
    
       const SESSION_ID = this.state.session_id;
    
        axios({
              method: 'post',
              url: "https://api.themoviedb.org/3/account/{account_id}/favorite?api_key="+ API_KEY+"&session_id="+ SESSION_ID,
              headers: {}, 
              data: {
                  
                  media_type: "movie",
                  media_id: mov_id,
                  favorite: true
             
              }
              
            }).then( (response) => {
                
               this.setState({
                   successMessage: "New movie added to favorites"
               })
                
              
            
          })
          .catch( (error) => {
            console.log(error);
          }).then(() => {
              
              console.log("done");
              
          });


}


///////////////////////////////////////////////////////////////

addToWatchlist = (mov_id) =>{
    
    const SESSION_ID = this.state.session_id;
    
      axios({
              method: 'post',
              url: "https://api.themoviedb.org/3/account/{account_id}/watchlist?api_key="+ API_KEY+"&session_id="+ SESSION_ID,
              headers: {}, 
              data: {
                  
                  media_type: "movie",
                  media_id: mov_id,
                  watchlist: true
             
              }
              
            }).then( (response) => {
                
                this.setState({
                   successMessage: "New movie added to watchlist"
               })
                
              
            
          })
          .catch( (error) => {
            console.log(error);
          }).then(() => {
              
              console.log("done");
              
          })
    
}
// ///////////////////////////////////////////

watchcallbackFunction = (childData) => {
    
      this.setState({
          movies: childData,
          action: "getwatchmovies",
          movieHeading: "Watchlist",

          
          
      })
      
      
}

favcallbackFunction = (childData) => {
    
      this.setState({
          movies: childData,
          action: "getfavmovies",
          movieHeading: "Favorites"
          
      });
     
}
//////////////////////////////////////////////////
// authorize  

grantAccess =  () => {
    const URL = document.URL;
    window.location = "https://www.themoviedb.org/authenticate/"+ this.state.authToken+ "?redirect_to="+URL;
   
    
}

// render method

  render() {

     const moviesList = [];
     const currentLocation = window.location.search;
     const loggedIn = this.state.loggedIn-''
     const movies = this.state.movies;
     
 
     
     //console.log(this.state.userfavmovies);
     //console.log(this.state.userwatchmovies);
     

     
     if (!loggedIn && currentLocation.indexOf('approved=true') > -1 ) {
         
         const captured = /request_token=([^&]+)/.exec(currentLocation)[1]; 
         const  result = captured ? captured : '';
         
          if(result !== ''){
         
             axios({
              method: 'post',
              url: "https://api.themoviedb.org/3/authentication/session/new?api_key="+ API_KEY,
              headers: {}, 
              data: {
                request_token: result, // This is the body part
              }
            }).then( (response) => {
                
                this.setState({
                    
                    loggedIn: true,
                    session_id: response.data.session_id
                });
  
  
            
          })
          .catch( (error) => {
            console.log(error);
          });

         
     }
    
     }
    
     
     for(var i = 0; i < movies.length; i++) {
     var obj = movies[i];
    
       moviesList.push(obj);
    }

       //console.log(moviesList);
       
    return <div>
    
    <header>
      <nav>
      
      </nav>
    </header>
    
    <main>
    
       <section className = "search">
       
       <Container>
       <Grid container alignitems = "center">
       
   
         <Grid item xs = {12} md = {6}>
         
           <form onSubmit={this.onSubmit }>
            <TextField
           
           onChange = {this.onInputChange}
           id="movie-search"
           label="Find a movie"
           type="search"
           className="movie-search"
           margin="normal"
           required 
           value = {this.state.query}
            />
           </form>
         </Grid>
         
         <Grid item  xs = {4} md = {3}>
         
            <h3>Movizozo</h3>
           
         </Grid>
         
         <Grid item xs = {8} md = {3}>
        
           <Tabs
           
            getfavmovies = {this.favcallbackFunction}
            getwatchmovies = {this.watchcallbackFunction}
           session_id = {this.state.session_id}
           logged = {this.state.loggedIn}/>
          
         </Grid>
        </Grid>
        
        
        <section className = "modal">
        
        
        
        <Container>
        
          <Grid container>
          
            <Grid item xs = {12} id = "auth-modal" >
            
                 <Modal
                  isOpen={this.state.showModal}
                  contentLabel="Minimal Modal Example"
                  style={customStyles}
                  onRequestClose={this.handleCloseModal}
                  
                >
              <h3>Access required to add movies to favourites and watchlist.</h3>
              <p>You will be redirected to MovieDb website</p>
                <Button 
           onClick={this.grantAccess}
           variant="outlined"   id = "signup-btn">
           
              Grant Access
              </Button>
              
              
              </Modal>
            </Grid>
            
       
          
          </Grid>
        
        </Container>
        
        
          
        </section>
        
        
        
        <Grid container>
        
          <Grid item  sm = {12}>
            
           <h3> {this.state.movieHeading}</h3> 
           
          </Grid>
        
          <Grid item sm = {12}>
            
             {moviesList.map( (movie, i) => {
                 //console.log(movie)
                 
              const imgSrc = "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;   
              
              return (
              <div key={i}>
              
              <Grid container className = "center-v-align">
              
                 <Grid item xs = {6}>
                 
                 <h4>{movie.original_title}</h4>
                
                </Grid>
                
                <Grid container item xs = {12} md = {6}>
                 
                 <Grid item xs = {6}>
                   
                   <button 
                    value={movie.id} 
                  onClick={this.requestFavToken}
                  variant="outlined"  id = "signup-btn">
           
              Add to Favourite
              </button>
                 </Grid>
                 
                 <Grid item xs = {6}>
                 
                 <button 
                    value={movie.id} 
                    onClick={this.requestWatchToken}
                   variant="outlined"  id = "signup-btn">
                   
                   Add to Watchlist
                  </button>
                 </Grid>
                
                </Grid>
                
               </Grid>
                
                
            <Grid item sm = {12} md = {4}>
            
              <img alt = "" src = {imgSrc} />
              
            </Grid>
            
            
            <p>{movie.overview}</p>
            <Grid container>
            
            <Grid item md = {6}>
              <p> Released Date: {movie.release_date} </p>
            </Grid>
            
            <Grid item md = {6}>
              <p>Votes: {movie.vote_count} </p>
            </Grid>
            
            </Grid>
           
            
         </div>
              );
                 
             })}
           
          </Grid>
          
            
          
        </Grid> 
       
         
       </Container>
         
         
       </section>
    
       <section className = "latest-movies">
         <Container>
         <h3> Latest Movies</h3>
         <div>
           <Grid container>
           
             <Grid item xs = {6}>
               <h4>{this.state.latestMovies.original_title}</h4>
             </Grid>
             
             <Grid container item xs = {12} md = {6}>
             
               <Grid item xs = {6}>
               
                <button 
                value={this.state.latestMovies.id} 
             onClick={this.requestFavToken}
             
           variant="outlined"  id = "signup-btn">
           
              Add to Favourite
              </button>
             
               </Grid>
             
               <Grid item xs = {6}>
               
               
                 <button
                 value={this.state.latestMovies.id} 
                     onClick={this.requestWatchToken}
                   variant="outlined"  id = "signup-btn">
                   
                   Add to Watchlist
                  </button>
                  
               </Grid>
             
             </Grid>
             
          </Grid>
          {/*
            <Grid item xs = {12} md = {4}>
            
              <img alt = "" src={`https://image.tmdb.org/t/p/w500/${this.state.latestMovies.backdrop_path}`}   />
              
            </Grid>
            */}
            <p>{this.state.latestMovies.overview}</p>
            <Grid container>
            
            <Grid item md = {6}>
              <p> Released Date: {this.state.latestMovies.release_date} </p>
            </Grid>
            
            <Grid item md = {6}>
              <p>Votes: {this.state.latestMovies.vote_count} </p>
            </Grid>
            
            </Grid>
           
            
         </div>
         
         </Container>
       </section>
       
    </main>
    
    <footer>
    
    <Container>
      &copy; 2019 | Movizozo
     </Container>
    </footer>

    
    </div>;
  }
}
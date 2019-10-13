
import React, { Component } from "react";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';


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



export default class Movies extends Component {
 
 
  state = {
    hasErrors: false,
    latestMovies: {},
    searchResults: {},
    query: '',
    movieHeading: '',
    showModal: false
    
  };
  

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
      .then(res => this.setState({ searchResults: res.results }))
      .catch(() => this.setState({ hasErrors: true }));
      
      if(this.state.hasErrors) {
          
          this.setState({
               
           movieHeading : "Something gone wrong, sorry its our fault."
              
              
          })
          
          
          
      }else{
          
      if(this.state.searchResults.results){
          
           this.setState({
               
            movieHeading : "No movies meeting your criteria found."
              
              
          })
          
          
      }else {
          
           this.setState({
              
              movieHeading : "Search Results."
             
          })
          
          
          
      }
   
   
      }
  }


 handleOpenModal =  () => {
     
    this.setState({ showModal: true });
  }
  
  handleCloseModal = () => {
    this.setState({ showModal: false });
  }
  
  
  render() {
      
     const movies = this.state.searchResults;
     const moviesList = [];
     
     
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
            onClick={this.handleOpenModal}
           variant="outlined"  href="#contained-buttons" id = "signup-btn">
           
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
                   
                   <Button 
            onClick={this.handleOpenModal}
           variant="outlined"  href="#contained-buttons" id = "signup-btn">
           
              Add to Favourite
              </Button>
                 </Grid>
                 
                 <Grid item xs = {6}>
                 
                 <Button 
                    onClick={this.handleOpenModal}
                   variant="outlined"  href="#contained-buttons" id = "signup-btn">
                   
                   Add to Watchlist
                  </Button>
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
              )
                 
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
               
                <Button 
            onClick={this.handleOpenModal}
           variant="outlined"  href="#contained-buttons" id = "signup-btn">
           
              Add to Favourite
              </Button>
             
               </Grid>
             
               <Grid item xs = {6}>
               
               
                 <Button 
                    onClick={this.handleOpenModal}
                   variant="outlined"  href="#contained-buttons" id = "signup-btn">
                   
                   Add to Watchlist
                  </Button>
                  
               </Grid>
             
             </Grid>
             
          </Grid>
          
            <Grid item xs = {12} md = {4}>
            
              <img alt = "" src={`https://image.tmdb.org/t/p/w500/${this.state.latestMovies.backdrop_path}`}   />
              
            </Grid>
            
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

import React, { Component } from "react";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import TextField from '@material-ui/core/TextField';

const API_KEY = "eb2baf82f4897034f5e27180289f6624";

export default class Movies extends Component {
 
 
  state = {
    hasErrors: false,
    latestMovies: {},
    searchResults: {},
    query: ''
    
  };
  

  
  componentDidMount() {
   
    fetch("https://api.themoviedb.org/3/movie/latest?api_key="+ API_KEY)
      .then(res => res.json())
      .then(res => this.setState({ latestMovies: res }))
      .catch(() => this.setState({ hasErrors: true }));
  }
  
  
    onInputChange = (event) =>{
     
     
     this.setState({
      
       query: event.target.value
     })
     
     console.log(event.target.value);
     
   
        }
  
  
  
  onSubmit =  (event) => {
   
   const queryString = this.state.query;
   
   event.preventDefault();
   
   fetch("https://api.themoviedb.org/3/search/movie?api_key="+ API_KEY +"&query="+queryString)
      .then(res => res.json())
      .then(res => this.setState({ searchResults: res }))
      .catch(() => this.setState({ hasErrors: true }));
   
   
  }

  render() {
    return <div>
    
    <header>
      <nav>
      
      </nav>
    </header>
    
    <main>
    
       <section className = "search">
       
       <Container>
       <Grid container>
       
   
         <Grid item md = {6}>
         
           <form onSubmit={this.onSubmit }>
            <TextField
           
           onChange = {this.onInputChange}
           id="movie-search"
           label="Find a movie"
           type="search"
           className="movie-search"
           margin="normal"
           value = {this.state.query}
            />
           </form>
         </Grid>
         
         <Grid item md = {6}>
         
           
          <h3>Movizozo</h3>
           
         </Grid>
        </Grid>
       
         
       </Container>
         
         
       </section>
    
       <section className = "latest-movies">
         <Container>
         <h3> Latest Movies</h3>
         <div>
            <h4>{this.state.latestMovies.original_title}</h4>
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
    
    
    
    {JSON.stringify(this.state.searchResults)}
    
    </div>;
  }
}
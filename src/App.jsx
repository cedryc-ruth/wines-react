import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [wines, setWines] = useState([])
  const [loadingError, setLoadingError] = useState(null)
  const [keyword, setKeyword] = useState('')
  const API_URL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/';

  useEffect(() => {
    fetch(API_URL+'api/wines')
    .then(res => {
      if(!res.ok) {
        throw new Error('Invalid endpoint !');
      }

      return res.json()
    })
    .then(data => {
      console.log(data)
      setWines(data);

      //Sauvegarde de la liste des vins
      localStorage.setItem('wines',JSON.stringify(data))
    })
    .catch(error => {
      //console.log(error.message)
      setLoadingError(error.message)
      setWines([]);
    })
  },[]) 

  function handleSubmit(e) {
    e.preventDefault()
  }

  function handleChange(e) {
    setKeyword(e.target.value)
  }

  function handleClick(e) {
    //Récupérer la liste copmplète des vins
    const listWines = JSON.parse(localStorage.getItem('wines'))

    //Filtrer la liste au moyen du keyword
    const filteredWines = listWines.filter(wine => wine.name.includes(keyword))

    //Mettre à jour la variable de rendu wines
    setWines(filteredWines)
  }

  function handleLike(e) {
    const wineId = e.target.value
    const options = {
        'method': 'PUT',
        'body': JSON.stringify({ "like" : true }),	//Try with true or false
        'mode': 'cors',
        'headers': {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': 'Basic '+btoa('ced:123')	//Try with other credentials (login:password)
        }
    };
    
    const fetchURL = 'api/wines/'+wineId+'/like';
    
    fetch(API_URL + fetchURL, options).then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                console.log(data);
            });
        }
    });
  }

  return (
    <>
      { loadingError && <p>{ loadingError }</p> }
      <form onSubmit={ handleSubmit }>
        <input type="search" name="keyword" value={keyword} onChange={ handleChange } />
        <button onClick={ handleClick }>Rechercher</button>
      </form>
      <ul>
      { wines.map(wine => <>
        <li className='wine' key={wine.id}>{wine.name} <button value={wine.id} onClick={ handleLike }>Liker</button></li>
      </>) }  
      </ul>
    </>
  )
}

export default App

import { useState, useEffect, useRef, useReducer } from 'react'; 

 

const initialState = { 

 data: [], 

 isLoading: false, 

 isError: false, 

 searchTerm: 'react', 

}; 

 

function storiesReducer(state, action) { 

 switch (action.type) { 

   case 'FETCH_INIT': 

     return { ...state, isLoading: true, isError: false }; 

   case 'FETCH_SUCCESS': 

     return { ...state, isLoading: false, data: action.payload }; 

   case 'FETCH_FAILURE': 

     return { ...state, isLoading: false, isError: true }; 

   case 'REMOVE_ITEM': 

     return { ...state, data: state.data.filter(item => item.objectID !== action.payload) }; 

   case 'SET_SEARCH_TERM': 

     return { ...state, searchTerm: action.payload }; 

   default: 

     throw new Error(); 

 } 

} 

 

function App() { 

 const inputRef = useRef(); 

 const [state, dispatch] = useReducer(storiesReducer, initialState); 

 const [url, setUrl] = useState(
  'https://hn.algolia.com/api/v1/search?query=react'
);

useEffect(() => {
  dispatch({ type: 'FETCH_INIT' });

  fetch(url)
 .then((response) => response.json())
 .then((result) => {
  dispatch({
    type: 'FETCH_SUCCESS',
    payload: result.hits,
});
})
 .catch(() => {
  dispatch({ type: 'FETCH_FAILURE' });
});
}, [url]);


 return ( 

   <div> 

     <h1>My Articles</h1> 

    <form
      onSubmit={(event) => {
      event.preventDefault();
      setUrl(
      `https://hn.algolia.com/api/v1/search?query=${state.searchTerm}`
    );
  }}
>
  <input
    ref={inputRef}
    type="text"
    value={state.searchTerm}
    onChange={(event) =>
    dispatch({
    type: 'SET_SEARCH_TERM',
    payload: event.target.value,
})
}
  />

  <button type="submit">Search</button>

  <button
    type="button"
    onClick={() => inputRef.current.focus()}
  >
    Focus Search
  </button>
  </form>


{state.isError && <p>Something went wrong.</p>}

{state.isLoading ? (
  <p>Loading...</p>
) : (
<ul>
  {state.data.map((item) => (
    <li key={item.objectID}>
      {item.title || 'No title'}

<button
    onClick={() =>
      dispatch({
        type: 'REMOVE_ITEM',
        payload: item.objectID,
})
}
>
    Dismiss
  </button>
  </li>
))}
  </ul>
)}

   </div> 
); 
} 

export default App;
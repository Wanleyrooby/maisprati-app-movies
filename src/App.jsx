import { useState, useEffect } from 'react';

const  API_KEY = "sua chave omdb";

function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);

  return (
    <>
      
    </>
  )
}

export default App

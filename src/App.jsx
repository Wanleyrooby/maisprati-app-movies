import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = "sua API_KEY"; // Cadastre-se em http://www.omdbapi.com/apikey.aspx

// Componente principal
export default function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // Salvar favoritos
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Buscar filmes
  const searchMovies = async (query, pg = 1) => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${pg}`);
      const data = await res.json();
      if (data.Response === "True") {
        setResults(data.Search);
        setTotalPages(Math.ceil(data.totalResults / 10));
        setPage(pg);
      } else {
        setError(data.Error);
        setResults([]);
      }
    } catch (e) {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  // Detalhes do filme
  const fetchDetails = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
      const data = await res.json();
      if (data.Response === "True") setSelectedMovie(data);
      else setError(data.Error);
    } catch (e) {
      setError("Erro ao carregar detalhes.");
    } finally {
      setLoading(false);
    }
  };

  // Favoritos
  const toggleFavorite = (movie) => {
    if (favorites.some(f => f.imdbID === movie.imdbID)) {
      setFavorites(favorites.filter(f => f.imdbID !== movie.imdbID));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎬 Movie Finder</h1>

      {/* Campo de busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Digite o nome do filme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-2/3 rounded"
        />
        <button onClick={() => searchMovies(search, 1)} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Buscar
        </button>
      </div>

      {/* Loading e erros */}
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Resultados */}
      {!selectedMovie && results.length > 0 && (
        <div>
          <ul className="grid grid-cols-2 gap-4">
            {results.map(movie => (
              <li key={movie.imdbID} className="border p-2 rounded shadow">
                <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover" />
                <h2 className="font-bold">{movie.Title} ({movie.Year})</h2>
                <button onClick={() => fetchDetails(movie.imdbID)} className="text-blue-600 underline">Ver detalhes</button>
                <button onClick={() => toggleFavorite(movie)} className="ml-2 text-green-600 underline">
                  {favorites.some(f => f.imdbID === movie.imdbID) ? "Remover" : "Favoritar"}
                </button>
              </li>
            ))}
          </ul>

          {/* Paginação */}
          <div className="mt-4 flex gap-2">
            <button disabled={page === 1} onClick={() => searchMovies(search, page - 1)} className="px-2 py-1 border rounded">
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => searchMovies(search, page + 1)} className="px-2 py-1 border rounded">
              Próxima
            </button>
          </div>
        </div>
      )}

      {/* Página de detalhes */}
      {selectedMovie && (
        <div className="mt-4">
          <button onClick={() => setSelectedMovie(null)} className="mb-2 text-blue-600 underline">⬅ Voltar</button>
          <h2 className="text-xl font-bold">{selectedMovie.Title} ({selectedMovie.Year})</h2>
          <img src={selectedMovie.Poster} alt={selectedMovie.Title} className="w-64" />
          <p><b>Diretor:</b> {selectedMovie.Director}</p>
          <p><b>Elenco:</b> {selectedMovie.Actors}</p>
          <p><b>Gênero:</b> {selectedMovie.Genre}</p>
          <p><b>Sinopse:</b> {selectedMovie.Plot}</p>
          <p><b>Avaliação:</b> {selectedMovie.imdbRating}</p>
        </div>
      )}

      {/* Lista de Favoritos */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">⭐ Favoritos</h2>
        {favorites.length === 0 && <p>Nenhum favorito adicionado.</p>}
        <ul className="grid grid-cols-3 gap-2">
          {favorites.map(movie => (
            <li key={movie.imdbID} className="text-sm">
              <img src={movie.Poster} alt={movie.Title} className="w-full h-40 object-cover" />
              <p>{movie.Title}</p>
              <button onClick={() => toggleFavorite(movie)} className="text-red-500 text-xs">Remover</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

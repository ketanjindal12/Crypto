import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('market_cap'); // Default sort key
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order

  useEffect(() => {
    // Choose one of the fetching methods here:
    fetchDataAsync(); // Use async/await
    // fetchDataThen(); // Use .then
  }, []);

  const fetchDataAsync = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
      const data = await response.json();
      setCoins(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm)
  );

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    if (sortKey === 'percentage_change') {
      return sortOrder === 'asc' ? a.price_change_percentage_24h - b.price_change_percentage_24h : b.price_change_percentage_24h - a.price_change_percentage_24h;
    }
    return sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
  });

  return (
    <div className="App">
      <h1>Crypto Table</h1>
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
        value={searchTerm}
      />
      <button onClick={() => handleSort('market_cap')}>Sort by Market Cap</button>
      <button onClick={() => handleSort('percentage_change')}>Sort by % Change</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>Market Cap</th>
            <th>Volume</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {sortedCoins.map(coin => (
            <tr key={coin.id}>
              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
              <td>${coin.current_price.toFixed(2)}</td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td>${coin.total_volume.toLocaleString()}</td>
              <td><img src={coin.image} alt={coin.name} style={{ width: '50px' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;

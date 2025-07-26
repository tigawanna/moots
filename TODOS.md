- refactor the watchlist components to reflect the new watchlisr structure
- refactor the dicover cards to make them more standalone
- -build the user's profilepage to include thier prefrences and watchlist
- add settings to allow user topick what watchlist their quickadd movies should put their movies into
- pnn load load theuser's watched movies and watchlist and use it to highlight the movies i  ontherwatchlist or dicover page that the usr has already watched
- when creating a new watchlist item 2 things shouldhappen
  - the tmdb payload should be added into the watchlist_item collection
  - the watchlist_item should be added to the user's watchlist by appending it as a multiple collection like so #fetch https://pocketbase.io/docs/working-with-relations/


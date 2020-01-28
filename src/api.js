export function suspensify(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    response => {
      status = "success";
      result = response;
    },
    error => {
      status = "error";
      result = error;
    }
  );

  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw Error;
      if (status === "success") return result;
    }
  };
}

export const fetchPokemon = id =>
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json());

export const fetchPokemonCollection = () =>
  fetch(`https://pokeapi.co/api/v2/pokemon/`)
    .then(res => res.json())
    .then(res => ({
      ...res,
      results: res.results.map(pokemon => ({
        ...pokemon,
        id: pokemon.url.split("/")[6]
      }))
    }));

export const fetchPokemonCollectionUrl = url =>
  fetch(url)
    .then(res => res.json())
    .then(res => ({
      ...res,
      results: res.results.map(pokemon => ({
        ...pokemon,
        id: pokemon.url.split("/")[6]
      }))
    }));

import sleep from "sleep-promise";

export function fetchPokemon(id = "") {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(sleep(Math.random() * 2500));
}

function hashParams(params = {}) {
  let usps = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => usps.append(k, v));

  return `${usps.toString()}`;
}

export function fetchPokemonCollection(params) {
  console.log(hashParams(params));
  return fetch(`https://pokeapi.co/api/v2/pokemon?${hashParams(params)}`)
    .then(res => res.json())
    .then(sleep(Math.random() * 2500));
}

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
      if (status === "pending") {
        throw suspender;
      }
      if (status === "error") {
        throw result;
      }
      if (status === "success") {
        return result;
      }
    }
  };
}
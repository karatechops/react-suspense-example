import React from "react";
import ErrorBoundary from "./error-boundary";
import {
  suspensify,
  fetchPokemonCollection,
  fetchPokemonCollectionUrl,
  fetchPokemon
} from "./api";
import { List } from "./ui";
import { PokemonContext } from "./pokemon";

const PokemonDetail = React.lazy(() => import("./pokemon-detail"));
const initialPokemon = suspensify(fetchPokemon(1));
const initialCollection = suspensify(fetchPokemonCollection());

export default function App() {
  const [pokemonResource, setPokemonResource] = React.useState(initialPokemon);
  const [collectionResource, setCollectionResource] = React.useState(
    initialCollection
  );
  const [startTransition, isPending] = React.useTransition({ timeoutMs: 3000 });
  const deferredPokemonResource = React.useDeferredValue(pokemonResource, {
    timeoutMs: 3000
  });
  const pokemonIsPending = deferredPokemonResource !== pokemonResource;
  const pokemonState = {
    pokemon: deferredPokemonResource,
    isStale: pokemonIsPending,
    setPokemon: id =>
      startTransition(() => setPokemonResource(suspensify(fetchPokemon(id))))
  };

  return (
    <div>
      <h1>Pokedex</h1>
      <PokemonContext.Provider value={pokemonState}>
        <React.SuspenseList revealOrder="forwards" tail="collapsed">
          <React.Suspense fallback="loading pokemon...">
            <ErrorBoundary fallback="Couldn't catch 'em all">
              <PokemonDetail />
            </ErrorBoundary>
          </React.Suspense>
          <React.Suspense fallback="loading collection...">
            <ErrorBoundary fallback="Couldn't catch 'em all">
              <div>
                <button
                  type="button"
                  disabled={pokemonIsPending}
                  onClick={() =>
                    startTransition(() =>
                      setCollectionResource(
                        suspensify(
                          fetchPokemonCollectionUrl(
                            collectionResource.read().next
                          )
                        )
                      )
                    )
                  }
                >
                  Next
                </button>
              </div>
              <PokemonContext.Consumer>
                {({ setPokemon }) => (
                  <PokemonCollection
                    as="ul"
                    resource={collectionResource}
                    renderItem={pokemon => (
                      <li key={pokemon.name}>
                        <button
                          disabled={isPending}
                          onClick={() => setPokemon(pokemon.id)}
                        >
                          {pokemon.name}
                        </button>
                      </li>
                    )}
                  />
                )}
              </PokemonContext.Consumer>
            </ErrorBoundary>
          </React.Suspense>
        </React.SuspenseList>
      </PokemonContext.Provider>
    </div>
  );
}

const PokemonCollection = ({ resource, ...props }) => (
  <List {...props} items={resource.read().results} />
);

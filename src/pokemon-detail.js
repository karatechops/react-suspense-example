import React from "react";
import { DelaySpinner } from "./ui";
import { PokemonContext } from "./pokemon";

export default function PokemonDetail() {
  let { pokemon: resource, isStale } = React.useContext(PokemonContext);
  const pokemon = resource.read();
  return (
    <div>
      {pokemon.name} {isStale && <DelaySpinner />}
    </div>
  );
}

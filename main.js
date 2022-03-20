const types = [
    "fire",
    "grass",
    "electric",
    "water",
    "ground",
    "rock",
    "fairy",
    "ghost",
    "poison",
    "bug",
    "dragon",
    "psychic",
    "flying",
    "fighting",
    "normal",
    "ice",
    "dark",
    "steel",
];

const pokecount = 493;

const cardHTML = `
    <div class="card" id="card-{id}">
    <button class="favorite" data-id={id}>
    </button>
    <div class="title">
        <h2>{name}</h2>
        <small># {id}</small>
    </div>
    
    <div class="img bg-{type}">
        <img src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/{id}.png" alt="{name}"/>
    </div>
    <div class="type {type}">
        <p>{type}</p>
    </div>
    
    </div>
`
const cards = document.querySelector(".cards");

const getType = (data) => {
    const apiTypes = data.map(type=> type.type.name);
    const type = types.find((type) => apiTypes.indexOf(type) > -1)
    return type;
}

const fetchPokemon = async (number) => {
    if(number === undefined) return;
    const url = `https://pokeapi.co/api/v2/pokemon/${number}`;
    const response = await fetch(url).then((response) => response.json());
    const {id, name, types} = response;
    const type = getType(types);
    return {id, name, type};
};

const replacer = (text, source, destination) => {
    const regex = new RegExp(source, "gi");
    return text.replace(regex, destination);
}

const createPokemonCard = (pokemon) => {
    const {id, name, type} = pokemon;
    let newCard = replacer(cardHTML, `\{id\}`, id.toString().padStart(3, "0"));
    newCard = replacer(newCard, `\{name\}`, name);
    newCard = replacer(newCard, `\{type\}`, type);

    cards.innerHTML+= newCard;
}

const fetchPokemons = async() => {
     for(let i=1; i<=pokecount; i++){
         const pokemon = await fetchPokemon(i);
         createPokemonCard(pokemon);
         initFavorites();
      }
};

const storage = {
    set: (key, value) => {
        localStorage.setItem(key, value);
    },
    get: (key) => {
        return localStorage.getItem(key);
    },
    remove: (key) => {
        localStorage.removeItem(key);
    },
};

const handleFavorite = function (e) {
    e.preventDefault();

    const id = this.dataset.id;
    if (!id) return;

    const key = `favorite-${id}`;
    const isFavorited = storage.get(key);
    if (isFavorited) {
        console.log('Removing', key);
        storage.remove(key);
        this.classList.remove('favorited');
    } else {
        storage.set(key, id);
        console.log('Adding', key);
        this.classList.add('favorited');
    }
};

const initFavorites = () => {
    const favoriteButtons = document.querySelectorAll('.favorite');
    favoriteButtons.forEach((f) => {
        f.addEventListener('click', handleFavorite);

        const id = f.dataset.id;
        if (!id) return;
        const key = `favorite-${id}`;
        const isFavorited = storage.get(key);

        if (isFavorited) {
            f.classList.add('favorited');
        }else {
            f.classList.remove('favorited');
        }
    });
};

fetchPokemons();

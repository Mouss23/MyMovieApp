// clé API de TMDB, qui est utilisée pour authentifier les requêtes à l'API.
const API_KEY = 'api_key=97d74d55ca0f1a55c9a1bf9c88571da8';

// URL de base pour l'API TMDB.
const BASE_URL = 'https://api.themoviedb.org/3/';

// URL de l'API pour récupérer les films triés par popularité décroissante.
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;

// URL de base pour les images de film.
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// URL de l'API pour rechercher des films.
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
];

// Récuperation des éléments HTML
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

let = selectedGenre = [];  // Déclaration de variable pour le stockage des genres de films
setGenre();
function setGenre() {
    tagsEl.innerHTML = '';  // Récupère un élément HTML avec l'ID "tags" et vide son contenu HTML
    genres.forEach(genre => {  // Parcourt la liste de genres de films et crée un élément HTML pour chaque genre
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;  // Texte à afficher dans l'élément div en fonction du nom du genre
        t.addEventListener('click', () => {  // Ecouteur d'événements au clic
            if (selectedGenre.length == 0) {  //  si aucun genre n'a été sélectionné
                selectedGenre.push(genre.id); // ajoute l'ID du genre à la liste des genres sélectionnés
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {  //  Parcourt la liste des genres sélectionnés et recherche le genre sélectionné
                        if (id == genre.id) {
                            selectedGenre.splice(idx, 1) // Supprime le genre sélectionné de la liste des genres sélectionnés
                        }                                // splice() modifie le contenu d'un tableau en retirant des éléments et/ou en ajoutant de nouveaux éléments
                    })
                } else {
                    selectedGenre.push(genre.id);  // Ajoute l'ID du genre sélectionné à la liste des genres sélectionnés
                }
            }
            console.log(selectedGenre);
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(','))); // Appelle une fonction getMovies() pour récupérer les films correspondants à partir de l'API de films, en utilisant les genres sélectionnés comme filtres
            highlightSelection();
        })
        tagsEl.append(t);  // Ajoute l'élément div à l'élément HTML avec l'ID "tags"
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');  // Sélectionne tous les éléments du DOM avec la classe CSS tag et les stocke dans la variable tags
    tags.forEach(tag => {   // Boucle sur chaque élément tag sélectionné
        tag.classList.remove('highlight')  // Supprime la classe CSS highlight de chaque élément tag sélectionné
    })
    if (selectedGenre.length != 0) {  // Vérifie si la longueur de l'array est différente de zéro
        selectedGenre.forEach(id => {  //  Boucle sur chaque élément id dans l'array selectedGenre
            const highlightedTag = document.getElementById(id);  // Sélectionne l'élément du DOM avec l'ID id et le stocke dans la variable highlightedTag
            highlightedTag.classList.add('highlight');  // Ajoute la classe CSS highlight à l'élément sélectionné
        })
    }
}

getMovies(API_URL);
function getMovies(url) {
    // méthode fetch() pour récupérer les données à partir de l'URL fournie (données envoyées sous forme de réponse http)
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        if (data.results.length !== 0) { // <==== Vérifie si les résultats de la requête ne sont pas vides.
            showMovies(data.results)     // Affiche les resultats de la requete
        } else {
            main.innerHTML = '<h1 class="no-results">No results found</h1>'
        }
    })
}

function showMovies(data) {
    main.innerHTML = '';
    data.forEach(movie => {
        const { title, poster_path, vote_average, overview } = movie; // Extrait les propriétés de l'éléments movie
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        // Insère une image de l'affiche du film en utilisant la propriété poster_path de l'élément movie. Si poster_path est nul ou non défini, une image de remplacement sera affichée
        movieEl.innerHTML = `
        <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}"> 
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">

                <h3>Synopsis</h3>
                ${overview}
                </div>      
        `
        main.appendChild(movieEl);
    })
}

function getColor(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {  // Ajoute un événement de soumission au formulaire qui est déclenché lorsque l'utilisateur soumet le formulaire
    e.preventDefault();  // Empêche le comportement par défaut du formulaire, qui est de recharger la page lorsqu'il est soumis

    const searchTerm = search.value;

    if (searchTerm) {                                  // Si une valeur est présente dans searchTerm, 
        getMovies(searchURL + '&query=' + searchTerm)  // appelle la fonction getMovies() avec une URL de recherche contenant la chaîne de recherche encodée dans l'URL
    } else {
        getMovies(API_URL);  // Si aucune valeur n'est présente dans searchTerm, appelle la fonction getMovies() avec l'URL de l'API par défaut pour récupérer tous les films
    }
})
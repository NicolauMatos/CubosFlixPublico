const filmes = document.querySelector('.movies');
const proximo = document.querySelector('.btn-next');
const anterior = document.querySelector('.btn-prev');
const pesquisar = document.querySelector('.input');

const videoFilmeDia = document.querySelector('.highlight__video');
const tituloDia = document.querySelector('.highlight__title');
const avaliacaoDia = document.querySelector('.highlight__rating')
const generosDia = document.querySelector('.highlight__genres');
const lancamentoDia = document.querySelector('.highlight__launch');
const descricaoDia = document.querySelector('.highlight__description');
const linkVideo = document.querySelector('.highlight__video-link');

const modal = document.querySelector('.modal');
const modalTitulo = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescri = document.querySelector('.modal__description');
const modalAvaliacao = document.querySelector('.modal__average');

async function requisitarFilmes(callBack) {
    const listaFilmes = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false')).json();

    return callBack(listaFilmes);
}

let i = 0;
let grupos = [];

requisitarFilmes((listaFilmes) => {
    const primGrupo = listaFilmes.results.slice(0, 6);
    const segGrupo = listaFilmes.results.slice(6, 12);
    const terGrupo = listaFilmes.results.slice(12, 18);
    const quartGrupo = listaFilmes.results.slice(18);

    grupos.push(primGrupo);
    grupos.push(segGrupo);
    grupos.push(terGrupo);
    grupos.push(quartGrupo);


    primGrupo.forEach((filme) => {
        criarElementos(filme);
    });
});

function criarElementos(filme) {

    const divMovie = document.createElement('div');
    const divMovieInfo = document.createElement('div');
    const spanMovieTitle = document.createElement('span');
    const spanMovieRating = document.createElement('span');
    const imageMovie = document.createElement('img');
    const id = document.createElement('p');

    divMovie.classList.add('movie');
    divMovie.style.backgroundImage = `url(${filme.poster_path})`;

    divMovie.addEventListener('click', (event) => {
        const filme = event.target;
        const id = filme.querySelector('p');

        abrirModal(id.textContent);
    })

    divMovieInfo.classList.add('movie__info');

    spanMovieTitle.classList.add('movie__title');
    spanMovieTitle.textContent = filme.title;

    spanMovieRating.classList.add('movie__rating');
    spanMovieRating.textContent = filme.vote_average;

    id.textContent = filme.id;
    id.classList.add('hidden');


    imageMovie.src = './assets/estrela.svg';
    imageMovie.alt = 'Estrela';


    filmes.append(divMovie);
    divMovie.append(divMovieInfo, id);
    divMovieInfo.append(spanMovieTitle, spanMovieRating);
    spanMovieRating.append(imageMovie);


};

proximo.addEventListener('click', () => {
    if (i < grupos.length - 1) {
        i++
    } else {
        i = 0;
    }

    filmes.innerHTML = '';

    grupos[i].forEach((filme) => {
        criarElementos(filme);
    })
});

anterior.addEventListener('click', () => {
    if (i > 0) {
        i--
    } else {
        i = grupos.length - 1;
    };

    filmes.innerHTML = '';
    grupos[i].forEach((filme) => {
        criarElementos(filme);
    })
});

function pesquisarFilme(callBack) {
    pesquisar.addEventListener('keypress', (event) => {
        const filmePesquisado = 'https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false**&query=';
        const inicio = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false';
        let promiseResposta;

        if (event.code === 'Enter') {
            if (pesquisar.value === '') {
                promiseResposta = fetch(inicio);
            } else {
                promiseResposta = fetch(filmePesquisado + pesquisar.value);
            };

            promiseResposta.then((resposta) => {
                const promessaJson = resposta.json();

                promessaJson.then((filme) => {
                    return callBack(filme)
                });
            });
            i = 0;
            pesquisar.value = '';
        };
    });
};

pesquisarFilme((filmesEncontrados) => {
    grupos = [];
    filmes.innerHTML = '';

    let primGrupo;
    let segGrupo;
    let terGrupo;
    let quartGrupo;

    if (filmesEncontrados.results.length <= 6) {
        primGrupo = filmesEncontrados.results.slice(0);

        grupos.push(primGrupo);
    } else if (filmesEncontrados.results.length <= 12) {
        primGrupo = filmesEncontrados.results.slice(0, 6);
        segGrupo = filmesEncontrados.results.slice(6);

        grupos.push(primGrupo);
        grupos.push(segGrupo);
    } else if (filmesEncontrados.results.length <= 18) {
        primGrupo = filmesEncontrados.results.slice(0, 6);
        segGrupo = filmesEncontrados.results.slice(6, 12);
        terGrupo = filmesEncontrados.results.slice(12);

        grupos.push(primGrupo);
        grupos.push(segGrupo);
        grupos.push(terGrupo);
    } else {
        primGrupo = filmesEncontrados.results.slice(0, 6);
        segGrupo = filmesEncontrados.results.slice(6, 12);
        terGrupo = filmesEncontrados.results.slice(12, 18);
        quartGrupo = filmesEncontrados.results.slice(18);

        grupos.push(primGrupo);
        grupos.push(segGrupo);
        grupos.push(terGrupo);
        grupos.push(quartGrupo);
    };

    primGrupo.forEach((filme) => {
        criarElementos(filme);
    });
});

async function requisicaoFilmesDia(callBack) {
    const filmeDia = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR')).json();
    const videoDia = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR')).json();

    return callBack(filmeDia, videoDia);
};

requisicaoFilmesDia((filmeDia, videoDia) => {
    const generos = filmeDia.genres;
    let listaGeneros = generos[0].name;
    const dataLancamento = filmeDia.release_date;
    const dataArray = dataLancamento.split('-');
    const dataFormatada = dataArray[2] + '-' + dataArray[1] + '-' + dataArray[0];

    videoFilmeDia.style.backgroundImage = `url(${filmeDia.backdrop_path})`;

    videoFilmeDia.style.backgroundSize = 'cover';

    tituloDia.textContent = filmeDia.title;

    avaliacaoDia.textContent = filmeDia.vote_average;

    for (i = 1; i < generos.length; i++) {
        listaGeneros += ", " + generos[i].name;
    };

    generosDia.textContent = listaGeneros;

    lancamentoDia.textContent = dataFormatada;

    descricaoDia.textContent = filmeDia.overview;

    linkVideo.href = 'https://www.youtube.com/watch?v=' + videoDia.results[0].key;
});

async function abrirModal(id) {
    modal.classList.remove('hidden');
    const filme = await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`)).json();

    modalTitulo.textContent = filme.title;
    modalImg.src = filme.backdrop_path;
    modalDescri.textContent = filme.overview;
    modalAvaliacao.textContent = filme.vote_average.toFixed(1);
};

modal.addEventListener('click', () => {
    modal.classList.add('hidden');
});
const inputText = document.querySelector('.form-input');
const spinner = document.querySelector('.sk-cube-grid');
const grilla = document.querySelector('.grid');
document.querySelector('.btn-submit').addEventListener('click', buscarCocktails);

async function buscarCocktails(event) {
    event.preventDefault();

    //si el campo esta vacio mostrara mensaje de error
    if (inputText.value === '') {
        mostrarMensaje('campovacio');
        return;
    }

    let ingrediente = inputText.value.toLowerCase();

    //mostrar spinner
    spinner.style.display = "block";

    //borrando resultados anteriores de la grilla
    grilla.innerHTML = '';

    try {
        let respuesta = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingrediente}`);
        let resultado = await respuesta.json();
        mostrarResultados(resultado);
    } catch (error) {
        mostrarMensaje('error');
        spinner.style.display = "none";
    }
    inputText.value = '';
}

function mostrarMensaje(tipo) {
    const label = document.querySelector('.form-label');

    if (tipo === 'campovacio') {
        label.textContent = 'Ingrese un ingrediente';
    } else if (tipo === 'error') {
        label.textContent = 'Sin resultados :(';
    }

    setTimeout(() => {
        label.textContent = 'Enter an ingredient';
    }, 3000);

    inputText.value = '';
}

function mostrarResultados(resultado) {
    const { drinks } = resultado;

    //ocultar spinner
    spinner.style.display = "none";

    //creando cards para mostrarlas en la grilla
    drinks.forEach(drink => {
        const { idDrink, strDrink, strDrinkThumb } = drink;

        const divTrago = document.createElement('div');
        divTrago.classList.add('trago');

        const imgTrago = document.createElement('img');
        imgTrago.classList.add('trago-img');
        imgTrago.setAttribute('src', strDrinkThumb);

        const nombreTrago = document.createElement('h3');
        nombreTrago.classList.add('trago-h3');
        nombreTrago.textContent = strDrink;

        const btnTrago = document.createElement('button');
        btnTrago.classList.add('btn-trago');
        btnTrago.setAttribute('id', idDrink);
        btnTrago.textContent = "Ver";
        btnTrago.addEventListener('click', mostrarInfoTrago);

        divTrago.appendChild(imgTrago);
        divTrago.appendChild(nombreTrago);
        divTrago.appendChild(btnTrago);

        grilla.appendChild(divTrago);
    });
}

async function mostrarInfoTrago(event) {

    //buscando info trago
    let respuestaTrago = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${event.target.id}`);
    let resultadoTrago = await respuestaTrago.json();

    const { drinks } = resultadoTrago;
    const { strDrink, strDrinkThumb, strInstructions,
        strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5,
        strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10 } = drinks[0];
    const ingredientes = [strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5,
        strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10];

    const modal = document.querySelector('.modal');
    modal.addEventListener('click',()=>modal.style.display = "none");

    const tragoImg = document.querySelector('.trago-info-img');
    const tragoNombre = document.querySelector('.trago-info-h3');
    const tragoList = document.querySelector('.trago-ul');
    const tragoInstructions = document.querySelector('.instructions');
    const btnInfoTrago = document.querySelector('.trago-info-btn').addEventListener('click', () => modal.style.display = "none");

    tragoNombre.textContent = strDrink;
    tragoImg.src = strDrinkThumb;
    tragoInstructions.textContent = strInstructions;

    tragoList.innerHTML = '';

    for (let i = 1; i < 10; i++) {

        
        if (ingredientes[i] !== null) {
            const item = document.createElement('li');
            item.textContent = ingredientes[i];
            tragoList.appendChild(item);
        }
    }

    modal.style.display = "block";

}
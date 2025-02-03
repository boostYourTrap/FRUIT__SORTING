const fruitList = document.querySelector('.fruits__list');
const shuffleButton = document.querySelector('.shuffle__btn');
const filterButton = document.querySelector('.filter__btn');
const sortKindLabel = document.querySelector('.sort__kind');
const sortTimeLabel = document.querySelector('.sort__time');
const sortChangeButton = document.querySelector('.sort__change__btn');
const sortActionButton = document.querySelector('.sort__action__btn');
const kindInput = document.querySelector('.kind__input');
const colorInput = document.querySelector('.color__input');
const weightInput = document.querySelector('.weight__input');
const addActionButton = document.querySelector('.add__action__btn');

let fruitsJSON = `[
    {"kind": "Мангустин", "color": "фиолетовый", "weight":13},
    {"kind": "Дуриан", "color": "зеленый", "weight": 35}, 
    {"kind": "Личи", "color": "розово-красный", "weight": 17}, 
    {"kind": "Карамбола", "color": "желтый", "weight": 28}, 
    {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`

let fruits = JSON.parse(fruitsJSON);

const getColor = (colorName) => {
    const colors = {
        "фиолетовый": "purple",
        "зеленый": "green",
        "розово-красный": "rgb(255, 105, 180)",
        "желтый": "yellow",
        "светло-коричневый": "#D2B48C",
        "красный": "red",
        "черный": "black",
    };

    return colors[colorName] || "gray";
};

const display = (fruits) => {
    fruitList.innerHTML = '';

    fruits.forEach((fruit, index) => {
        const fruitItem = document.createElement('li');
        fruitItem.classList.add('fruit__item');

        fruitItem.style.backgroundColor = getColor(fruit.color);

        fruitItem.innerHTML = `
            <div class = "fruit__info">
                <div> index: ${index} </div>
                <div> kind: ${fruit.kind} </div>
                <div> color: ${fruit.color} </div>
                <div> weight (кг): ${fruit.weight} </div>
            </div> 
        `;
        fruitList.appendChild(fruitItem);
    });
}

display(fruits);



const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};


const shuffleFruits = () => {
    const originalOrder = [...fruits];
    let result = [];

    while (fruits.length > 0) {
        const randomIndex = getRandomInt(0, fruits.length - 1);
        const randomFruit = fruits.splice(randomIndex, 1)[0];
        result.push(randomFruit);
    }

    fruits.length = 0;
    fruits.push(...result);

    const isSameOrder = originalOrder.every((fruit, index) => fruit === fruits[index]);
    if (isSameOrder) {
        alert('Порядок не изменился, попробуйте еще раз!');
    }

};


shuffleButton.addEventListener('click', () => {
    shuffleFruits();
    display(fruits);
})


const filterFruits = () => {
    const minWeight = parseFloat(document.querySelector('.minweight__input').value.trim());
    const maxWeight = parseFloat(document.querySelector('.maxweight__input').value.trim());

    if (isNaN(minWeight) || isNaN(maxWeight) || minWeight > maxWeight) {
        alert('Введите корректное значение для фильтрации!');
        return;
    }

    const filteredFruits = fruits.filter(fruit => fruit.weight >= minWeight && fruit.weight <= maxWeight);

    display(filteredFruits);
}


filterButton.addEventListener('click', filterFruits);

const colorPriority = ["Красный", "розово-красный", "оранжевый", "желтый", "зеленый", "светло-коричневый", "фиолетовый"];

const comparationColor = (a, b) => {
    let indexA = colorPriority.indexOf(a.color);
    let indexB = colorPriority.indexOf(b.color);

    if (indexA === -1) indexA = 999;
    if (indexB === -1) indexB = 999;

    return indexA - indexB;
}


const bubbleSort = (arr, comparation) => {
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for(let j = 0; j < n - 1 - i; j++) {
            if(comparation(arr[j], arr[j + 1]) > 0) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
}


const quickSort = (arr, comparation) => {
    if (arr.length <= 1) return arr;

    const pivot = arr[0];
    const less = arr.slice(1).filter(item => comparation(item, pivot) < 0);
    const greater = arr.slice(1).filter(item => comparation(item, pivot) >= 0);

    return [...quickSort(less, comparation), pivot, ...quickSort(greater, comparation)];
}


const sortAndMeasureTime = (arr, comparation) => {
    const start = performance.now();

    if (sortKind === 'bubbleSort') {
        bubbleSort(arr, comparation);
    } else {
        fruits = quickSort(arr, comparation);
    }

    const end = performance.now();
    return `${(end - start).toFixed(2)} ms`;
}


sortActionButton.addEventListener('click', () => {
    sortTimeLabel.textContent = 'Sorting...';

    setTimeout(() => {
        const timeTaken = sortAndMeasureTime(fruits, comparationColor);
        sortTimeLabel.textContent = timeTaken;
        display(fruits);
    }, 1000);
    
})


let sortKind = 'bubbleSort';
sortKindLabel.textContent = sortKind;
sortChangeButton.addEventListener('click', () => {
    sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
    sortKindLabel.textContent = sortKind;
    sortTimeLabel.textContent = '';
})


addActionButton.addEventListener('click', () => {
    const kind = kindInput.value.trim();
    const color = colorInput.value.trim();
    const weight = parseFloat(weightInput.value.trim());

    if (!kind || !color || isNaN(weight) || weight <= 0) {
        alert("❌ Ошибка: Все поля должны быть заполнены, а вес должен быть положительным числом!");
        return;
    }

    const newFruit = {kind, color, weight};

    fruits.push(newFruit);

    kindInput.value = '';
    colorInput.value = '';
    weightInput.value = '';

    display(fruits);
});
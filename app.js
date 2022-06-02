const cards = document.getElementById('cards');//accedo al div donde voy a colocar las tarjetas
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;//accedo al contenido del template de html
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {}//creamos el carrito
document.addEventListener('DOMContentLoaded', (e) => {//El evento DOMContentLoaded se ejecuta cuando 
    //nuestro documento html ha sido totalmente cargado en la página
    fetchData();//a penas cargue el html se ejecutará nuestra función
    if (localStorage.getItem('carrito')) {//pregunto que si existe la clave carrito en el localStorage
        //si existe entonces
        carrito = JSON.parse(localStorage.getItem('carrito'))//le asigno ese valor al carrito, dentro del método JSON.parse le paso el 
        //el nombre de la clave dentro del método localStorage.getItem, todo esto para obtenerlo como objeto
        //JSON.parse onvierte los string en objetos
        pintarCarrito()
    }
})

items.addEventListener('click', e => { btnAumentarDisminuir(e) })

cards.addEventListener('click', e => {
    addCarrito(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        //console.log(data);
        pintarData(data);
    } catch (error) {
        console.log(error);
    }
    
}

//cuando hacemos un recorrido de elementos, nos conviene aplicar el fragment
const pintarData = (data) => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent= producto.title;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)//con el setAttribute 
        //puedo darle el valor a un atrubuto de html, en este caso, le coloco como primer parámetro
        //el nombre del atrubuto, que es src y el valor, que es la url de la imágen
        templateCard.querySelector('.btn-dark').dataset.id=producto.id;//le asignamos el id de cada producto a cada tarjeta
        //es decir, agregamos el atributo data-id que nos sirve para poder vincular el botón de cada tarjeta con
        //su respectivo id
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
}

const addCarrito= (e) => {
    if( e.target.classList.contains('btn-dark')){
       setCarrito(e.target.parentElement)//con parent element, obtenemos todo la tarjeta
    }
    e.stopPropagation();
    e.preventDefault();
}

const setCarrito = objeto => {
  //  console.log(objeto);
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,//con dataset.id accedo al valor del data-id de la tarjeta
        title: objeto.querySelector('h5').textContent,//con textContent, podemos obtener el valor de la etiqueta
        precio: objeto.querySelector('p').textContent,
        cantidad: 1//la cantidad por defecto es uno
        //es decir, la primera vez que den click en comprar cierto producto la cantidad será 1
        //luego pasará por if, y como hasta ese momento el objeto carrito va a estar vacío
        //el if dará false y será ignorado, luego de eso, le asignamos al objeto carrito 
        //en su clave el valor del id del producto, seguidamente le asignamos el valor de el objeto producto
        //al objeto carrito en su clave id
        //La segunda vez que den click, le asignamos los valores de la tarjeta al objeto producto
        //luego, pasará por el if, y si dio click en el mismo botón de comprar producto
        //significa que en el objeto carrito ya existe ese producto, por lo tanto, el if será true, y en 
        //ese momento alteraremos la propiedad id del objeto producto, sumandole uno a la cantidad existente
        //en ese momento, como es el segundo click, el resultado de cantidad será 2
        //luego saldrá del if y alteramos el valor de la clave producto.id, que básicamente
        //es el producto que tenemos en el objeto carrito, y le asignamos el valor a esa clave del objeto producto
        //eso sognificaría que ese producto se la ha aumentado solamente la cantidad y así sucesivamente
        //con cada producto
    }
    //este if se preguntará cada vez que den click en el botón comprar
    if(carrito.hasOwnProperty(producto.id)){//product.id es el valor del id, con hasOwnProperty pregunto que
        //si está el valor del id dentro del objeto carrito
        //si está, entonces le aumento la cantidad en 1
        //de lo contrario no tendrá en cuenta este if
        producto.cantidad = carrito[producto.id].cantidad +1
    }
    //si no tuvo en cuenta el if, significa que creamos o asignamos el valor del id
    //carrito tendrá como key o clave el valor del id y se le asignará el objeto de producto
    //que es el que contiene toda la información
    carrito[producto.id] = { ...producto }//con los 3 puntos le digo que haga una copia de el objeto producto, tambien llamado SPREAD operator, en esta línea de código estamos asignanadole como valor a la clave que es el id del producto el objeto producto
    //console.log(carrito);
    pintarCarrito();//pintamos en el carrito que se agregó un producto
}
//como el carrito siempre va a tener un sólo objeto de varias compras del mismo producto, entonces por eso 
//cuando lo pintamos el cambio va a estar en la cantidad y el precio
const pintarCarrito = () => {
       // console.log(carrito);
        items.innerHTML=''//le digo que parta vacío items, para que no se repitan los datos que ya haya agregado en 
        //una compra anterior
        // con Object.values(carrito) transformamos el objeto carrito en un array, para así poder recorrerlo con
        // el forEach
        Object.values(carrito).forEach(producto => {
            templateCarrito.querySelector('th').textContent = producto.id;//desde el template-carrito, accedemos al th y le asignamos el valor de el id del producto
            templateCarrito.querySelectorAll('td')[0].textContent = producto.title//desde el template-carrito, accedemos el primer td, como le colocamos querySelectorAll sería un array, y accedemos al primer elemento colocandole [0]
            templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
            templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad //le asignamos
            //al span que va a tener el precio, el precio correspondiente

            //botones
            templateCarrito.querySelector('.btn-info').dataset.id = producto.id//le asignamos a los botones el id
            templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
            const clone = templateCarrito.cloneNode(true)//clonamos el template de carrito
            fragment.appendChild(clone)//le pasamos el clon a el fragment
        })
        items.appendChild(fragment)//le pasamos el fragment a los items del carrito

        pintarFooter();//pintamos el footer del carrito

        localStorage.setItem('carrito', JSON.stringify(carrito))//guardo en el localStorage el objeto carrito
        //como primer parámetro le paso el nombre de la clave o key en comillas simples
        //como segundo parámetro le paso el objeto, pero tengo que pasarlo dentro del método
        //JSON.stringify para que lo pase el string en forma legible 
        //como esto se va a repetir varias veces, la primera vez, se creará la clave carrito en el localStorage
        //después simplemente se modifica el valor de carrito, pues busca la clave, y le asigna de nuevo el
        //valor que tengo el objeto carrito, en ese instante, es decir, le va agregando todo lo que va comprando
    }

const pintarFooter = () => {
    footer.innerHTML = ''//coloco el footer vacío para que no se repita información
    
    if (Object.keys(carrito).length === 0) {//le pregunto que si el objeto carrito está vacío
        //si está vacío, le coloco un mensaje que diga, que el carrito está vacío
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return//con el return hacemos que se salga de la función íntar carrito, pues si entró en el if
        //ya no tiene que seguir dentro de la función pintar
    }
    //si no está vacío que siga con el código
    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)//esta función lo que hace es sumar el array
    //en el caso de la cantidad, convertimos el objeto carrito en un array, luego con ell método reduce sumamos el array
    //le pasamos como parámetro un función flecha, le pasamos como primer parámetro el valor anterios, y como segundo parámetro, el valor actual, luego le digo que
    //sume el valor anterior, con el valor actual y por último le pasamos el número inicial, que es cero, si lo queremos devolver en objeto le ponemos llaves, y si en array en corchetes y así sucesivamente, por cierto
    //el segundo parámetro lo paso en objeto, porque está en un objeto ese valor
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)//aquí sumo las cantidades y a parte las multiplico con el precio para dar el valor final, es decir, el primer precio, lo multiplico con 
    //la primera cantidad, y lo voy acumulando y así dará el resultado final
    // console.log(nPrecio)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad//le asigno el valor de cantidad a la etiqueta donde se va a ver reflejada la cantidad total de productos comprados
    templateFooter.querySelector('span').textContent = nPrecio//le asigno el valor de precio total a pagar a la etiqueta correspondiente

    const clone = templateFooter.cloneNode(true)//creo un clon del template
    fragment.appendChild(clone)//le paso el clon al fragment

    footer.appendChild(fragment)//le paso el fragment al footer

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}

const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    if (e.target.classList.contains('btn-info')) {//pregunto que si donde di click tiene la clase btn-info
        const producto = carrito[e.target.dataset.id]//con el id, le asigno las propiedades de ese producto a la constante producto
        producto.cantidad++//le sumo uno a la cantidad cada que le de click en el botón de aumentar
        carrito[e.target.dataset.id] = { ...producto }//le asigno el objeto producto que está actualizado a el objeto carrito
        pintarCarrito()//pinto el carrito
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]//con el id, le asigno las propiedades de ese producto a la constante producto
        producto.cantidad--//le resto uno a la cantidad cada que le de click en el botón de disminuir
        if (producto.cantidad === 0) {//pregunto que si la cantidad del producto es cero
            delete carrito[e.target.dataset.id]//elimino el id del objeto carrito si no hay nada en la cantidad el objeto producto
        } else {//si hay más de cero , entonces le asigo el valor de el objeto producto al carrito en la posición del id
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()//pinto el carrito
    }
    e.stopPropagation()
}
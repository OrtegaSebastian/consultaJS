//Declaración de clases
class Producto {
    constructor(producto, cantidad, precioUnitario, urlFoto = '') {
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.urlFoto = urlFoto;
    }
}

class Item{
    constructor(producto, cantidad, precioUnitario, precioTotal){
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.precioTotal = precioTotal;
    }
}

//declaracion de arreglos y total compra
var stock = [];
var carrito = [];
var totalCompra = 0;

const tabla = document.getElementById("tabla");

//Traigo stock desde Json
function cargarStockInicial(){
    fetch("http://127.0.0.1:5500/json/productos.json")
    .then( (resp) => resp.json())    
    .then( (data) => {
        for(let dato of data){
            const li = document.createElement("tabla");
            document.getElementById("tabla").innerHTML  += `
            <table><tr>
            <td><img src=${dato.urlFoto} width="100" height="100"></td>
            <td>${dato.producto}</td>
            <td>${dato.cantidad}</td>
            <td> ${dato.precioUnitario}</td></tr></tbody>               
            `;
            stock.push(dato);
            tabla.append(li);
            cargaInicial(dato);
        }
    });
} 

//capturo lo que el usuario cargue y lo guarda en stock
function capturar(){
    var productoElegido = document.getElementById("nombre").value;
    var cantidadElegida = document.getElementById("cantidad").value;
    var precioDelProducto = document.getElementById("precio").value;
    var urlFoto = document.getElementById("url").value;
    cantidadElegida < 0 || precioDelProducto < 0 ? swal("ingrese una cantidad o precio que no sea negativo"):
    nuevoProducto = new Producto(productoElegido, cantidadElegida, precioDelProducto, urlFoto);
    agregarAStock(nuevoProducto);        
}   
//carga de items 
function cargaItem(producto){
    document.getElementById("seleccionProducto").innerHTML += `<option value=${producto.producto}>${producto.producto}</option>`;
}
document.addEventListener("DOMContentLoaded", function(){
    cargarStockInicial();
});

//agrego al stock
function agregarAStock(nuevoProducto){
    stock.push(nuevoProducto);
    document.getElementById("tabla").innerHTML += `<table>
                                                    <tr>
                                                        <td><img src=${nuevoProducto.urlFoto} width="100" height="100"></td>
                                                        <td>${nuevoProducto.producto}</td><td>${nuevoProducto.cantidad}</td>
                                                        <td>${nuevoProducto.precioUnitario}</td>
                                                    </tr>
                                                    </table>`
    cargaItem(nuevoProducto);
    localStorage.setItem("stock", JSON.stringify(stock));
}


function cargaInicial(productoData){
    const { producto } = productoData;
    const selectionProd = document.getElementById("seleccionProducto");
    selectionProd.innerHTML += `<option value=${producto}>${producto}</option>`;
}

function getComboA(selectObject) {
    let value = selectObject.value; 
    document.getElementById("productoComprado").value = value;
}

//carga carrito
function cargarCarrito(){
    const producto = document.getElementById("productoComprado").value;
    const cantidad = parseFloat(document.getElementById("cantidadComprada").value);
    const item = stock.find(item => item.producto === producto);
    if (cantidad < 0 ) {
        swal("ingrese un valor positivo en cantidad");
        return;
    }else{
    totalCompra = parseFloat(document.getElementById("total").value) + (cantidad * item.precioUnitario);
    document.getElementById("carrito").innerHTML += `<table><tr><td>${producto}</td>
                                                                <td>${cantidad}</td>
                                                                <td>${(cantidad * item.precioUnitario)}</td>
                                                                <td><button id="boton" class="btn btn-danger" type="reset" onclick="quitarProducto('${producto}', ${cantidad}, ${(cantidad * item.precioUnitario)});">Quitar</button></td>
                                                                </tr></tbody>`;
    document.getElementById("total").value = totalCompra;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    carrito.push(new Item(producto, cantidad, item.precioUnitario, (cantidad * item.precioUnitario)));
    ajustarStock(producto, cantidad);}
    if(cantidad > ){

    }
}

function quitarProducto(producto, cantidad, precioTotal){
    const item = stock.find(item => item.producto === producto);
    
    // Saco del total lo que estoy quitando.
    let totalCompra; 
    totalCompra = document.getElementById("total").value;

    console.log(`Precio: ${precioTotal}`);

    console.log(`Antes: ${totalCompra}`);
    totalCompra = totalCompra -  precioTotal;
    console.log(`Despues: ${totalCompra}`);
    document.getElementById("total").value = totalCompra;

    if (item){
        item.cantidad = item.cantidad + cantidad;
        
        
        document.getElementById("tabla").innerHTML = `
        <thead class="thead-inverse">
          <tr>
              <th></th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
          </tr>
        </thead>`;
        document.getElementById("seleccionProducto").innerHTML = "";
        
        // Recargo lista de productos
        stock.forEach(item => {
            if ( item.cantidad > 0 ){
                document.getElementById("tabla").innerHTML += `<table>
                <tr>
                <td><img src=${item.urlFoto} width="100" height="100"></td>
                <td>${item.producto}</td><td>${item.cantidad}</td>
                <td>${item.precioUnitario}</td>
                </tr>`;
                const selectionProd = document.getElementById("seleccionProducto");
                selectionProd.innerHTML += `<option value=${item.producto}>${item.producto}</option>`;
            }
        });
        document.getElementById("tabla").innerHTML += `</table>`;
        
    }

    carrito = carrito.filter(item => item.producto !== producto);
    document.getElementById("carrito").innerHTML = "";
    carrito.forEach(item => {
        document.getElementById("carrito").innerHTML += `<table><tr><td>${item.producto}</td>
        <td>${item.cantidad}</td>
        <td>${(item.cantidad * item.precioUnitario)}</td>
        <td><button id="boton" class="btn btn-danger" type="reset" onclick="quitarProducto('${item.producto}', ${item.cantidad}, ${(item.cantidad * item.precioUnitario)});">Quitar</button></td>
        </tr></tbody>`
        ;
        
    });
  
}


function ajustarStock(producto, cantidad){
    const item = stock.find(item => item.producto === producto);
    console.log(JSON.stringify(item));

    document.getElementById("tabla").innerHTML = `
    <thead class="thead-inverse">
      <tr>
          <th></th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio</th>
      </tr>
    </thead>`;
    document.getElementById("seleccionProducto").innerHTML = "";

    // Recargo lista de productos
    stock.forEach(item => {
        if ( item.cantidad > 0 ){
        document.getElementById("tabla").innerHTML += `<table>
        <tr>
            <td><img src=${item.urlFoto} width="100" height="100"></td>
            <td>${item.producto}</td><td>${item.cantidad}</td>
            <td>${item.precioUnitario}</td>
        </tr>
        </table>`
        const selectionProd = document.getElementById("seleccionProducto");
        selectionProd.innerHTML += `<option value=${item.producto}>${item.producto}</option>`;
        }
    });
}



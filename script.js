/* --- ARCHIVO: script.js (Completo y Sincronizado) --- */

// 1. Lógica para el Inicio de Sesión (index.html)
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const pass = document.getElementById('password').value;
        const error = document.getElementById('mensaje-error');

        if (usuario === "admin" && pass === "luigi123") {
            window.location.href = "ventas.html";
        } else {
            error.style.display = "block";
        }
    });
}

// 2. Mapa que relaciona exactamente cada producto con su ID (del 0 al 16 de tu tabla en control.html)
const mapaProductosIds = {
    "Hamburguesa simple": 0,
    "Hamburguesa tradicional": 1,
    "Hamburguesa con queso": 2,
    "Hamburguesa con doble queso": 3,
    "Hamburguesa italiana": 4,
    "Hamburguesa clasica": 5,
    "Hamburguesa super clasica": 6,
    "Hamburguesa luigi": 7,
    "Hamburguesa super luigi": 8,
    "Hamburguesa canadience": 9,
    "Salchipapa": 10,
    "Salchipollo": 11,
    "5 uni. alitas + 1 salsa": 12,
    "8 uni. alitas + 2 salsas": 13,
    "12 uni. alitas + 2 salsas": 14,
    "18 uni. alitas + 3 salsas": 15,
    "24 uni. alitas + 4 salsas": 16
};

let productosEnPedidoActual = [];
let totalVenta = 0;

// 3. Función para agregar productos al pedido actual (ventas.html)
function agregarAlPedido(nombre, precio) {
    const mensajeVacio = document.getElementById('sin-productos');
    if (mensajeVacio) {
        mensajeVacio.style.display = 'none';
    }

    totalVenta += precio;
    document.getElementById('monto-total').textContent = `Bs. ${totalVenta.toFixed(2)}`;
    
    // Guardamos el nombre del producto en la lista del pedido actual
    productosEnPedidoActual.push(nombre);

    const contenedorLista = document.getElementById('lista-pedido');
    const nuevoItem = document.createElement('div');
    nuevoItem.className = 'item-pedido';
    nuevoItem.innerHTML = `<span>${nombre}</span> <strong>Bs. ${precio.toFixed(2)}</strong>`;
    
    contenedorLista.appendChild(nuevoItem);
}

// 4. Función para confirmar la venta y descontar stock automáticamente
function confirmarVenta() {
    if (totalVenta === 0) {
        alert("⚠️ Primero debes agregar al menos un producto al pedido.");
        return;
    }

    // Recuperamos el stock actual del navegador (o usamos los valores por defecto si es la primera vez)
    let stockGuardado = JSON.parse(localStorage.getItem('stockSnackLuigi'));
    if (!stockGuardado) {
        stockGuardado = { 0:25, 1:20, 2:15, 3:12, 4:10, 5:10, 6:8, 7:12, 8:8, 9:10, 10:18, 11:10, 12:15, 13:4, 14:6, 15:5, 16:3 };
    }

    // Restamos 1 unidad al stock de cada producto incluido en la venta
    productosEnPedidoActual.forEach(nombre => {
        let idProd = mapaProductosIds[nombre];
        if (idProd !== undefined && stockGuardado[idProd] > 0) {
            stockGuardado[idProd] -= 1;
        }
    });

    // Guardamos el stock actualizado en el navegador
    localStorage.setItem('stockSnackLuigi', JSON.stringify(stockGuardado));

    // Acumulamos las ventas totales del día
    let ventasAcumuladas = parseFloat(localStorage.getItem('totalDia')) || 0;
    let unidadesAcumuladas = parseInt(localStorage.getItem('unidadesDia')) || 0;

    ventasAcumuladas += totalVenta;
    unidadesAcumuladas += 1;

    localStorage.setItem('totalDia', ventasAcumuladas.toFixed(2));
    localStorage.setItem('unidadesDia', unidadesAcumuladas);

    alert(`🎉 ¡Venta registrada con éxito!\nTotal cobrado: Bs. ${totalVenta.toFixed(2)}\nEl stock se ha actualizado automáticamente.`);

    // Limpiar el pedido actual de la pantalla
    totalVenta = 0;
    productosEnPedidoActual = [];
    document.getElementById('monto-total').textContent = "Bs. 0.00";
    document.getElementById('lista-pedido').innerHTML = '<p id="sin-productos" style="color: #888; font-size: 14px;">No hay productos agregados.</p>';
}

// 5. Función para reiniciar la caja del día
function reiniciarCaja() {
    if (confirm("¿Estás segura de reiniciar la caja y borrar las ventas del día?")) {
        localStorage.removeItem('totalDia');
        localStorage.removeItem('unidadesDia');
        
        const elementoTotal = document.getElementById('total-dia');
        const elementoUnidades = document.getElementById('unidades-dia');
        
        if (elementoTotal) elementoTotal.textContent = "Bs. 0.00";
        if (elementoUnidades) elementoUnidades.textContent = "0 ventas";
        
        alert("🧹 Caja reiniciada con éxito para un nuevo día.");
    }
}
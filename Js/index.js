const IVA = 0.16
let monto, plazo, totalPagos, tasaAnual, fechaInicio, fechaPago, tasaMensual, mensualidad, intereses, impuestos,
    capital, insoluto, primerInteres, primerImpuesto, primerCapital, primerInsoluto, primerFechaPago, acumIntereses, acumImpuestos, acumCapital

const dinero = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
})

var establecerDatos = function () {
    primerInteres = 0, primerImpuesto = 0, primerCapital = 0, primerInsoluto = 0, primerFechaPago = true
    acumIntereses = 0, acumImpuestos = 0, acumCapital = 0

    monto = document.getElementById('monto').value
    periodo = document.getElementById('periodo').value
    plazo = document.getElementById('plazo').value
    tasaAnual = document.getElementById('interes').value
    fechaInicio = new Date(document.getElementById('fecha').value)
    fechaInicio.setDate(fechaInicio.getDate() + 1) //fecha actual

    let plazoMensual = document.getElementById('mensual').checked
    let plazoAnual = document.getElementById('anual').checked

    if ( plazoMensual === true ) {
        this.plazo = plazo
    } else if ( plazoAnual === true ) {
        this.plazo = plazo * 12
    } else {
        alert('No seleccionaste ningún tipo de plazo')
    }

    switch ( periodo ) {
        case 'semanal':
            let fechaFin = new Date(fechaInicio)
            fechaFin.setMonth(fechaFin.getMonth() + parseInt(plazo))
            let tiempo = fechaFin.getTime() - fechaInicio.getTime()
            let dias = Math.floor(tiempo / (1000 * 60 * 60 * 24))
            totalPagos = Math.ceil(dias / 7)
            break
        case 'quincenal':
            totalPagos = plazo * 2
            break
        case 'mensual':
            totalPagos = plazo
            break
        default:
            alert('No seleccionaste ningún periodo de pagos')
            break    
    }
}

function calcularTasaMensual () {
    tasaMensual = (tasaAnual / 100) / 12
    return tasaMensual
}

function tasaMensualconIva () {
    return (calcularTasaMensual() + (calcularTasaMensual() * IVA))
}

function PagoMensual () {
    let denominador = Math.pow((1 + tasaMensualconIva()), totalPagos) - 1
    mensualidad = (tasaMensualconIva() + (tasaMensualconIva() / denominador)) * monto
    return mensualidad
}

function calcularTotalPrestamo () {
    let totalPrestamo = 0
    for ( let i = 0; i < totalPagos; i++ ) {
        totalPrestamo += mensualidad
    }
    return totalPrestamo
}

function obtenerPagoMensual () {
    return Math.round(PagoMensual(), 2)
}

function obtenerTotalPrestamo () {
    return Math.round(calcularTotalPrestamo(), 2)
}

function Intereses () {
    if ( primerInteres === 0 ) {
        intereses = tasaMensual * monto
        primerInteres = intereses
    } else {
        intereses = tasaMensual * insoluto
    }
    return intereses
}

function Impuestos () {
    if ( primerImpuesto === 0 ) {
        impuestos = primerInteres * IVA
        primerImpuesto = impuestos
    } else {
        impuestos = Intereses() * IVA
    }
    return impuestos
}

function capital () {
    if ( primerCapital === 0 ) {
        capital = mensualidad - primerInteres - primerImpuesto
        primerCapital = capital
    } else capital
}

function SaldoInsoluto () {
    if ( primerInsoluto === 0 ) {
        insoluto = monto - primerCapital
        primerInsoluto = insoluto
    } else {
        insoluto -= capital()
    } 
    return insoluto
}

function simularPrestamo () {
    establecerDatos()
    PagoMensual()
    calcularTotalPrestamo()

    var columnas = [ 'No.', 'Fecha', 'Mensualidad', 'Intereses', 'Impuestos', 'Capital', 'Insoluto' ]

    var amortizaciones = document.getElementById('amortizaciones')
    var tabla = document.createElement('table')
    var cabeceraTabla = document.createElement('thead')
    var cuerpoTabla = document.createElement('tbody')
    var pieTabla = document.createElement('tfoot')
    var fila = document.createElement('tr')

    //header de mi tabla
    for ( let j = 0; j < columnas.length; j++ ) {
        let celda = document.createElement('td')
        let texto = columnas[j]
        let textoCelda = document.createTextNode(texto)
        celda.appendChild(textoCelda)
        fila.appendChild(celda)
    }
    cabeceraTabla.appendChild(fila)

    //cuerpo de mi tabla
    for ( let i = 0; i < totalPagos; i++ ) {
        let intereses = Intereses(), impuestos = Impuestos(), capital = Capital(), insoluto = SaldoInsoluto()
        acumIntereses += intereses
        acumImpuestos += impuestos
        acumCapital += capital
    }
}

require('dotenv').config();
const { leerInput,
    inquirerMenu,
    pausa,
    listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');



const main = async () => {

    let opt;
    const busquedas = new Busquedas();



    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar el lugar 
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);

                // Guardar en DB 
                busquedas.agregarHistorial(lugarSel.nombre);

                // console.log({lugarSel});   

                //Clima

                console.clear();
                console.log('\n\n\n\n\n==============================================\n               LOADING ...              \n ============================================= '.rainbow);
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                // console.log(clima);

                // Mostrar resultados
                console.clear();
                
                console.log(`\nInformación de la ciudad:\n`.green);
                console.log('Ciudad: ', lugarSel.nombre.green);
                console.log('Latitud: ', lugarSel.lat);
                console.log('Longitud: ', lugarSel.lng);
                console.log('Estado del clima: ', clima.desc.green);
                console.log('Temperatura: ', clima.temp);
                console.log('Máxima:', clima.max);
                console.log('Mínima:', clima.min);
                break;

            case 2:
                // busquedas.historial.forEach( (lugar, i) => {
                busquedas.historialCapitalizado.forEach( ( lugar, i ) => {
                    const idx = `${i + 1}.-`.green;
                    console.log( `${ idx } ${ lugar } ` )

                });    
                
                break;

        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);
}

main();
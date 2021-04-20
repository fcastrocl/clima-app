require('dotenv').config();
const { leerInput,
    inquirerMenu,
    pausa } = require('./helpers/inquirer');
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
                const lugares = await busquedas.ciudad(termino);
                console.log(lugares);

                //Buscar los lugares

                //Seleccionar el lugar 

                //Clima

                // Mostrar resultados 
                // console.log(`\nInformación de la ciudad: ${termino.rainbow}\n`.green);
                // console.log('Ciudad: ',);
                // console.log('Lat: ',);
                // console.log('Temperatura: ',);
                // console.log('Máxima:',);
                // console.log('Mínima:',);
                break;

            case 2:
                console.log('{opt}');
                break;

        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);
}

main();
const fs = require('fs');
const axios = require('axios');



class Busquedas {

    historial = [];
    dPath = './db/database.json';


    constructor() {
        
        this.leerDB();
    }

    get historialCapitalizado () {

        return this.historial.map( historial => {

            let palabras = historial.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ');

        });
    }

    get paramsMapbox() {

        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': '5',
            'language': 'es'
        }
    }

    get paramsOpenWeather() {

        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad(lugar = '') {


        try {

            //petición http

            const istance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await istance.get();
            return resp.data.features.map(lugar => ({

                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {

            return [];
        }
    };

    async climaLugar(lat, lon) {

        try {

            //instance de axios.create()

            const istance = axios.create({
                // baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ... this.paramsOpenWeather, lat, lon }
            });

            // respuesta  

            const respClima = await istance.get();
            const { weather, main } = respClima.data;

            // desc (cómo está el clima), min, max, temp 
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };

        } catch (error) {
            console.log(error);

        }
    }

    agregarHistorial( lugar = ''){

        //TODO: prevenir duplicados
        
        if(this.historial.includes( lugar.toLocaleLowerCase() )){
            return; 
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar);

        //Grabar en DB
        this.guardarDB();
    };

    guardarDB () {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dPath, JSON.stringify( payload ))

    }

    leerDB () {

        //Debe existir ...       
        if (!fs.existsSync(this.dPath)) return;
                
        //const info ... ReadFileSync ... path ... encoding: 'utf-8'
        const info = fs.readFileSync(this.dPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
    
        this.historial = data.historial;

    }

}

module.exports = Busquedas;
import 'chart.js'
import 'chartjs-plugin-datalabels'
import chroma from 'chroma-js'

var hosp100kChart;
const hosp100kFn = function(data, aggiornamento) {

    data.features.sort(ospedalizzati_sorter).reverse()

    // Filter response by last update
    var lastupdate = []
    data.features.forEach(feature => {
        if (feature.properties.data == aggiornamento){
            lastupdate.push(feature)
        }
    });

    // Filter response by last Regions and build chart dataset
    var chartLabels  = []
    var hosp100k_data = []
    var barColors = []

    const createBar = function(pop, elem){
        var regione = elem.properties.denominazione_regione
        var percInt = (elem.properties.terapia_intensiva)*100/elem.properties.totale_ospedalizzati 
        chartLabels.push([regione, 'terapia intensiva: '+percInt.toFixed(2)+'%'])
        hosp100k_data.push(elem.properties.totale_ospedalizzati/pop*100000)
        barColors.push(scale(percInt).hex())
    }

    var scale = chroma.scale('Blues').domain([0,15]);
    lastupdate.forEach(elem => {
        var codice_regione = elem.properties.codice_regione
        if (codice_regione == parseInt('03')) {
            // Lombardia
            var pop19 = 10060574
            createBar(pop19,elem)
        } else if (codice_regione == parseInt('08')) {
            // Emilia Romagna
            var pop19 = 4459477
            createBar(pop19,elem)
        } else if (codice_regione == parseInt('05')) {
            // Veneto
            var pop19 = 4905854
            createBar(pop19,elem)
        } else if (codice_regione == parseInt('13')){
            // Abruzzo
            var pop19 = 1311580
            createBar(pop19,elem)
        }
    })

    /*
    console.log(chartLabels)
    console.log(hosp100k_data)
    console.log(barColors)
    */
    /*
    var legendContainer = document.querySelector('.bar-legend')
    chroma.brewer.Blues.forEach(color =>{
        var legendElement = '<div style="height:20px;width:20px;background-color:'+color+'"></div>'
        legendContainer.innerHTML += legendElement
    })
    */
    // Grafico
	var ctx = document.getElementById('grafico-hosp-100k').getContext('2d');
    if (hosp100kChart) {hosp100kChart.destroy(); }

    hosp100kChart = new Chart(ctx, {
		type: 'horizontalBar',
        data: {
            labels:chartLabels,
            datasets:[{
                data: hosp100k_data,
                backgroundColor: barColors,
                borderColor: barColors
            }]
        },
        options: {
            title: {
                display: false,
                text: 'Totale ospedalizzati per 100000 abitanti',
                fontSize: 16,
                fontColor: '#FFF'
            },
            responsive:true,
            maintainAspectRatio: false,
            legend:{
                display:false,
                position: 'top',
                labels:{
                    fontColor:'#bdbdbd'
                }
            },
            scales: {
                yAxes:[{
                    ticks:{
                        fontColor:'#FFF'
                    }
                }],
                xAxes:[{
                    id: 'x-axis-0',
                    ticks:{
                        fontColor:'#FFF'
                    }
                }]
            },
            tooltips: {
                enabled:false
            },
            plugins:{
                datalabels: {
                    color: '#FFF',
                    anchor: 'end',
                    align: 'end',
                    labels: {
                        title: {
                            font: {
                                weight: 'bold'
                            }
                        },
                        value: {
                            color: 'green'
                        }
                    },
                    formatter: function(value, context) {
                        return value.toFixed(0);
                    }
                }
            }
        }
    })
    
}

// Ordinamento per numero di ospedalizzati
const ospedalizzati_sorter = function( a, b ) {
    if ( a.properties.totale_ospedalizzati < b.properties.totale_ospedalizzati ){
      return -1;
    }
    if ( a.properties.totale_ospedalizzati > b.properties.totale_ospedalizzati ){
      return 1;
    }
    return 0;
}



export { hosp100kFn }
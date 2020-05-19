import 'chart.js'
import 'chartjs-plugin-datalabels'
import moment from 'moment'
import axios from 'axios'
import lodash from 'lodash'

var tamponiConferitiChart;
const tamponiConferitiChartFn = () => {
    
    axios.get('https://covid19-it-api.herokuapp.com/asl/daily').then(function(response){
        const data = response.data

        data.sort(function(a,b){
            return new Date(b.DATA_ARRIVO) - new Date(a.DATA_ARRIVO);
        }).reverse();

        var date_groups = lodash.groupBy(data,'DATA_ARRIVO')
        // console.log(date_groups)

        // L'array raggruppato per data è disomogeneo (contiene solo le ASL con num di esami > 0)
        // **************************************************************************************
        // Per ogni ASL nel dataset di partenza, verifica che questa sia presente nell'array di oggetti raggruppato per data
        // e aggiunge un oggetto con valori relativi agli esami = 0 per le le asl non presenti
        // In questo modo si ottiene un dato uniforme dove per ogni key (DATA) compaiono tutte le ASL
        // presenti nel dataset di partenza, comprese quelle senza esami effettuati o in corso

        const asl_array = ['AQ','CH','PE','TE']
        asl_array.forEach(asl => {
            lodash.forEach(date_groups,function(item, key){
                var contains_asl = lodash.filter(item,(o) => { return o.ASL_RICHIEDENTE == asl })
                if (contains_asl.length < 1){
                    item.push({'DATA_ARRIVO':key, 'ASL_RICHIEDENTE':asl, 'IN_CORSO':0, 'ESAMINATI':0, 'TOTALE':0 })
                }
            })
        })

        // console.log(date_groups)

        // Prepare chart dataset
        var labels = lodash.map(date_groups, (item,key) => { return moment(key).format('DD MMM') })
        var datasets = []
        
        asl_array.forEach(asl => {
            var count_esiti = []
            lodash.forEach(date_groups,function(item, key){
                lodash.map(item, o => {
                    if (o.ASL_RICHIEDENTE == asl){
                        count_esiti.push(o.TOTALE)
                    }
                })
            })
            datasets.push({ label: parseASL(asl), data: count_esiti, backgroundColor: assegnaColore(asl)}) 
        })

        // console.log(labels)
        // console.log(datasets)

        // Chart
        // Grafico
        var ctx = document.getElementById('grafico-tamponi-conferiti');

        if ( tamponiConferitiChart ) { tamponiConferitiChart.destroy(); }

        tamponiConferitiChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Tamponi conferiti dalle Aziende sanitarie abruzzesi a IZSAM per data di accettazione',
                    fontSize: 14,
                    fontColor: '#FFF'
                },
                legend:{
                    display:true,
                    position: 'top',
                    labels:{
                        fontColor:'#bdbdbd'
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks:{
                            fontColor:'#FFF'
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks:{
                            fontColor:'#FFF'
                        }
                    }]
                },
                plugins: {
                    zoom:{
                        pan:{
                            enabled:true,
                            mode:'x'
                        },
                        zoom: {
                            enabled: true,
                            mode: 'x',
                            speed: 0.05
                        }
                    },
                    datalabels: {
                        display:false
                    }
         
                }
            }
        })
    })
}

export { tamponiConferitiChartFn }

const assegnaColore = (asl) => {
    if (asl == 'AQ'){
        return '#ff4444'
    } else if (asl == 'CH') {
        return '#388e3c'
    } else if (asl == 'PE') {
        return '#0091ea'
    } else {
        return '#aa66cc'
    }
}

const parseASL = (asl) => {
    if (asl == 'AQ'){
        return "AUSL 1 - L'Aquila"
    } else if (asl == 'CH'){
        return "AUSL 2 - Chieti, Lanciano, Vasto"
    } else if (asl == 'PE'){
        return "AUSL 3 - Pescara"
    } else {
        return "AUSL 4 - Teramo"
    }
}
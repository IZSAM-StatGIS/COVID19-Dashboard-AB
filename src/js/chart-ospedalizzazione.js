import 'chart.js'
import 'chartjs-plugin-datalabels'
import moment from 'moment'
import axios from 'axios'
import { locale } from 'moment'

const hospitalChartFn = function(cod_reg, title, canvas_id){

    var aggiornamento = moment(document.querySelector("#aggiornamento").textContent,'DD MMM YYYY, HH:ss').locale('it').format('YYYY-MM-DD')
    
    axios.get('https://covid19-it-api.herokuapp.com/regioni',{ params:{
        cod_reg: cod_reg,
        data: aggiornamento
    }}).then(function(response){
        var chartData = []
        response.data.features.forEach(feature => {
            chartData.push(feature.properties)
        })

        setTimeout(function(){
            drawHospitalChart(chartData[0], title, canvas_id)
        },200)
        
    })
}

const drawHospitalChart = function(dati, title, canvas_id){
    // console.log(dati)
    var domiciliare = dati.isolamento_domiciliare;
    var ricoverati  = dati.ricoverati_con_sintomi;
    var tintensiva  = dati.terapia_intensiva;

    var totale = domiciliare + ricoverati + tintensiva

    // Grafico
    var ctx = document.getElementById( canvas_id ).getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels:['Isolamento domiciliare','Ricoverati con sintomi','Terapia intensiva'],
            datasets:[{
                data: [domiciliare,ricoverati,tintensiva],
                backgroundColor: ['#4285F4','#FF8800','#b71c1c'],
                borderColor: ['#4285F4','#FF8800','#b71c1c']
            }]
        },
        options: {
            title: {
                display: true,
                text: title,
                fontSize: 14,
                fontColor: '#FFF'
            },
            responsive:true,
            maintainAspectRatio: false,
            legend:{
                display:false,
                position: 'right',
                labels:{
                    fontColor:'#bdbdbd'
                }
            },
            plugins: {
                datalabels: {
                    color: '#FFF',
                    labels: {
                        title: {
                            font: {
                                weight: 'bold',
                                // size: '16px'
                            }
                        },
                        value: {
                            color: 'green'
                        }
                    },
                    formatter: function(value, context) {
                        return (value * 100/totale).toFixed(0) + '%';
                    }
                }
            }
        } 
    })

}

export { hospitalChartFn }
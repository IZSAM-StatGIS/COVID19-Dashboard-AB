import 'chart.js'
import moment from 'moment'
import axios from 'axios'

var hospitalChart
const hospitalChartFn = function(cod_reg, title, canvas_id){

    var aggiornamento = moment(new Date(document.querySelector("#aggiornamento").textContent)).format('YYYY-MM-DD')

    axios.get('https://covid19-it-api.herokuapp.com/regioni',{ params:{
        cod_reg: cod_reg,
        data: aggiornamento
    }}).then(function(response){
        var chartData = []
        response.data.features.forEach(feature => {
            chartData.push(feature.properties)
        })

        drawHospitalChart(chartData[0], title, canvas_id)
        
    })
}

const drawHospitalChart = function(dati, title, canvas_id){
    console.log(dati)
    var domiciliare = dati.isolamento_domiciliare;
    var ricoverati  = dati.ricoverati_con_sintomi;
    var tintensiva  = dati.terapia_intensiva;
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
            }
        } 
    })

}

export { hospitalChartFn }
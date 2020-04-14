import 'chart.js'
import 'chartjs-plugin-datalabels'
import moment from 'moment'

var andamentoNazionaleChart;

const andamentoChartNazFn = function(data){
    // console.log(data)
    data.reverse()

    var nuovi_positivi = []
    var bullettin_dates = []

    data.forEach(d =>{
        nuovi_positivi.push(d.nuovi_positivi) 
        bullettin_dates.push(moment(d.data).format('DD MMM'))
    });

    var datasets = [{
        label: 'Nuovi positivi',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#ff4444',
        pointBackgroundColor: '#ff4444',
        pointBorderColor: '#ff4444',
        data: nuovi_positivi,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'Media mobile',
        lineTension: 0,
        borderDash: [5,10],
        borderWidth:2,
        borderColor: '#ff4444',
        pointRadius:2,
        pointBackgroundColor: '#ff4444',
        pointBorderColor:'#ff4444',
        data: movingAvg(nuovi_positivi),
        fill: 'rgba(255,255,255,0.1)'
    }]

    // Grafico
	var ctx = document.getElementById('grafico-andamento-nazionale').getContext('2d');
    if (andamentoNazionaleChart) {andamentoNazionaleChart.destroy(); }

    andamentoNazionaleChart = new Chart(ctx, {
        type: 'line',
		data: {
			labels: bullettin_dates,
			datasets: datasets
		},
		options: {
            title: {
                display: true,
                text: 'Italia',
                fontSize: 16,
                fontColor: '#FFF'
            },
            responsive:true,
            maintainAspectRatio: false,
            legend:{
                display:true,
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
            plugins:{
                datalabels: {
                    display:false
                }
            }
        }
    })

}

var andamentoAbruzzoChart;

const andamentoChartAbrFn = function(data){
    // console.log(data.features)
    var nuovi_positivi = []
    var bullettin_dates = []

    data.features.forEach(d =>{
        nuovi_positivi.push(d.properties.nuovi_positivi) 
        bullettin_dates.push(moment(d.properties.data).format('DD MMM'))
    });

    var datasets = [{
        label: 'Nuovi positivi',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#0099CC',
        pointBackgroundColor: '#0099CC',
        pointBorderColor: '#0099CC',
        data: nuovi_positivi,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'Media mobile',
        lineTension: 0,
        borderDash: [5,10],
        borderWidth:2,
        borderColor: '#0099CC',
        pointRadius:2,
        pointBackgroundColor: '#0099CC',
        pointBorderColor:'#0099CC',
        data: movingAvg(nuovi_positivi),
        fill: 'rgba(255,255,255,0.1)'
    }]

    // Grafico
	var ctx = document.getElementById('grafico-andamento-abruzzo').getContext('2d');
    if (andamentoAbruzzoChart) {andamentoAbruzzoChart.destroy(); }

    andamentoAbruzzoChart = new Chart(ctx, {
        type: 'line',
		data: {
			labels: bullettin_dates,
			datasets: datasets
		},
		options: {
            title: {
                display: true,
                text: 'Abruzzo',
                fontSize: 16,
                fontColor: '#FFF'
            },
            responsive:true,
            maintainAspectRatio: false,
            legend:{
                display:true,
                position: 'top',
                labels:{
                    fontColor:'#bdbdbd',
                    // boxWidth:60
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
            plugins:{
                datalabels: {
                    display:false
                }
            }
        }
    })

}

// Moving Average function
const movingAvg = function(array){
    var prevArray = [], nextArray = []
    var result = []

    for (var i=0; i <= array.length; i++){
        if (i >= 3) {
            var prevValuesMean = ( array[i-3] + array[i-2] + array[i-1] )
            prevArray.push(prevValuesMean)
        } 
        if (i <= array.length - 3) {
            var nextValuesMean = ( array[i+3] + array[i+2] + array[i+1] )
            nextArray.push(nextValuesMean)
        }
        
        result.push((prevValuesMean + array[i] + nextValuesMean)/7)
        
    }  
    return result
}


export { andamentoChartNazFn, andamentoChartAbrFn }
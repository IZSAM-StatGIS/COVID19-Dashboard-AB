import 'chart.js'
import moment from 'moment'

var andamentoNazionaleChart;

const andamentoChartNazFn = function(data){
    // console.log(data)
    data.reverse()

    var nuovi_positivi = []
    var bullettin_dates = []

    data.forEach((d,i) =>{
        nuovi_positivi.push(d.nuovi_positivi) 
        bullettin_dates.push(moment(d.data).format('DD MMM'))
    });

    
    
    var avg = movingAvg(nuovi_positivi)
    console.log(avg)

    var datasets = [{
        label: 'Nuovi positivi',
        lineTension: 0,
        backgroundColor: '#ff4444',
        pointBackgroundColor: '#ff4444',
        borderColor: '#ff4444',
        pointBorderColor: '#ff4444',
        data: nuovi_positivi,
        fill: false
    },{
        label: 'Media mobile',
        lineTension: 0,
        backgroundColor: '#CC0000',
        pointBackgroundColor: '#CC0000',
        borderColor: '#CC0000',
        pointBorderColor:'#CC0000',
        data: movingAvg(nuovi_positivi),
        fill: false
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
        backgroundColor: '#ff4444',
        pointBackgroundColor: '#ff4444',
        borderColor: '#ff4444',
        pointBorderColor: '#ff4444',
        data: nuovi_positivi,
        fill: false
    },{
        label: 'Media mobile',
        lineTension: 0,
        backgroundColor: '#CC0000',
        pointBackgroundColor: '#CC0000',
        borderColor: '#CC0000',
        pointBorderColor:'#CC0000',
        data: movingAvg(nuovi_positivi),
        fill: false
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
            }
        }
    })

}

const movingAvg = function(array){
    var prevArray = [], nextArray = []
    var result = []

    for (var i=0; i <= array.length; i++){
        if (i >= 3) {
            var prevValuesMean = ( array[i-3] + array[i-2] + array[i-1] ) / 3
            prevArray.push(prevValuesMean)
        } 
        if (i <= array.length - 3) {
            var nextValuesMean = ( array[i+3] + array[i+2] + array[i+1] ) / 3
            nextArray.push(nextValuesMean)
        }
        
        result.push((prevValuesMean + array[i] + nextValuesMean)/3)
        
    }  
    return result
}


export { andamentoChartNazFn, andamentoChartAbrFn }
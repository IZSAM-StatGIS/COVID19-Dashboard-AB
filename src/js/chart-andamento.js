import 'chart.js'
import moment from 'moment'

var andamentoNazionaleChart;

const andamentoChartNazFn = function(data){
    // console.log(data)
    data.reverse()

    var total_cases = []
    var positive = []
    var bullettin_dates = []

    data.forEach(d =>{
        total_cases.push(d.totale_casi) 
        positive.push(d.totale_positivi)
        bullettin_dates.push(moment(d.data).format('DD MMM'))
    });

    var datasets = [{
        label: 'Contagiati',
        lineTension: 0,
        backgroundColor: '#ff4444',
        pointBackgroundColor: '#ff4444',
        borderColor: '#ff4444',
        pointBorderColor: '#ff4444',
        data: total_cases,
        fill: false
    },{
        label: 'Media mobile a 7 gg',
        lineTension: 0,
        backgroundColor: '#CC0000',
        pointBackgroundColor: '#CC0000',
        borderColor: '#CC0000',
        pointBorderColor:'#CC0000',
        data: positive,
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
    console.log(data.features)

    var total_cases = []
    var positive = []
    var bullettin_dates = []

    data.features.forEach(d =>{
        total_cases.push(d.properties.totale_casi) 
        positive.push(d.properties.totale_positivi)
        bullettin_dates.push(moment(d.properties.data).format('DD MMM'))
    });

    var datasets = [{
        label: 'Contagiati',
        lineTension: 0,
        backgroundColor: '#ff4444',
        pointBackgroundColor: '#ff4444',
        borderColor: '#ff4444',
        pointBorderColor: '#ff4444',
        data: total_cases,
        fill: false
    },{
        label: 'Media mobile a 7 gg',
        lineTension: 0,
        backgroundColor: '#CC0000',
        pointBackgroundColor: '#CC0000',
        borderColor: '#CC0000',
        pointBorderColor:'#CC0000',
        data: positive,
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


export { andamentoChartNazFn, andamentoChartAbrFn }
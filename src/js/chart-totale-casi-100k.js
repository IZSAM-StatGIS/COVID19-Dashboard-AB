import 'chart.js'
import 'chartjs-plugin-datalabels'
import moment from 'moment'

var casiNazionaleChart;
const casiChartNazFn = function(data){

    var dati_abruzzo = [], dati_emilia = [], dati_veneto = [], dati_lombardia = []
    var bullettin_dates = []

    data.features.forEach(feature =>{
        var codice = feature.properties.codice_regione
        var casi   = feature.properties.totale_casi
        var dates  = moment(feature.properties.data).format('DD MMM')

        if (codice == parseInt('13')){
            var pop19 = 1311580
            dati_abruzzo.push((casi/pop19)*100000)
            bullettin_dates.push(dates)
        } else if (codice == parseInt('08')) {
            var pop19 = 4459477
            dati_emilia.push((casi/pop19)*100000)
        } else if (codice == parseInt('05')) {
            var pop19 = 4905854
            dati_veneto.push((casi/pop19)*100000)
        } else if (codice == parseInt('03')) {
            var pop19 = 10060574
            dati_lombardia.push((casi/pop19)*100000)
        }
    })

    var datasets = [{
        label: 'Abruzzo',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#ff4444',
        pointRadius: 2,
        pointBackgroundColor: '#ff4444',
        pointBorderColor: '#ff4444',
        data: dati_abruzzo,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'Emilia-Romagna',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#00C851',
        pointRadius: 2,
        pointBackgroundColor: '#00C851',
        pointBorderColor: '#00C851',
        data: dati_emilia,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'Lombardia',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#4285F4',
        pointRadius: 2,
        pointBackgroundColor: '#4285F4',
        pointBorderColor: '#4285F4',
        data: dati_lombardia,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'Veneto',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#aa66cc',
        pointRadius: 2,
        pointBackgroundColor: '#aa66cc',
        pointBorderColor: '#aa66cc',
        data: dati_veneto,
        fill: 'rgba(255,255,255,0.1)'
    }]

    // Grafico
	var ctx = document.getElementById('grafico-casi-nazionale').getContext('2d');
    if (casiNazionaleChart) {casiNazionaleChart.destroy(); }

    casiNazionaleChart = new Chart(ctx, {
        type: 'line',
		data: {
			labels: bullettin_dates,
			datasets: datasets
		},
		options: {
            title: {
                display: true,
                text: 'Abruzzo e Regioni più colpite',
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

var casiAbruzzoChart
const casiChartAbrFn = function(dati){
    // console.log(dati)

    var dati_aq = [], dati_pe = [], dati_te = [], dati_ch = []
    var bullettin_dates = []

    dati.forEach(d =>{
        var prov = d.sigla_provincia
        var casi = d.totale_casi
        var dates = moment(d.data).format('DD MMM')

        if (prov == 'AQ'){
            var pop19 = 299031
            dati_aq.push((casi/pop19)*100000)
            bullettin_dates.push(dates)
        } else if (prov == 'PE') {
            var pop19 = 318909
            dati_pe.push((casi/pop19)*100000)
        } else if (prov == 'TE') {
            var pop19 = 308052
            dati_te.push((casi/pop19)*100000)
        } else if (prov == 'CH') {
            var pop19 = 385588
            dati_ch.push((casi/pop19)*100000)
        }
    })

    var datasets = [{
        label: 'AQ',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#ff4444',
        pointRadius: 2,
        pointBackgroundColor: '#ff4444',
        pointBorderColor: '#ff4444',
        data: dati_aq,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'CH',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#00C851',
        pointRadius: 2,
        pointBackgroundColor: '#00C851',
        pointBorderColor: '#00C851',
        data: dati_ch,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'PE',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#4285F4',
        pointRadius: 2,
        pointBackgroundColor: '#4285F4',
        pointBorderColor: '#4285F4',
        data: dati_pe,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'TE',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#aa66cc',
        pointRadius: 2,
        pointBackgroundColor: '#aa66cc',
        pointBorderColor: '#aa66cc',
        data: dati_te,
        fill: 'rgba(255,255,255,0.1)'
    }]

    var ctx = document.getElementById('grafico-casi-abruzzo').getContext('2d');
    if (casiAbruzzoChart) {casiAbruzzoChart.destroy(); }

    casiAbruzzoChart = new Chart(ctx, {
        type: 'line',
		data: {
			labels: bullettin_dates,
			datasets: datasets
		},
		options: {
            title: {
                display: true,
                text: 'Province Abruzzo',
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

const removeDuplicates = function(arr) {
    let unique = {};
    arr.forEach(function(i) {
        if(!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}


export { casiChartNazFn, casiChartAbrFn }
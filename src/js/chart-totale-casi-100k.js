import 'chart.js'
import 'chartjs-plugin-datalabels'
import moment from 'moment'
import $ from 'jquery'

var casiNazionaleChart;
const casiChartNazFn = function(data){
    
    var dati_abruzzo = [], dati_emilia = [], dati_veneto = [], dati_lombardia = []
    var dati_basilicata = [], dati_bolzano = [], dati_calabria = [], dati_campania = [], dati_friuli = []
    var dati_lazio = [], dati_liguria = [], dati_marche = [], dati_molise = [], dati_piemonte = []
    var dati_puglia = [], dati_sardegna = [], dati_sicilia = [], dati_toscana = [], dati_trento = []
    var dati_umbria = [], dati_valle_daosta = []
    var bullettin_dates = []

    data.features.forEach(feature =>{
        var codice = feature.properties.codice_regione
        var casi   = feature.properties.totale_casi
        var dates  = moment(feature.properties.data).format('DD MMM')

        /* Default regions */
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
        /* Selectable regions */
        else if (codice == parseInt('17')){
            var pop19 = 562890
            dati_basilicata.push((casi/pop19)*100000)
        } else if (codice == parseInt('4') && feature.properties.denominazione_regione == 'P.A. Bolzano'){
            var pop19 = 1311580
            dati_bolzano.push((casi/pop19)*100000)
        } else if (codice == parseInt('18')){
            var pop19 = 5879082
            dati_calabria.push((casi/pop19)*100000)
        } else if (codice == parseInt('15')){
            var pop19 = 5801692
            dati_campania.push((casi/pop19)*100000)
        } else if (codice == parseInt('6')){
            var pop19 = 562869
            dati_friuli.push((casi/pop19)*100000)
        } else if (codice == parseInt('12')){
            var pop19 = 4029053
            dati_lazio.push((casi/pop19)*100000)
        } else if (codice == parseInt('7')){
            var pop19 = 4999891
            dati_liguria.push((casi/pop19)*100000)
        } else if (codice == parseInt('11')){
            var pop19 = 1525271
            dati_marche.push((casi/pop19)*100000)
        } else if (codice == parseInt('14')){
            var pop19 = 4356406
            dati_molise.push((casi/pop19)*100000)
        } else if (codice == parseInt('1')){
            var pop19 = 10060574
            dati_piemonte.push((casi/pop19)*100000)
        } else if (codice == parseInt('16')){
            var pop19 = 125666
            dati_puglia.push((casi/pop19)*100000)
        } else if (codice == parseInt('20')){
            var pop19 = 4905854
            dati_sardegna.push((casi/pop19)*100000)
        } else if (codice == parseInt('19')){
            var pop19 = 1550640
            dati_sicilia.push((casi/pop19)*100000)
        } else if (codice == parseInt('9')){
            var pop19 = 1215220
            dati_toscana.push((casi/pop19)*100000)
        } else if (codice == parseInt('4') && feature.properties.denominazione_regione == 'P.A. Trento'){
            var pop19 = 3729641
            dati_trento.push((casi/pop19)*100000)
        } else if (codice == parseInt('10')){
            var pop19 = 4459477
            dati_umbria.push((casi/pop19)*100000)
        } else if (codice == parseInt('2')){
            var pop19 = 531178
            dati_valle_daosta.push((casi/pop19)*100000)
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
                text: 'Confronto Regioni',
                fontSize: 14,
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

    document.querySelector("#compare-regions-btn").addEventListener('click', (e) => {
        // Clear all chart datasets
        casiNazionaleChart.data.datasets = []
        casiNazionaleChart.update()
        // Add selected regions datasets
        var selected_regions = $("#casi-region-select").val()
        selected_regions.forEach((regione, index) =>{
            if (regione == 'valle_daosta') { var label = "Valle d'Aosta" } else {
                var label = regione.replace(regione.charAt(0), regione.charAt(0).toUpperCase())
            }
            if (index == 0) { var color = '#ff4444' }
            if (index == 1) { var color = '#00C851' }
            if (index == 2) { var color = '#4285F4' }
            if (index == 3) { var color = '#aa66cc' }

            var dataset = eval('dati_'+regione)
            casiNazionaleChart_add(dataset,label,color)
        })
    })

    document.querySelector("#reset-regions-btn").addEventListener('click', (e) => {
        // Clear all chart datasets
        casiNazionaleChart.data.datasets = []
        casiNazionaleChart.update()
        // Select Default regions
        $("#casi-region-select").selectpicker('val', ['abruzzo','emilia','lombardia','veneto']);
        // Add selected regions datasets
        var selected_regions = $("#casi-region-select").val()
        selected_regions.forEach((regione, index) =>{
            if (regione == 'valle_daosta') { var label = "Valle d'Aosta" } else {
                var label = regione.replace(regione.charAt(0), regione.charAt(0).toUpperCase())
            }
            if (index == 0) { var color = '#ff4444' }
            if (index == 1) { var color = '#00C851' }
            if (index == 2) { var color = '#4285F4' }
            if (index == 3) { var color = '#aa66cc' }

            var dataset = eval('dati_'+regione)
            casiNazionaleChart_add(dataset,label,color)
        })
    })

}

const casiNazionaleChart_add = function(dataset, label, color){

    casiNazionaleChart.data.datasets.push({
        label: label,
        lineTension: 0,
        borderWidth:2,
        borderColor: color,
        pointRadius: 2,
        pointBackgroundColor: color,
        pointBorderColor: color,
        data: dataset,
        fill: 'rgba(255,255,255,0.1)'
      });

      casiNazionaleChart.update();
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
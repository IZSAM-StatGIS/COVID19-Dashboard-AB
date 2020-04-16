import 'chart.js'
import 'chartjs-plugin-datalabels'
import moment from 'moment'
import chroma from 'chroma-js'
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
        borderColor: '#3F729B',
        pointRadius: 2,
        pointBackgroundColor: '#3F729B',
        pointBorderColor: '#3F729B',
        data: dati_abruzzo,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'Emilia-Romagna',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#0093B4',
        pointRadius: 2,
        pointBackgroundColor: '#0093B4',
        pointBorderColor: '#0093B4',
        data: dati_emilia,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'Lombardia',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#00B4B7',
        pointRadius: 2,
        pointBackgroundColor: '#00B4B7',
        pointBorderColor: '#00B4B7',
        data: dati_lombardia,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'Veneto',
        lineTension: 0,
        borderWidth:2,
        borderColor: '#3CD1A4',
        pointRadius: 2,
        pointBackgroundColor: '#3CD1A4',
        pointBorderColor: '#3CD1A4',
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
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label
                        return label+": "+tooltipItem.yLabel.toFixed(0)
                    }
                }
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
            if (regione == 'valle_daosta') { var label = "Valle d'Aosta" } 
            else if (regione == 'emilia') { var label = "Emilia-Romagna" } 
            else {
                var label = regione.replace(regione.charAt(0), regione.charAt(0).toUpperCase())
            }
            if (index == 0) { var color = '#3F729B' }
            if (index == 1) { var color = '#0093B4' }
            if (index == 2) { var color = '#00B4B7' }
            if (index == 3) { var color = '#3CD1A4' }

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
            if (regione == 'valle_daosta') { var label = "Valle d'Aosta" } 
            else if (regione == 'emilia') { var label = "Emilia-Romagna" } 
            else {
                var label = regione.replace(regione.charAt(0), regione.charAt(0).toUpperCase())
            }
            if (index == 0) { var color = '#3F729B' }
            if (index == 1) { var color = '#0093B4' }
            if (index == 2) { var color = '#00B4B7' }
            if (index == 3) { var color = '#3CD1A4' }

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

    var chart_color_domain = [dati_aq.slice(-1).pop(), dati_pe.slice(-1).pop(), dati_te.slice(-1).pop(), dati_ch.slice(-1).pop()]

    // console.log(tot_casi_latest)
    // var scale = chroma.scale('Reds').domain([0,chart_color_max])
    var scale = chroma.scale('Reds').domain([0,Math.max.apply(Math, chart_color_domain)]);
    var color_aq = scale(dati_aq.slice(-1).pop()).hex()
    var color_pe = scale(dati_pe.slice(-1).pop()).hex()
    var color_ch = scale(dati_ch.slice(-1).pop()).hex()
    var color_te = scale(dati_te.slice(-1).pop()).hex()

    var datasets = [{
        label: 'AQ',
        lineTension: 0,
        borderWidth:2,
        borderColor: color_aq,
        pointRadius: 2,
        pointBackgroundColor: color_aq,
        pointBorderColor: color_aq,
        data: dati_aq,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'CH',
        lineTension: 0,
        borderWidth:2,
        borderColor: color_ch,
        pointRadius: 2,
        pointBackgroundColor: color_ch,
        pointBorderColor: color_ch,
        data: dati_ch,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'PE',
        lineTension: 0,
        borderWidth:2,
        borderColor: color_pe,
        pointRadius: 2,
        pointBackgroundColor: color_pe,
        pointBorderColor: color_pe,
        data: dati_pe,
        fill: 'rgba(255,255,255,0.1)'
    },{
        label: 'TE',
        lineTension: 0,
        borderWidth:2,
        borderColor: color_te,
        pointRadius: 2,
        pointBackgroundColor: color_te,
        pointBorderColor: color_te,
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
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label
                        return label+": "+tooltipItem.yLabel.toFixed(0)
                    }
                }
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
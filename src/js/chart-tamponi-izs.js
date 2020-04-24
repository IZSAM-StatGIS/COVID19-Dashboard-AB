import 'chart.js'
import 'chartjs-plugin-datalabels'
import moment from 'moment'
import axios from 'axios'
import lodash from 'lodash'
import $ from 'jquery'

var tamponiIZSChartPos;
var tamponiIZSChartNeg;

const tamponiIZSChartFn = function(prov){
    
    if (prov){

    } else {
        prov = 'TE,PE,CH,AQ'
    }

    // Retrieve data from the server
    var positivi = []
    var negativi = []

    axios.get('https://covid19-it-api.herokuapp.com/comuni',{ params:{
        sigla_prov: prov
    } }).then(function(response){
        // console.log(response)
        response.data.forEach(e => {
            if (e.ESITO == 'POS'){
                positivi.push(e)
            } else if (e.ESITO == 'NEG'){
                negativi.push(e)
            }
        });
        
        /* console.log(positivi.length)
        console.log(negativi.length) */
        
        var grouped_positivi = lodash.groupBy(positivi,"DATA_TAMPONE");
        var grouped_negativi = lodash.groupBy(negativi,"DATA_TAMPONE");

        // Ricava Dataset positivi
        var positivi_dataset = []
        var positivi_dates = []
        lodash.forEach(grouped_positivi,function(item, key){
            positivi_dates.push(moment(key).format('DD MMM'))
            positivi_dataset.push(item.length)
        })

        // Grafico positivi
        var ctx_pos = document.getElementById('grafico-tamponi-positivi').getContext('2d');
        if ( tamponiIZSChartPos ) { tamponiIZSChartPos.destroy(); }

        tamponiIZSChartPos = new Chart(ctx_pos, {
            type: 'bar',
            data: {
                labels: positivi_dates.reverse(),
                datasets: [{
                    label: 'Tamponi positivi',
                    fill: false,
                    backgroundColor: "#ff4444",
                    borderColor: "#CC0000",
                    data: positivi_dataset.reverse(),
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Positivi',
                    fontSize: 14,
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

        // Ricava Dataset negativi
        var negativi_dataset = []
        var negativi_dates = []
        lodash.forEach(grouped_negativi,function(item, key){
            negativi_dates.push(moment(key).format('DD MMM'))
            negativi_dataset.push(item.length)
        })
        // Grafico negativi
        var ctx_neg = document.getElementById('grafico-tamponi-negativi').getContext('2d');
        if ( tamponiIZSChartNeg ) { tamponiIZSChartNeg.destroy(); }

        tamponiIZSChartNeg = new Chart(ctx_neg, {
            type: 'bar',
            data: {
                labels: negativi_dates.reverse(),
                datasets: [{
                    label: 'Tamponi negativi',
                    fill: false,
                    backgroundColor: "#007E33",
                    borderColor: "#00FF00",
                    data: negativi_dataset.reverse(),
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Negativi',
                    fontSize: 14,
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
    })
}

document.querySelector("#prov-tamponi-btn").addEventListener('click', (e) => {
    
    var prov_arr = $("#prov-tamponi-select").val()
    var prov_str = prov_arr.join(',');
    tamponiIZSChartFn(prov_str)
})

document.querySelector("#prov-tamponi-reset-btn").addEventListener('click', (e) => {
    
    $("#prov-tamponi-select").selectpicker('val', ['TE','PE','AQ','CH']);
    var prov_arr = $("#prov-tamponi-select").val()
    var prov_str = prov_arr.join(',');
    tamponiIZSChartFn(prov_str)
})


export { tamponiIZSChartFn }
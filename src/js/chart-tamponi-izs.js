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

    axios.get('https://covid19-it-api.herokuapp.com/comuni',{ params:{
        sigla_prov: prov
    } }).then(function(response){
        
        var grouped = lodash.groupBy(response.data,"DATA_TAMPONE")
        // console.log(grouped)
        var negativi_dataset = []
        var positivi_dataset = []
        var dates = []

        lodash.forEach(grouped,function(item, key){
            dates.push(moment(key).format('DD MMM'))
            negativi_dataset.push(item.filter( e => e.ESITO == "NEG").length)
            positivi_dataset.push(item.filter( e => e.ESITO == "POS").length)
        })

        negativi_dataset.reverse()
        positivi_dataset.reverse()
        dates.reverse()

        // Grafico positivi
        var ctx_pos = document.getElementById('grafico-tamponi-positivi').getContext('2d');
        if ( tamponiIZSChartPos ) { tamponiIZSChartPos.destroy(); }

        tamponiIZSChartPos = new Chart(ctx_pos, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Tamponi positivi',
                    fill: false,
                    backgroundColor: "#ff4444",
                    borderColor: "#CC0000",
                    data: positivi_dataset
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
        /*
        var negativi_dataset = []
        var negativi_dates = []
        lodash.forEach(grouped_negativi,function(item, key){
            negativi_dates.push(moment(key).format('DD MMM'))
            negativi_dataset.push(item.length)
        })*/
        
        // Grafico negativi
        var ctx_neg = document.getElementById('grafico-tamponi-negativi').getContext('2d');
        if ( tamponiIZSChartNeg ) { tamponiIZSChartNeg.destroy(); }

        tamponiIZSChartNeg = new Chart(ctx_neg, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Tamponi negativi',
                    fill: false,
                    backgroundColor: "#007E33",
                    borderColor: "#00FF00",
                    data: negativi_dataset
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
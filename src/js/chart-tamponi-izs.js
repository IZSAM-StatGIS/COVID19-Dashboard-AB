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

    axios.get('https://covid19-it-api.herokuapp.com/esiti/prov/daily',{ params:{
        sigla_prov: prov
    } }).then(function(response){
        const data = response.data

        var date_groups = lodash.groupBy(data,'DATA_TAMPONE')
        // console.log(date_groups)
        
        // Data integration
        const prov_array = ['AQ','CH','PE','TE']
        prov_array.forEach(prov => {
            lodash.forEach(date_groups,function(item, key){
                var contains_prov = lodash.filter(item,(o) => { return o.PROVINCIA == prov })
                if (contains_prov.length < 1){
                    item.push({'AGGIORNAMENTO':'','DATA_TAMPONE':key, 'PROVINCIA':prov, 'POSITIVI':0, 'NEGATIVI':0, 'DA_RIPETERE':0 })
                }
            })
        })
        // console.log(date_groups)

        var labels = lodash.map(date_groups, (item,key) => { return moment(key).format('DD MMM') })
        var negativi_dataset = []
        var positivi_dataset = []
        
        lodash.forEach(date_groups,function(item, key){
            // Populate dataset negativi
            let sum_negativi = item.reduce((total, currentValue) => {
                return total + currentValue.NEGATIVI;
            }, 0);    
            negativi_dataset.push(sum_negativi) 
            // Populate dataset positivi
            let sum_positivi = item.reduce((total, currentValue) => {
                return total + currentValue.POSITIVI;
            }, 0);    
            positivi_dataset.push(sum_positivi) 
            
            
        })
        
        // console.log(labels)
        // console.log(negativi_dataset)
        // console.log(positivi_dataset)

        // Grafico positivi
        var ctx_pos = document.getElementById('grafico-tamponi-positivi').getContext('2d');
        if ( tamponiIZSChartPos ) { tamponiIZSChartPos.destroy(); }

        tamponiIZSChartPos = new Chart(ctx_pos, {
            type: 'bar',
            data: {
                labels: labels,
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
                    text: 'Positivi per data prelievo',
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
        
        // Grafico negativi
        var ctx_neg = document.getElementById('grafico-tamponi-negativi').getContext('2d');
        if ( tamponiIZSChartNeg ) { tamponiIZSChartNeg.destroy(); }

        tamponiIZSChartNeg = new Chart(ctx_neg, {
            type: 'bar',
            data: {
                labels: labels,
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
                    text: 'Negativi per data prelievo',
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
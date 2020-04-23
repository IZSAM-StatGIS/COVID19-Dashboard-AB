import 'chart.js'
import 'chartjs-plugin-datalabels'
import moment from 'moment'
import chroma from 'chroma-js'
import $ from 'jquery'
import axios from 'axios'
import lodash from 'lodash'

var tamponiIZSChartPos;
var tamponiIZSChartNeg;

const tamponiIZSChartFn = function(){

    // Retrieve data from the server
    var positivi = []
    var negativi = []

    axios.get('https://covid19-it-api.herokuapp.com/comuni',{ params:{
        // sigla_prov:'TE'
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
                    enabled:false
                },
                plugins:{
                    datalabels: {
                        color: '#FFF',
                        anchor: 'end',
                        align: 'end',
                        labels: {
                            title: {
                                font: {
                                    weight: 'bold'
                                }
                            },
                            value: {
                                color: 'green'
                            }
                        },
                        formatter: function(value, context) {
                            return value.toFixed(0);
                        }
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
                    label: 'Tamponi positivi',
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
                    enabled:false
                },
                plugins:{
                    datalabels: {
                        color: '#FFF',
                        anchor: 'end',
                        align: 'end',
                        labels: {
                            title: {
                                font: {
                                    weight: 'bold'
                                }
                            },
                            value: {
                                color: 'green'
                            }
                        },
                        formatter: function(value, context) {
                            return value.toFixed(0);
                        }
                    }
                }
            }
            
        })

    })

    
}

export { tamponiIZSChartFn }
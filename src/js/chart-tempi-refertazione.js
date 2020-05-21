import 'chart.js'
import 'chartjs-plugin-datalabels'
import chroma from 'chroma-js'
import axios from 'axios'

var tempiRerertazioneChart;
const tempiRefertazioneChartFn = () => {
    axios.get('https://covid19-it-api.herokuapp.com/esiti/tempi').then(function(response){
        const data = response.data

        const tot_esaminati = data.reduce((prev,curr) => prev + curr.COUNT, 0)
        // console.log(tot_esaminati)
        var labels = data.map(d => parseLabel(d.TEMPO_REFERTAZIONE_GG))
        console.log(labels)

        // Color scale
        var scale = chroma.scale('RdYlGn').domain([10,0]);

        // Datasets
        var datasets   = []
        var bar_values = []
        var bar_colors = []

        data.forEach(d => {
            var t_ref = d.TEMPO_REFERTAZIONE_GG
            bar_values.push(d.COUNT)
            bar_colors.push(scale(t_ref).hex())
            // datasets.push({ "data": bar_data, "backgroundColor": scale(t_ref).hex() })
        })
        console.log(bar_values)
        console.log(bar_colors)

        var ctx = document.getElementById('grafico-tempi-refertazione').getContext('2d');
        if (tempiRerertazioneChart) { tempiRerertazioneChart.destroy(); }
    
        tempiRerertazioneChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels:labels,
                datasets: [{
                    data: bar_values,
                    backgroundColor: bar_colors
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Tempi di refertazione dei tamponi conferiti dalle Aziende sanitarie abruzzesi',
                    fontSize: 16,
                    fontColor: '#FFF'
                },
                responsive:true,
                maintainAspectRatio: false,
                legend:{
                    display: false,
                    position: 'right',
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
                            return (value*100/tot_esaminati).toFixed(2)+'%';
                        }
                    }
                }
            }
        })

    })
}

export { tempiRefertazioneChartFn }

const parseLabel = (label) => {
    if (label == '0'){
        return 'Stesso giorno'
    } else if (label == '1') {
        return 'Un giorno'
    } else {
        return `${label} giorni` 
    }
}
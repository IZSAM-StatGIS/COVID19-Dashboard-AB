import 'chart.js'
import 'chartjs-plugin-datalabels'
import moment from 'moment'
import chroma from 'chroma-js'
import $ from 'jquery'
import axios from 'axios'

var tamponiIZSChart;

const tamponiIZSChartFn = function(){
    axios.get('https://covid19-it-api.herokuapp.com/comuni',{ params:{
        sigla_prov:'TE'
    } }).then(function(response){
        console.log(response.data)
        if (response.data.ESITO == 'POS'){
            
        }
    })
}

export { tamponiIZSChartFn }
// OpenLayers Modules
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import {defaults as defaultControls, Attribution} from 'ol/control'
import {fromLonLat, getTransform} from 'ol/proj'
import {applyTransform} from 'ol/extent'
import {Tile as TileLayer} from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON'
import VectorImageLayer from 'ol/layer/VectorImage'
import VectorSource from 'ol/source/Vector'
import {Fill, Stroke, Style, Text, Image, Circle} from 'ol/style';
import XYZ from 'ol/source/XYZ'
import Overlay from 'ol/Overlay'

// Node Mosules
import axios from 'axios'
import moment from 'moment'
import chroma from 'chroma-js'
import $ from 'jquery'

import { andamentoChartNazFn, andamentoChartAbrFn } from './chart-andamento'
import { casiChartNazFn, casiChartAbrFn } from './chart-totale-casi-100k'
import { hospitalChartFn } from './chart-ospedalizzazione'

// Cluster Style
var getClusterLabel = function(feature){
	var text = feature.get('totale_casi');
	return text;
};

var clusterStyle = function(feature){

    const casi = parseInt(feature.get('totale_casi'));
    var zoomlevel = map.getView().getZoom()

    var radius;
    var fill = new Fill({color: 'rgba(255,68,68,.75)' });
    var stroke = new Stroke({color: '#FFF', width: 2});
    if (casi == 0) {
        radius = null;
        fill = null;
        stroke = null;
    } else if (casi <= 10){
        radius = 4
    } else if (casi <= 50){
        radius = 6
    } else if (casi >= 51 && casi <=100){
        radius = 8
    } else if (casi >= 101 && casi <=250){
        radius = 20
    } else if (casi >= 251 && casi <= 500){
        radius = 25
    } else if (casi >= 501 && casi <= 1000) {
        radius = 30
    } else if (casi >= 1001 && casi <= 2000) {
        radius = 35
    } else if (casi >= 2001 && casi <= 3500) {
        radius = 40
    } else {
        radius = 45
    }
        
    var cluster = new Style({
        image: new Circle({
            radius: radius * zoomlevel * 0.18,
            fill: fill,
	            stroke: stroke
        })
    });

    var label = new Style({
        text: new Text({
		    textAlign: 'center',
		    textBaseline: 'middle',
		    font: '10px Verdana',
		    overflow:false,
            text: feature.get('totale_casi').toString(),
		    fill: new Fill({color: '#000'}),
		    stroke: new Stroke({color: '#FFF', width: 3})
		})
    })

    if (zoomlevel > 7){
        return [cluster, label] 
    } else {
        return cluster
    }
};

// Map
// ************************************************************
var map = new Map({
    target: 'map',
    controls: defaultControls({attribution: false}).extend([
        new Attribution({
            collapsible: false
        })
    ]),
    layers: [
        // Base Layer
        new TileLayer({
            source: new XYZ({
                attributions:'Fonte &copy; <a href="http://www.protezionecivile.gov.it/" target="_blank">'+
                             'Sito del Dipartimento della Protezione Civile - Presidenza del Consiglio dei Ministri</a>',
                url: 'http://{a-c}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
            })
        })
    ],
    view: new View({
      center: fromLonLat([13.4662867,42.6572761]),
      zoom: 9
    })
});

// Map Layers
// ************************************************************
var provincesLayer = new VectorImageLayer({
    source: new VectorSource({
        format: new GeoJSON()
    })
})
map.addLayer(provincesLayer)
provincesLayer.set("name","Province")
provincesLayer.setZIndex(10)
provincesLayer.setOpacity(0.5)

// Label Layer
var labelsLayer = new TileLayer({
    source: new XYZ({
        url: 'http://{a-c}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png'
    })
})
map.addLayer(labelsLayer)
labelsLayer.set("name","Labels")
labelsLayer.setZIndex(11)

// Provinces Cluster
var provincesCluster = new VectorImageLayer({
    source: new VectorSource({
        format: new GeoJSON()
    }),
    style: clusterStyle
});
map.addLayer(provincesCluster);
provincesCluster.set("name","Cluster Province");
provincesCluster.setZIndex(13)


const apiUrl = "https://covid19-it-api.herokuapp.com"

// Get COVID19 Summary Data
// ************************************************************
var aggiornamento = "";
axios.get(apiUrl+'/andamento',{ params:{} }).then(function(response){
    aggiornamento = response.data[0].data;
    // Populate aggiornamento info box
    document.querySelector('#aggiornamento').innerHTML = moment(aggiornamento).format('DD MMM YYYY')
    // Populate region distribution and cluster layers
    getProvincesDistribution(aggiornamento)
    // Populate trend charts
    andamentoChartNazFn(response.data)
})

// Get COVID19 Summary Data for Abruzzo
// ************************************************************
axios.get(apiUrl+'/regioni',{ 
    params:{
        cod_reg: 13
    } }).then(function(response){
    // Populate trend chart 
    andamentoChartAbrFn(response.data)
    // Hospital charts
    hospitalChartFn('13','Abruzzo', 'grafico-hosp-abruzzo')
    hospitalChartFn('08','Emilia-Romagna', 'grafico-hosp-emilia')
    hospitalChartFn('05','Veneto', 'grafico-hosp-veneto')
    hospitalChartFn('03','Lombardia', 'grafico-hosp-lombardia')
})
/*
document.addEventListener('DOMContentLoaded',(e)=>{
    console.log('loaded')
    hospitalChartFn('13','Abruzzo', 'grafico-hosp-abruzzo')
    hospitalChartFn('08','Emilia-Romagna', 'grafico-hosp-emilia')
    hospitalChartFn('05','Veneto', 'grafico-hosp-veneto')
    hospitalChartFn('03','Lombardia', 'grafico-hosp-lombardia')
})*/


$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    
    if (e.target.id == 'hosp-tab'){
        // Hospital charts
        hospitalChartFn('13','Abruzzo', 'grafico-hosp-abruzzo')
        hospitalChartFn('08','Emilia-Romagna', 'grafico-hosp-emilia')
        hospitalChartFn('05','Veneto', 'grafico-hosp-veneto')
        hospitalChartFn('03','Lombardia', 'grafico-hosp-lombardia')
    }

})

// Get COVID19 Summary Data for Italy
// ************************************************************
axios.get(apiUrl+'/regioni',{ params:{}}).then(function(response){
    // Populate trend chart 
    casiChartNazFn(response.data)
})


// Get COVID19 Provinces Data for Abruzzo
// ************************************************************
axios.get(apiUrl+'/province',{ params:{ cod_reg: 13 }}).then(function(response){
    var chartData = []
    response.data.features.forEach(feature => {
        chartData.push(feature.properties)
    })
    // trend Chart for Each Province
    casiChartAbrFn(chartData)
})

// Get COVID19 Provinces Data
// ************************************************************
const getProvincesDistribution = function(aggiornamento){
    // 1 - Polygons
    axios.get(apiUrl+'/province/map',{
        params:{
            data: aggiornamento
        }
    }).then(function(response){
        provincesLayer.getSource().clear()
        // Spatial data
        var features = response.data.features;
        var abruzzo = []
        // Calculate color scale domain
        var color_scale_domain = []
        features.forEach(function(f){
            if (f.properties.codice_regione == 13) {
                abruzzo.push(f)
                color_scale_domain.push(f.properties.totale_casi)
            }
        })
        var collection = {"type": "FeatureCollection", "features": abruzzo};
        var featureCollection = new GeoJSON({featureProjection:'EPSG:3857'}).readFeatures(collection);
        // Update provinces layer
        provincesLayer.getSource().addFeatures(featureCollection);
        // Style Provinces
        var scale = chroma.scale('Reds').domain([0,Math.max.apply(Math, color_scale_domain)]);
        provincesLayer.getSource().forEachFeature(function (feature) {
            var provStyle;
            if (feature.get('totale_casi') == 0){
                provStyle = new Style({
                    stroke: new Stroke({ color: "#FFF", width: 2 }),
                    fill: new Fill({ color: '#98a1a6' })
                }); 
            } else {
                var provColor = scale(feature.get('totale_casi')).hex(); 
                provStyle = new Style({
                    stroke: new Stroke({ color: "#FFF", width: 2 }),
                    fill: new Fill({ color: provColor })
                }); 
            }
            feature.setStyle(provStyle); // set feature Style
        });
        // Set Extent
        var extent = provincesLayer.getSource().getExtent();
        map.getView().fit(extent, map.getSize());
    })

    // 2 - Cluster Provinces
    axios.get(apiUrl+'/province',{
        params:{
            data: aggiornamento
        }
    }).then(function(response){
        provincesCluster.getSource().clear()
        // Spatial data
        var features = response.data.features;
        var abruzzo = []
        features.forEach(function(f){
            if (f.properties.codice_regione == 13) {
                abruzzo.push(f)
            }
        })
        var collection = {"type": "FeatureCollection", "features": abruzzo};
        var featureCollection = new GeoJSON({featureProjection:'EPSG:3857'}).readFeatures(collection);
        // Update centroids layer
        provincesCluster.getSource().addFeatures(featureCollection);
    })

}




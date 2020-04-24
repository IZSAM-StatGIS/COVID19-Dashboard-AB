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

// Node Modules
import axios from 'axios'
import moment from 'moment'
import chroma from 'chroma-js'
import $ from 'jquery'

import { andamentoChartNazFn, andamentoChartAbrFn } from './chart-andamento'
import { casiChartNazFn, casiChartAbrFn } from './chart-totale-casi-100k'
import { tamponiIZSChartFn } from './chart-tamponi-izs'
import { hospitalChartFn } from './chart-ospedalizzazione'
import { hosp100kFn } from './chart-ospedalizzazione-100k'

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
            text: feature.get('sigla_provincia').toString()+": "+feature.get('totale_casi').toString(),
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
      center: fromLonLat([13.859,42.301]),	
      zoom: 9
    })
});

// Popup overlay
var popup = new Overlay({
    element: document.getElementById('popup')
});
map.addOverlay(popup);

// Map Layers
// ************************************************************

// Provinces layer
var provincesLayer = new VectorImageLayer({
    source: new VectorSource({
        format: new GeoJSON()
    })
})
map.addLayer(provincesLayer)
provincesLayer.set("name","Province")
provincesLayer.setZIndex(10)
provincesLayer.setOpacity(0.75)

// Municipalities
var comuniLayer = new VectorImageLayer({
    source: new VectorSource({
        format: new GeoJSON()
    })
})
map.addLayer(comuniLayer)
comuniLayer.set("name","Comuni")
comuniLayer.setZIndex(11)
// comuniLayer.setOpacity(0.5)

// Label Layer
var labelsLayer = new TileLayer({
    source: new XYZ({
        url: 'http://{a-c}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png'
    })
})
map.addLayer(labelsLayer)
labelsLayer.set("name","Labels")
labelsLayer.setZIndex(12)

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

// Mouse move
// ************************************************************
map.on('pointermove', function(e) {
	if (e.dragging) return;
    var pixel = e.map.getEventPixel(e.originalEvent);
    var hit = e.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
    	if (layer){
            var coordinate = e.coordinate;
            popup.setPosition(coordinate);
            var popupContent = document.getElementById('popup-content');
            if (layer.get('name')=='Comuni'){
                popupContent.innerHTML = "<p class='text-warning'><strong>"+feature.getProperties().COMUNE+" ("+feature.getProperties().PROVINCIA+")</strong></p>"
                                            + "<span class='text-white'>Tamponi Positivi/100k: "+((feature.get('POSITIVI')/feature.get('POP_2019'))*100000).toFixed(0)+"</span>"
                                            + "<br/><span class='text-white'>Tamponi Positivi: "+feature.getProperties().POSITIVI+"</span>"
                                            + "<br/><span class='text-white'>Tamponi Negativi: "+feature.getProperties().NEGATIVI+"</span>"
                                            + "<br/><span class='text-white'>Popolazione (2019): "+feature.getProperties().POP_2019+"</span>"
                                            + "<br/><span class='text-white'>Aggiornamento: "+moment(feature.getProperties().AGGIORNAMENTO).format('DD MMM YYYY')+"</span>"
            } else if (layer.get('name')=='Province'){
                popupContent.innerHTML = "<p class='text-warning'><strong>"+feature.getProperties().denominazione_provincia+"</strong></p>"
                                            +"<span class='text-white'>Casi totali: "+feature.getProperties().totale_casi+"</span>"
                                            +"<br/><span class='text-white'>Casi totali/100k: "+((feature.get('totale_casi')/feature.get('pop_2019'))*100000).toFixed(0)+"</span>"
            } else if (layer.get('name')=='Cluster Province'){
                // popupContent.innerHTML = "<p class='text-warning'><strong>"+feature.getProperties().denominazione_provincia+"</strong></p>";
            }
            return layer.get('name') === 'Comuni' || layer.get('name') === 'Province' /* || layer.get('name') === 'Cluster Province' */;
        }
    });
    if (hit){
        e.map.getTargetElement().style.cursor = 'pointer';
    } else {
        popup.setPosition(undefined);
        e.map.getTargetElement().style.cursor = '';
    }
});

/*
map.on('click',function(e){
    var pixel = e.map.getEventPixel(e.originalEvent);
    var hit = e.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
    	if (layer && layer.get('name') == 'Comuni'){
            // console.log(feature)
            $('#chartModal').modal('show')
        }
    })
})*/

const apiUrl = "https://covid19-it-api.herokuapp.com"

// Get COVID19 Summary Data
// ************************************************************
var aggiornamento = "";
axios.get(apiUrl+'/andamento',{ params:{} }).then(function(response){
    aggiornamento = response.data[0].data;
    // Populate aggiornamento info box
    document.querySelector('#aggiornamento').innerHTML = moment(aggiornamento).format('DD MMM YYYY, HH:mm')
    // Populate region distribution and cluster layers
    getProvincesDistribution(aggiornamento)
    // Populate municipalities distribution layer
    getComuniDistribution(aggiornamento)
    // Populate trend charts
    andamentoChartNazFn(response.data)
    // Populate tamponi IZS chart
    tamponiIZSChartFn()
})

// Get COVID19 Summary Data for Abruzzo
// ************************************************************
axios.get(apiUrl+'/regioni',{ 
    params:{
        cod_reg: 13
    } }).then(function(response){
    // Populate trend chart 
    andamentoChartAbrFn(response.data)
    // Last update
    var last = response.data.features[response.data.features.length - 1]
    // Populate badges
    document.querySelector('#info-tamponi').innerHTML = last.properties.tamponi
    document.querySelector('#info-totale-casi').innerHTML = last.properties.totale_casi
    document.querySelector('#info-totale-positivi').innerHTML = last.properties.totale_positivi
    document.querySelector('#info-nuovi-positivi').innerHTML = last.properties.nuovi_positivi
    document.querySelector('#info-ospedalizzati').innerHTML = last.properties.totale_ospedalizzati
    document.querySelector('#info-intensiva').innerHTML = last.properties.terapia_intensiva
    // console.log(last.properties)
})

/* Workaround to make Firefox correctly loading the pies */
/* ***************************************************** */
var hospChartsLoaded = false;
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    
    if (e.target.id == 'hosp-tab'){
        if (hospChartsLoaded == false){
            // Hospital charts
            hospitalChartFn('13','Abruzzo', 'grafico-hosp-abruzzo')
            hospitalChartFn('08','Emilia-Romagna', 'grafico-hosp-emilia')
            hospitalChartFn('05','Veneto', 'grafico-hosp-veneto')
            hospitalChartFn('03','Lombardia', 'grafico-hosp-lombardia')
            hospChartsLoaded = true;
        }
    }
})
/* ****************************************************** */

// Get COVID19 Summary Data for Italy
// ************************************************************
axios.get(apiUrl+'/regioni',{ params:{}}).then(function(response){
    // Populate trend chart 
    casiChartNazFn(response.data)
    hosp100kFn(response.data, aggiornamento)
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
                // console.log(f.properties)
                abruzzo.push(f)
                // scala valori assoluti
                // color_scale_domain.push(f.properties.totale_casi)
                // scala casi su 100k abitanti
                color_scale_domain.push((f.properties.totale_casi/f.properties.pop_2019)*100000)
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
                var provColor = scale((feature.get('totale_casi')/feature.get('pop_2019'))*100000).hex(); 
                provStyle = new Style({
                    stroke: new Stroke({ color: "#FFF", width: 2 }),
                    fill: new Fill({ color: provColor })
                }); 
            }
            feature.setStyle(provStyle); // set feature Style
        });
        // Set Extent
        // var extent = provincesLayer.getSource().getExtent();
        // map.getView().fit(extent, map.getSize());
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

// Get COVID19 Municipalities Data
// ************************************************************
const getComuniDistribution = function(aggiornamento){
    // 1 - Polygons
    axios.get(apiUrl+'/comuni/map',{
        params:{
            data: moment(aggiornamento).format('YYYY-MM-DD')
            // sigla_prov: 'TE'
        }
    }).then(function(response){
        comuniLayer.getSource().clear()
        // Spatial data
        var features = response.data.features;
        // Calculate color scale domain
        var color_scale_domain = []
        features.forEach(function(f){
            color_scale_domain.push((f.properties.POSITIVI/f.properties.POP_2019)*100000)
        })
        var collection = {"type": "FeatureCollection", "features": features};
        var featureCollection = new GeoJSON({featureProjection:'EPSG:3857'}).readFeatures(collection);
        // Update provinces layer
        comuniLayer.getSource().addFeatures(featureCollection);
        // Style Provinces
        var scale = chroma.scale('Blues').domain([0,Math.max.apply(Math, color_scale_domain)]);
        comuniLayer.getSource().forEachFeature(function (feature) {
            var comuniStyle;
            /*if (feature.get('POSITIVI') == 0){
                comuniStyle = new Style({
                    stroke: new Stroke({ color: "silver", width: 1 }),
                    fill: new Fill({ color: '#98a1a6' })
                }); 
            } else {*/
                var comuniColor = scale((feature.get('POSITIVI')/feature.get('POP_2019'))*100000).hex(); 
                comuniStyle = new Style({
                    stroke: new Stroke({ color: "silver", width: 1 }),
                    fill: new Fill({ color: comuniColor })
                }); 
            //}
            feature.setStyle(comuniStyle); // set feature Style
        });

    })
}

// Layer switcher
const layerBtn = document.querySelector("#layer-btn")
const layerPanel = document.querySelector("#layer-panel")
layerBtn.addEventListener('click',(e)=>{
    // e.preventDefault()
    if (layerPanel.style.visibility == 'hidden'){
        layerPanel.style.visibility = 'visible'
    } else {
        layerPanel.style.visibility = 'hidden'
    }    
});

document.querySelector("#prov-pt-toggler").addEventListener('change',(e)=>{
    if(e.target.checked) {
        provincesCluster.setVisible(true)
    } else {
        provincesCluster.setVisible(false)
    }
})

document.querySelector("#com-pl-toggler").addEventListener('change',(e)=>{
    if(e.target.checked) {
        comuniLayer.setVisible(true)
    } else {
        comuniLayer.setVisible(false)
    }
})

document.querySelector("#prov-pl-toggler").addEventListener('change',(e)=>{
    if(e.target.checked) {
        provincesLayer.setVisible(true)
    } else {
        provincesLayer.setVisible(false)
    }
})
/*
var legendContainer = document.querySelector('#legend-container')
var legendColors = chroma.brewer.OrRd
legendColors.forEach(color => {
    var legendElement = '<div class="color-step" style="background-color:'+color+'"></div>'
    legendContainer.innerHTML += legendElement
})
*/



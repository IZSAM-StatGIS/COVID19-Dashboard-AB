import './scss/main.scss'
import '@fortawesome/fontawesome-free/js/all'
// Bootstrap
import $ from 'jquery'
import 'popper.js'
import 'bootstrap'
// Bootstrap select
import 'bootstrap-select';
$.fn.selectpicker.Constructor.BootstrapVersion = '4';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
// Map script
import './js/map'

$("#prov-tamponi-select").selectpicker('val', ['TE','PE','AQ','CH']);
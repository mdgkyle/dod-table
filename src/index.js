import { tableTransform } from '@google/dscc';

const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');

// change this to 'true' for local development
// change this to 'false' before deploying
export const LOCAL = false;

function drawViz(data) {
  let database = data.tables.DEFAULT
  let metrics = []
  let rowNames = []
  let obj = { dates: [''] }

  // remove the svg if it already exists
  if (document.getElementById("myTable")) {
    let oldTable = document.getElementById("myTable").remove();
  }

  // create and add the canvas
  var canvasElement = document.createElement('canvas');
  var tableElement = document.createElement('table');
  tableElement.id = "myTable"
  var ctx = canvasElement.getContext('2d');
  canvasElement.id = 'myViz';
  document.body.appendChild(tableElement);
  var table = document.getElementById("myTable");
  
  data.fields.metricID.forEach(function (metric) {
    rowNames.push(metric['name'])
    obj[metric['name']] = [metric['name']]
  })

  var ctx = canvasElement.getContext('2d');

  database.forEach(function (column) {
    obj['dates'].push(column['dimID'][0])
    metrics.push(column['metricID'])
  })

  // insert the data
  rowNames.forEach(function (name, index) {
    metrics.forEach(function (item) {
      obj[name].push(item[index])
    })
  })
  
  // Insert header
  var header = table.insertRow(0);

  // Write the data
  obj['dates'].forEach(function (item, index) {
    var cell1 = header.insertCell(index);
    cell1.innerHTML = item;
  })
  rowNames.forEach(function (name, index) {
    var row = table.insertRow(index + 1);
    obj[name].forEach(function (item, cellIndex) {
      var cell1 = row.insertCell(cellIndex);
      cell1.innerHTML = item;
    })
  })


  // clear the canvas.
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // set the canvas width and height
  ctx.canvas.width = dscc.getWidth() - 20;
  ctx.canvas.height = dscc.getHeight() - 100;
}

// renders locally
if (LOCAL) {
  drawViz(local.message)
} else {
  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform});
}

window.addEventListener('message', function(e) {
  var message = e.data;
});

// bundle exposes the viewer / modeler via the BpmnJS variable
var BpmnViewer = window.BpmnJS;

var viewer = new BpmnViewer({
  container: '#canvas'
});


function Modeler() {}

Modeler.prototype.doubleClickCallback = undefined;

Modeler.prototype = {

  createDiagram: function() {
    viewer.createDiagram(function(err) {

      if (err) {
        console.log('error when createDiagram');
      } else {
        console.log('createDiagram successful');
      }

    });
  },

  getXML: function() {
    viewer.saveXML({ format: true }, function(err, xml) {

      if (err) {
        console.error('diagram save failed', err);
      } else {
        window.parent.postMessage(xml, '*');
      }
    });
  },

  loadXML: function(xml) {
    viewer.importXML(xml, function(err) {

      if (err) {
        console.log('error rendering', err);
      } else {
        console.log('rendered');
      }
    });
  },

  loadXMLFile: function(xmlFile) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        viewer.importXML(xhr.response, function(err) {
          // ...
        });
      }
    };

    xhr.open('GET', xmlFile, true);
    xhr.send(null);
  },

  parameters: function(pars) { //ToBe refactored  
    // ToDo 
  },

  suscribeToDoubleClick: function(callback) {
    this.doubleClickCallback = callback;
  },

}

var processModeler = window.Modeler;
var modeler = new processModeler();

var eventBus = viewer.get('eventBus');

eventBus.on('element.dblclick', function(e) {
  if (modeler.doubleClickCallback) {
    var shape = getShapeObject(e.element);
    modeler.doubleClickCallback(JSON.stringify(shape));
  } else {
    // no-op
  }
});

function Shape(id, bmpnType) {
  this.id = id;
  this.bmpnType = bmpnType;
}

function getShapeObject(element) {
  return new Shape(element.id, element.type);
}

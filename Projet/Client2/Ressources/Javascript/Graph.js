var graph;
var canvas;
var ctx;
var mignatureSize = 50;
var graphCenter;
var algoNPlusUn = false;
var renduSVG = false;
var zoom = 1;
var HTML = true;
var dataMatrice = false;

$(document).ready(function(){

	
	canvas = $("#canvas").get(0);
	ctx = canvas.getContext('2d'); 
	ctx.canvas.width  = $("#main").innerWidth();
	ctx.canvas.height = $("#main").innerHeight();
	$("#canvas").width($("#main").innerWidth());
	graphCenter = {"x": $("#main").width() / 2, "y": $("#main").height() / 2};
	graph = new Graph();
});

function Graph(options) {
	  this.options = options || {};
	  this.nodeSet = {};
	  this.nodes = [];
	  this.edges = [];
	  this.layout;
	}


	Graph.prototype.addNode = function(node) {
	  if(this.nodeSet[node.id] == undefined && !this.reached_limit()) {
	    this.nodeSet[node.id] = node;
	    this.nodes.push(node);
	    return true;
	  }
	  return false;
	};

	Graph.prototype.getNode = function(node_id) {
	  return this.nodeSet[node_id];
	};
	
	Graph.prototype.getNodes = function(){
		return this.nodeSet;
	}

	Graph.prototype.clearNodes = function() {
		this.nodeSet = {};
		this.nodes = [];
		this.edges = [];
	};	
	
	Graph.prototype.addEdge = function(source, target) {
	  if(source.addConnectedTo(target) === true) {
	    var edge = new Edge(source, target);
	    this.edges.push(edge);
	    return true;
	  }
	  return false;
	};

	Graph.prototype.reached_limit = function() {
	  if(this.options.limit != undefined)
	    return this.options.limit <= this.nodes.length;
	  else
	    return false;
	};


	function Node(node_id, x, y, width, height) {
	  this.id = node_id;
	  this.width = width || 0;
	  this.height = height || 0;
	  this.center = {"x" : x, "y" : y};
	  this.position = {"x" : this.center.x - (this.width/2)  + graphCenter.x, "y" : this.center.y - (this.height/2) + graphCenter.y};
	  this.position2 = {"x" : this.center.x + (this.width/2)  + graphCenter.x, "y" : this.center.y + (this.height/2) + graphCenter.y};
	  this.nodesTo = [];
	  this.nodesFrom = [];
	  this.data = {};
	}
	
	Node.prototype.addConnectedTo = function(node) {
	  if(this.connectedTo(node) === false) {
	    this.nodesTo.push(node);
	    return true;
	  }
	  return false;
	};

	Node.prototype.connectedTo = function(node) {
	  for(var i=0; i < this.nodesTo.length; i++) {
	    var connectedNode = this.nodesTo[i];
	    if(connectedNode.id == node.id) {
	      return true;
	    }
	  }
	  return false;
	};


	function Edge(source, target) {
	  this.source = source;
	  this.target = target;
	  this.data = {};
	}
	
	function drawNode(node) {
		
	    if (canvas.getContext)
	    {    
	        
	        var img=new Image();
	        img.src="../Server/index.php?controller=image&action=getImg&id="+node.id+"&t=" + mignatureSize;
	        // on attend le chargement complet de l'image pour l'insérer dans le canvas
	        jQuery(img).load(function() {
		        node.width = img.width;
		        node.height = img.height;
		  	    console.log(node.center);
		  	    console.log(zoom);

		        node.position = {"x" : (node.center.x * zoom) - (node.width/2) + graphCenter.x, "y" : (node.center.y * zoom) - (node.height/2) + graphCenter.y};
		  	  	node.position2 = {"x" : (node.center.x * zoom) + (node.width/2) + graphCenter.x, "y" : (node.center.y * zoom) + (node.height/2) + graphCenter.y};
		  	  //  console.log(node.position);
		  	  	ctx.fillRect(node.position.x, node.position.y, img.width, img.height);       // afficher un rectangle plein
		        ctx.drawImage(img,node.position.x, node.position.y, img.width, img.height);
	        });

			
	    } 
		
	}
	


	function drawEdge(edge) {

		if (canvas.getContext) {
			ctx.moveTo(edge.source.center.x * zoom + graphCenter.x, edge.source.center.y* zoom + graphCenter.y);			
			ctx.lineTo(edge.target.center.x * zoom + graphCenter.x, edge.target.center.y *zoom + graphCenter.y);
		    ctx.lineWidth = 0.2;
			ctx.stroke();	
		}
	}

	function request(id, nbNeighbours){
		
		if(!algoNPlusUn){ 			
			$.ajax({
				  url: '../Server/index.php',
				  dataType: 'json',
				  cache: false,
				  data:  {"controller" : "voisinsN", "id" : id, "nn" : nbNeighbours, "action" : "getVoisinsN", "w": canvas.width, "h": canvas.height},
				  success: function(data) {
						graph.clearNodes();
						var liens = data.liens;
						var positions = data.positions;
						for(var i in positions){
							var node = new Node(positions[i][0], positions[i][1], positions[i][2]);
							graph.addNode(node);
						}	
						for(var i in liens)			
							graph.addEdge(graph.getNode(liens[i][0]), graph.getNode(liens[i][1]));
					
						draw();

				  }
			});	
		}
		else{
			$.ajax({
				  url: '../Server/index.php',
				  dataType: 'json',
				  cache: false,
				  data:   {"controller" : "voisinsNPlusUn", "id" : id, "nn" : nbNeighbours, "nnPlusUn" : nbNeighbours, "action" : "getVoisinsNPlusUn", "w": canvas.width, "h": canvas.height},
				  success: function(data) {
						graph.clearNodes();
						var liens = data.liens;
						var positions = data.positions;
						for(var i in positions){
							var node = new Node(positions[i][0], positions[i][1], positions[i][2]);
							graph.addNode(node);
						}	
						for(var i in liens)			
							graph.addEdge(graph.getNode(liens[i][0]), graph.getNode(liens[i][1]));
					
						draw();

				  }
			});	
			}
			
		
		
			 
	}
	
	function draw(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.width = canvas.width;
		
		for(var i in graph.edges)				
			drawEdge(graph.edges[i]);				

		for(var i in graph.nodes)
			drawNode(graph.nodes[i]);
		
	}
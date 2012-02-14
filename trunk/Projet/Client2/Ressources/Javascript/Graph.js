var graph;
var canvas;
var ctx;
var graphCenter;
var ratio = 360;
$(document).ready(function(){
	canvas = $("#canvas").get(0);
	ctx = canvas.getContext('2d'); 
	ctx.canvas.width  = $("#main").innerWidth();
	ctx.canvas.height = $("#main").innerHeight();
	$("#canvas").width($("#main").innerWidth());
	console.log($("#canvas"));
	graphCenter = {"x": $("#main").width() / 2, "y": $("#main").height() / 2};

	graph = new Graph();

	request(1, 49);
	
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
	  this.width = width || 50;
	  this.height = height || 37.5;
	  this.center = {"x" : x + graphCenter.x, "y" : y + graphCenter.y};
	  this.position = {"x" : this.center.x - (this.width/2), "y" : this.center.y - (this.height/2)};
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
	        ctx.fillRect(node.position.x, node.position.y, node.width, node.height);       // afficher un rectangle plein
	        
	        var img=new Image();
	        img.id ='test';
	        img.src="../Server/data/img/"+node.id+".jpg";
	        ctx.drawImage(img,node.position.x, node.position.y, node.width, node.height);
			
	    } 
		
	}
	


	function drawEdge(edge) {

		if (canvas.getContext) {
			ctx.moveTo(edge.source.center.x, edge.source.center.y);			
			ctx.lineTo(edge.target.center.x, edge.target.center.y);
		    ctx.lineWidth = 0.1;
			ctx.stroke();	
		}

	}

	function request(id, nbNeighbours){
		$.getJSON('../Server/index.php?controller=image&action=getSignifV1&id='+id+'&nn='+nbNeighbours+'', function(data) {
			var liens = data.liens;
			var positions = data.positions;
			for(var i in positions){
				var node = new Node(positions[i][0], positions[i][1] * ratio, positions[i][2] * ratio);
				graph.addNode(node);
			}	
			for(var i in liens){				
				graph.addEdge(graph.getNode(liens[i][0]), graph.getNode(liens[i][1]));
				drawEdge(graph.edges[i]);				
			}
			for(var i=0; i<graph.nodes.length; i++)
				drawNode(graph.nodes[i]);


		});
	}
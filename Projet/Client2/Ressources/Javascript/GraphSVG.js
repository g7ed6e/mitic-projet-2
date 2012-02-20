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
var mySvg;

$(document).ready(function(){

	
	canvas = $("#canvas").get(0);
	ctx = canvas.getContext('2d'); 
	ctx.canvas.width  = $("#main").innerWidth() - $("#zoomDiv").innerWidth();
	ctx.canvas.height = $("#main").innerHeight()-$("#canvas").get(0).offsetTop-$("#footer").innerHeight()-10;
	$("#svgDiv").width(ctx.canvas.width);
	$("#svgDiv").height(ctx.canvas.height);
	graphCenter = {"x":ctx.canvas.width / 2, "y": ctx.canvas.height / 2};
	$("#fg").css("left", 0).css("top", $("#canvas").get(0).offsetTop + graphCenter.y-23+"px").click(function(){
		graphCenter.x -= 75;
		draw();
	});
	$("#fd").css("left", ctx.canvas.width-35).css("top", $("#canvas").get(0).offsetTop + graphCenter.y-23 +"px").click(function(){
		graphCenter.x += 75;
		draw();
	});
	$("#fh").css("left", graphCenter.x-24).css("top", $("#canvas").get(0).offsetTop).click(function(){
		graphCenter.y -= 75;
		draw();
	});
	$("#fb").css("left", graphCenter.x-24).css("top", $("#canvas").get(0).offsetTop + ctx.canvas.height -35+"px").click(function(){
		graphCenter.y += 75;
		draw();
	});

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
	function request(id, nbNeighbours){
		
		if(!algoNPlusUn){ 			
			$.ajax({
				  url: '../Server/index.php',
				  dataType: 'json',
				  cache: true,
				  data:  {"controller" : "score", "id" : id, "nn" : nbNeighbours, "action" : "getScoreV2", "w": (canvas.width - 50), "h": (canvas.height - 50), "s": "0" },
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
				  cache: true,
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
		
		mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		mySvg.setAttribute("version", "1.2");
        mySvg.setAttribute("baseProfile", "tiny");
		
		while (document.getElementById("svgDiv").hasChildNodes()) {
			document.getElementById("svgDiv").removeChild(document.getElementById("svgDiv").firstChild);
		}
        document.getElementById("svgDiv").appendChild(mySvg);
		
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.width = canvas.width;
		
		for(var i in graph.edges)				
			drawEdge(graph.edges[i]);				

		for(var i in graph.nodes)
			drawNode(graph.nodes[i]);
		
	}
	
		function drawNode(node){
		/* if (canvas.getContext)
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
	    } */
		
		img=new Image();
	    img.src="../Server/index.php?controller=image&action=getImg&id="+node.id+"&t=50";
		jQuery(img).load(function() {
		
		        node.width = img.width;
		        node.height = img.height;
		  	    console.log(node.center);
		  	    console.log(zoom);
				
			var imgX = Math.round( (node.center.x * zoom) - (node.width/2) + graphCenter.x );
			var imgY = Math.round( (node.center.y * zoom) - (node.height/2) + graphCenter.y );
			var imgWidth = Math.round(img.width);
			var imgHeight = Math.round(img.height);

			var myImg = document.createElementNS("http://www.w3.org/1999/svg",	"image");
			myImg.setAttribute("x",imgX);
			myImg.setAttribute("y",imgY);
			myImg.setAttribute("width",imgWidth);
			myImg.setAttribute("height",imgHeight);
			myImg.setAttribute("xlink:href","../Server/index.php?controller=image&action=getImg&id="+node.id+"&t=50");
							
			mySvg.appendChild(myImg);		
		});
	}
	function drawEdge(edge){
	
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", Math.round(edge.source.center.x * zoom + graphCenter.x));
                line.setAttribute("y1", Math.round(edge.source.center.y * zoom + graphCenter.y));
                line.setAttribute("x2", Math.round(edge.target.center.x * zoom + graphCenter.x));
                line.setAttribute("y2", Math.round(edge.target.center.y * zoom + graphCenter.y));
                line.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:1");
				
	/*	var ligne = $("<line x1=\""+Math.round(edge.source.center.x * zoom + graphCenter.x)+
				"\" y1=\""+Math.round(edge.source.center.y* zoom + graphCenter.y)+
				"\" x2=\""+Math.round(edge.target.center.x * zoom + graphCenter.x)+
				"\" y2=\""+Math.round(edge.target.center.y *zoom + graphCenter.y)+
				"\" style=\"stroke:rgb(0,0,0);stroke-width:1\" />");*/
		/*$("#svgDiv").prepend($("<line x1=\""+Math.round(edge.source.center.x * zoom + graphCenter.x)+
				"\" y1=\""+Math.round(edge.source.center.y* zoom + graphCenter.y)+
				"\" x2=\""+Math.round(edge.target.center.x * zoom + graphCenter.x)+
				"\" y2=\""+Math.round(edge.target.center.y *zoom + graphCenter.y)+
				"\" style=\"stroke:rgb(0,0,0);stroke-width:1\" />"));*/
		
		mySvg.appendChild(line);
	}
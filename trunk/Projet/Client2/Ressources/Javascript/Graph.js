var graph;
var mignatureSize = 50;
var graphCenter;
var algoNPlusUn = false;
var zoom = 1;
var HTML = true;
var webGL = false;
var renduSVG = false;

//var isClicked = true;
var rouge = 'rgba(255,0,0,1)';
var orange = 'rgba(255,140,0,1)';
var jaune = 'rgba(255,215,0,1)';
var vert = 'rgba(0,255,0,1)';
var pas;
var graphDimension;

$(document).ready(function() {

	$("#fg").click(function() {
		graphCenter.x -= 75;
		draw();
	});

	/*
	 * $("#fg").mousedown(function(){ if(isClicked){ setTimeout(function(){
	 * graphCenter.x -= 25; draw(); $("#fg").trigger('mousedown'); },100); }
	 * }).mouseup(function(){ alert("mouseUp"); //isClicked = false; });
	 */
	/*
	 * document.getElementById("fg").addEventListener('touchstart',touchEvent,false);
	 * 
	 * function touchEvent(){ if(isClicked){ setTimeout(function(){
	 * graphCenter.x -= 25; draw(); touchEvent(); },100); }else isClicked =
	 * true; }
	 * 
	 * document.getElementById("fg").addEventListener('touchend',function(){
	 * isClicked = false; },false);
	 */
	$("#fd").click(function() {
		graphCenter.x += 75;
		draw();
	});
	$("#fh").click(function() {
		graphCenter.y -= 75;
		draw();
	});
	$("#fb").click(function() {
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
	if (this.nodeSet[node.id] == undefined && !this.reached_limit()) {
		this.nodeSet[node.id] = node;
		this.nodes.push(node);
		return true;
	}
	return false;
};

Graph.prototype.getNode = function(node_id) {
	return this.nodeSet[node_id];
};

Graph.prototype.getNodes = function() {
	return this.nodeSet;
}

Graph.prototype.clearNodes = function() {
	this.nodeSet = {};
	this.nodes = [];
	this.edges = [];
};

Graph.prototype.addEdge = function(source, target, score) {
	if (source.addConnectedTo(target) === true) {
		var edge = new Edge(source, target, score);
		this.edges.push(edge);
		return true;
	}
	return false;
};

Graph.prototype.reached_limit = function() {
	if (this.options.limit != undefined)
		return this.options.limit <= this.nodes.length;
	else
		return false;
};

function Node(node_id, x, y, width, height) {
	this.id = node_id;
	this.width = width || 0;
	this.height = height || 0;
	this.center = {
		"x" : x,
		"y" : y
	};
	this.position = {
		"x" : this.center.x - (this.width / 2) + graphCenter.x,
		"y" : this.center.y - (this.height / 2) + graphCenter.y
	};
	this.position2 = {
		"x" : this.center.x + (this.width / 2) + graphCenter.x,
		"y" : this.center.y + (this.height / 2) + graphCenter.y
	};
	this.nodesTo = [];
	this.nodesFrom = [];
	this.data = {};
}

Node.prototype.addConnectedTo = function(node) {
	if (this.connectedTo(node) === false) {
		this.nodesTo.push(node);
		return true;
	}
	return false;
};

Node.prototype.connectedTo = function(node) {
	for ( var i = 0; i < this.nodesTo.length; i++) {
		var connectedNode = this.nodesTo[i];
		if (connectedNode.id == node.id) {
			return true;
		}
	}
	return false;
};

function Edge(source, target, score) {
	this.source = source;
	this.target = target;
	this.score = score;
	this.data = {};
}

function request(id, nbNeighbours) {

	if (!algoNPlusUn) {
		$.ajax({
			url : '../Server/index.php',
			dataType : 'json',
			cache : true,
			data : {
				"controller" : "score",
				"id" : id,
				"nn" : nbNeighbours,
				"action" : "getScoreV2",
				"w" : (graphDimension.width - 50),
				"h" : (graphDimension.height - 50),
				"s" : "1"
			},
			success : function(data) {
				graph.clearNodes();
				var liens = data.liens;
				findPas(liens);
				var positions = data.positions;
				for ( var i in positions) {
					var node = new Node(positions[i][0], positions[i][1],
							positions[i][2]);
					graph.addNode(node);
				}
				for ( var i in liens)
					graph.addEdge(graph.getNode(liens[i][0]), graph
							.getNode(liens[i][1]), liens[i][2]);

				draw();

			}
		});
	} else {
		$.ajax({
			url : '../Server/index.php',
			dataType : 'json',
			cache : true,
			data : {
				"controller" : "voisinsNPlusUn",
				"id" : id,
				"nn" : nbNeighbours,
				"nnPlusUn" : nbNeighbours,
				"action" : "getVoisinsNPlusUn",
				"w" : graphDimension.width,
				"h" : graphDimension.height
			},
			success : function(data) {
				graph.clearNodes();
				var liens = data.liens;
				var positions = data.positions;
				for ( var i in positions) {
					var node = new Node(positions[i][0], positions[i][1],
							positions[i][2]);
					graph.addNode(node);
				}
				for ( var i in liens)
					graph.addEdge(graph.getNode(liens[i][0]), graph
							.getNode(liens[i][1]), liens[i][2]);

				draw();

			}
		});
	}

}

function draw() {

	clearGraph();

	for ( var i in graph.edges)
		drawEdge(graph.edges[i]);

	for ( var i in graph.nodes)
		drawNode(graph.nodes[i]);

}

function resized(){
	$("#zoneGraph").get(0).width  = $("#main").innerWidth() - $("#zoomDiv").innerWidth();
	$("#zoneGraph").get(0).height = $("#main").innerHeight()-$("#zoneGraph").get(0).offsetTop-$("#footer").innerHeight()-10;
	graphDimension = {"width":$("#zoneGraph").get(0).width, "height": $("#zoneGraph").get(0).height};
	graphCenter = {"x":$("#zoneGraph").get(0).width / 2, "y": $("#zoneGraph").get(0).height / 2};
	$("#fg").css("left", 0).css("top", $("#zoneGraph").get(0).offsetTop + graphCenter.y-23+"px");
	$("#fd").css("left", $("#zoneGraph").get(0).width-35).css("top", $("#zoneGraph").get(0).offsetTop + graphCenter.y-23 +"px");
	$("#fh").css("left", graphCenter.x-24).css("top", $("#zoneGraph").get(0).offsetTop);
	$("#fb").css("left", graphCenter.x-24).css("top", $("#zoneGraph").get(0).offsetTop + $("#zoneGraph").get(0).height -35+"px");
}

function findPas(liens){
	var maxPas = 0;
	var minPas = 1;
	for(var i =0; i<liens.length; i++){
		if(liens[i][2] > maxPas)
			maxPas = liens[i][2];
		
		if(liens[i][2] < minPas)
			minPas = liens[i][2]; 
	}
	pas = (maxPas-minPas)/4;
}

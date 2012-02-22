var graph;
var mignatureSize = 50;
var graphCenter;
var algoNPlusUn = false;
var zoom = 1;
var HTML;
var webGL = false;
var renduSVG = false;

//var isClicked = true;
var pas;
var graphDimension;

$(document).ready(function() {

	

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
				"action" : "getScoreV3",
				"w" : (graphDimension.width - 50),
				"h" : (graphDimension.height - 50),
				"s" : "1"
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
	} else {
		$.ajax({
			url : '../Server/index.php',
			dataType : 'json',
			cache : true,
			data : {
				"controller" : "distance",
				"id" : id,
				"nn" : nbNeighbours,
				"action" : "getDistances",
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


//choix de la couleur en fonction du score
function choixCouleur(score){
	if (score <= 0.4){//dans les tons vert
		var rouge = Math.round(score*255);
		var vert = 255;
	}
	else if ((score > 0.4)&&(score <= 0.7)){//dans les tons jaune
		var rouge = 255;
		var vert = Math.round((1-score)*230);
	}
	else if ((score > 0.7)&&(score <= 0.9)){//dans les tons orange
		var rouge = 255;
		var vert = Math.round((1-score)*140);
	}
	else if ((score > 0.9)){//dans les tons rouge
		var rouge = Math.round(score*255);
		var vert = Math.round((1-score)*140);
	}
	return 'rgba('+rouge+','+vert+',0,1)';
}

// fonction pour positionner les flèches de déplacement
function setArrows(){
	$("#fg").css("left", 0)
		.css("top", $("#zoneGraph").get(0).offsetTop + graphCenter.y-23+"px");
		
	$("#fd").css("left", $("#zoneGraph").width()-35)
		.css("top", $("#zoneGraph").get(0).offsetTop + graphCenter.y-23 +"px");
		
	$("#fh").css("left", ($("#main").innerWidth() - $("#zoomDiv").innerWidth())/2 )
		.css("top", $("#zoneGraph").get(0).offsetTop);
		
	$("#fb").css("left", ($("#main").innerWidth() - $("#zoomDiv").innerWidth())/2 )
		.css("top", $("#main").innerHeight()-$("#main").get(0).offsetTop-$("#footer").innerHeight()-40+"px");
}

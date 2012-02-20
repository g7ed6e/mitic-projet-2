var min = 0;
var max = 19;
var midValue = Math.round((max-min)/2);
var hoveredImageId = -1;
var debugMousePos = false;
var searchInputDefaultText = "Veuillez saisir un identifiant d'image";
var histoVisible = false;
var filterVisible = false;
var popupShown = false;
var clicked = false;
var debut;
var dragDeplacementDelta;
var compteur = 0;
var histo = new Array();
var nbhist = 0;
var close = true;
var close2 = true;
function mon_erreur(nouvelle,fichier,ligne)
{
 erreur = "Message d'erreur:\n"+ nouvelle+"\n"+fichier+"\n"+ligne;
 affiche_erreur();
 return true;
}

function affiche_erreur()
{
 alert(window.erreur)
}
$(document).ready(function(){
	
	//window.onerror = mon_erreur;
	  $('#canvas').bind( 'swipe', function( e ) {
			/*graphCenter.x -= 150;
			draw();
		    e.stopImmediatePropagation();
		    return false;*/
		  } );  
	  

/*
	  $('#canvas').bind( 'swiperight', function( e ) {
			graphCenter.x += 150;
			draw();
		    e.stopImmediatePropagation();
		    return false;
		  } ); 
	  
	  $('#canvas').bind( 'swipeup', function( e ) {
			graphCenter.y -= 150;
			draw();
		    e.stopImmediatePropagation();
		    return false;
		  } ); 
	  $('#canvas').bind( 'swipedown', function( e ) {
			graphCenter.y += 150;
			draw();
		    e.stopImmediatePropagation();
		    return false;
		  } ); */
	
	//resized();
	remplirSlider();
	$("#linkImg1, #linkImg2, #linkImg3, #linkImg4, #linkImg5," +
		" #linkImg6, #linkImg7, #linkImg8, #linkImg9, #linkImg10," +
		" #linkImg11, #linkImg12, #linkImg13, #linkImg14, #linkImg15," +
		" #linkImg16, #linkImg17, #linkImg18, #linkImg19, #linkImg20").click(function(){
		remplirSearch(this);
	});
	$("#choixRendu , #choixData, #choixNiveau").buttonset();
	$("#choixRendu input, #choixData input, #choixNiveau input").change(function(){
		evenement(this);
	});
	$("#canvas").mousedown(function(evt){
		clicked = true;
		debut = {"x" : evt.clientX, "y" : evt.clientY};
	}).mouseup(function(){
		draw();
		clicked = false;
	}).mousemove(function(evt){
		if(clicked) $("#canvas").trigger('dragCanvas', [{"x" : evt.clientX, "y" : evt.clientY}]);
	});

	$("#canvas").bind('dragCanvas', function(evt, param){
		compteur++;
		dragDeplacementDelta = {"x" : debut.x - param.x, "y" : debut.y - param.y};
		graphCenter.x -= dragDeplacementDelta.x;
		graphCenter.y -= dragDeplacementDelta.y;
		if(compteur  %6 == 0 )draw();
		debut = param;
	});

	$("#nbNeighboursInput").val(midValue).keyup(function(event){
		if(!(this.value.toString().search(/^[0-9]+$/) == 0))
			this.value = this.value.substring(0, this.value.length-1);
		else{
			$("#slider").slider('value', this.value);
			zoomChange($("#slider").slider('value'));
		}
	});
	$("#slider").slider({
		max : max,
		min : min,
		value : midValue,
		step : 1,
		orientation : 'vertical',
		stop : function(event, ui){
		zoomChange(ui.value);
	},
	slide : function(event, ui){
		$("#nbNeighboursInput").val(ui.value);
	}
	});
	$("#topLabelSlider").html(max);
	$("#bottomLabelSlider").html(min);
	$("#btnOk").button();
	$("#btnOk").click(ok);

	$("#searchInput").keypress(okKeypressedEnter).focus(function(){
		if($(this).val() == searchInputDefaultText)
		{
			$(this).val('').css('color', '#000000').css('font-style', 'normal');
		}
	}).blur(function(){
		if ($(this).val() == "")
		{
			$(this).attr('value', searchInputDefaultText).css('font-style', 'italic').css('color', '#aaa');
		}
	}).attr('value', searchInputDefaultText);


	$(canvas).mousemove(function(evt){
		var mousePos = getMousePos(canvas, evt);
		if(debugMousePos){
			var message = "Mouse position: " + mousePos.x + "," + mousePos.y;
			if(debugMousePos) writeMessage(canvas, message);
		}
		//testImageHover(mousePos);
	}).mousedown(function(evt){
		var mousePos = getMousePos(canvas, evt);
		var nodeId = getImageId(mousePos);
		if (nodeId != -1)
		{
			hoveredImageId = nodeId;
		}
	}).mouseup(function(evt){
		var mousePos = getMousePos(canvas, evt);
		var nodeId = getImageId(mousePos); 
		if(popupShown) $(".popupImageDetails").remove();
		if ((nodeId != -1)&&(hoveredImageId == nodeId))
		{
			var img = new Image();
			img.src = '../Server/index.php?controller=image&action=getImg&id='+nodeId+'&t=200';
			jQuery(img).load(function() {
				$(this).css('width', img.width).css('height', img.height).css('margin', 10);
				$(".popupImageDetails").css("width", img.width + 20).css('height', img.height + 50);
				$("#main").append("<div class='popupImageDetails'><br /><button>Centrer l\'image</button></div>");
				$(".popupImageDetails").prepend(img);
				$(".popupImageDetails > button").bind('click', function(){
					saveHisto(nodeId);
					request(nodeId, $("#nbNeighboursInput").val());
					$("#searchInput").val(nodeId);
					$(".popupImageDetails").remove();
				}).button();
				positionnePopup(canvas, mousePos, nodeId);
			});
		}
		else hoveredImageId = -1;
	});

	$(window).resize(function() {
		resized();
		draw();
	});
	
	$("#graphSaver").click(function() { 
		// save canvas image as data url (png format by default)
		$("#graphSaver").attr("href", canvas.toDataURL());
	});
	$("#zoomP").click(function(){		
		zoom *= 2;
		draw();
	}).button();
	$("#zoomM").click(function(){
		if(zoom != 1){
			zoom *= 0.5;
			draw();
		}
	}).button();
	$("#b1").button().click(function(){
		if(close){
			showHisto();
			close = false;
		}else{
			close = true;	
		}
		$(this).next("ul").toggle();
	//}).blur(function(e){
		//if(!close){
		//$(this).next("ul").toggle();
		//close = true;
		//}
	});
	$("#b2").button().click(function(){
		if(close2){
			close2 = false;
		}else{
			close2 = true;	
		}
		$(this).next("ul").toggle();
	//}).blur(function(e){
		//if(!close){
		//$(this).next("ul").toggle();
		//close = true;
		//}
	});
});

function resized(){
	ctx.canvas.width  = $("#main").innerWidth() - $("#zoomDiv").innerWidth();
	ctx.canvas.height = $("#main").innerHeight()-$("#canvas").get(0).offsetTop-$("#footer").innerHeight()-10;
	graphCenter = {"x":ctx.canvas.width / 2, "y": ctx.canvas.height / 2};

	$("#fg").css("left", 0).css("top", $("#canvas").get(0).offsetTop + graphCenter.y-23+"px");
	$("#fd").css("left", ctx.canvas.width-35).css("top", $("#canvas").get(0).offsetTop + graphCenter.y-23 +"px");
	$("#fh").css("left", graphCenter.x-24).css("top", $("#canvas").get(0).offsetTop);
	$("#fb").css("left", graphCenter.x-24).css("top", $("#canvas").get(0).offsetTop + ctx.canvas.height -35+"px");
}
function okKeypressedEnter(event){
	if ( event.which == 13 ) { ok(); }
}
function searchKeypressedEnter(event){
	if ( event.which == 13 ) { search(); }
}
function ok(){
	$('.index').animate({
		opacity: 0
	},500, function(){
		$('#header').animate({
			top: '0'
		},500,function() {

			$('#main, #nbNeighbours, #zoomSlider').animate({
				opacity : 100
			},5000,function() {});

		});
		$('#chooser').animate({
			opacity : 0
		},1000,function() {});
		$('#chooser').animate({
			width : 0
		},100,function() {});
		$('#chooser').animate({
			height : 0
		},100,function() {});
		$('#radio, #bloc, #logo, #menu_gauche, #menu_droite, #canvas, .fleche').show().animate({
			opacity : 100
		},1000,function() {});

		search();
	});
	$("#btnOk").unbind("click", ok).click(search);
	$("#searchInput").unbind("keypress", okKeypressedEnter).keypress(searchKeypressedEnter);
}

function search(){
	saveHisto($('#searchInput').val());
	request($('#searchInput').val(), $("#nbNeighboursInput").val());
}

function zoomChange(value){
	request($('#searchInput').val(),value);
}

function getMousePos(canvas, evt){
	// get canvas position
	var obj = canvas;
	var top = 0;
	var left = 0;
	while (obj && obj.tagName != 'BODY') {
		top += obj.offsetTop;
		left += obj.offsetLeft;
		obj = obj.offsetParent;
	}

	// return relative mouse position
	var mouseX = evt.clientX - left + window.pageXOffset;
	var mouseY = evt.clientY - top + window.pageYOffset;
	return {
		x: mouseX,
		y: mouseY
	};
}
/*
function writeMessage(canvas, message){
	ctx.clearRect(0, 0, 150, 30);
	ctx.font = '8pt Calibri';
	ctx.fillStyle = 'black';
	ctx.fillText(message, 10, 25);
}

function writeMessageHover(canvas, message){
	ctx.clearRect(0, 30, 150, 150);
	ctx.font = '8pt Calibri';
	ctx.fillStyle = 'black';
	ctx.fillText(message, 10, 145);
}
*/
function getImageId(mousePos)
{
	for (var i = 0;i < graph.nodes.length;i++)
	{
		var node = graph.nodes[i];
		if((mousePos.x > node.position.x)&&(mousePos.x < node.position2.x)
				&&(mousePos.y > node.position.y)&&(mousePos.y < node.position2.y)) {
			return node.id;
		}
	}
	return -1;
}


function evenement(object){
	if (object.id == 'htm'){
		HTML = true;
		webGL = false;
	}
	if (object.id == 'svg'){
		HTML = false;
		webGL = false;
	}
	if (object.id == 'niv1'){
		algoNPlusUn = false;
	}
	if (object.id == 'niv2'){
		algoNPlusUn = true;
	}
	if (object.id == 'wgl'){
		HTML = false;
		webGL = true;
		alert('WEBGL....');
	}
}

function remplirSlider(){
	//on parcour le slider
	for (var i = 1;i <= 20 ;i++) {
		//on genere un entier aléatoire en 1 et 49
		var numRand = Math.floor(Math.random()*50);
		//on recupere la case du slider
		var img = document.getElementById("img"+i);
		//on remplace l'image de cette case par celle dont
		//l'ID sur le serveur coorespond au nombre aléatoire
		img.src="../Server/index.php?controller=image&action=getImg&id="+numRand;
		//on remplace aussi l'attribut alt de l'image par son id
		img.alt=numRand;
	}
}

function remplirSearch(object){
	//on recupere le fils du lien (notre image)
	var enfant = object.childNodes;
	//on recupere son attribut alt (son ID)
	var idImg = enfant[0].alt;
	$("#searchInput").css('color', '#000000').css('font-style', 'normal');
	$("#searchInput").val(idImg);
	$("#searchInput").effect("highlight", {'color' : 'red'}, 1000);

}

function positionnePopup(canvas, mousePos, nodeId)
{
	$(".popupImageDetails").css('top', mousePos.y + 20).css("left", mousePos.x + 20);
	popupShown = true;
}

function saveHisto(id){
	histo[nbhist]=id;
	nbhist++;
	if(!close){
		$("#b1").next("ul").toggle();
		close = true;
	}
	if(!close2){
		$("#b2").next("ul").toggle();
		close2 = true;
	}
}

function showHisto(){


	$('#smenu1').empty();
	for(var i = 0; i < nbhist ; i++){
		var img="../Server/index.php?controller=image&action=getImg&id="+histo[i]+"&t=50";
		var chisto ="<li><a href='#' onclick='changeImg("+histo[i]+");'><img src="+img+"><span class='marge'>"+histo[i]+"</span></a></li>";
		$(chisto).appendTo('#smenu1');

	}
}

function changeImg(id){
	request(id, midValue);
	$("#b1").next("ul").toggle();
	close=true;
	if(!close2){
		$("#b2").next("ul").toggle();
		close2 = true;
	}
}


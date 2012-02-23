			function getParameterByName(name)
			{
		  		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		  		var regexS = "[\\?&]" + name + "=([^&#]*)";
			  	var regex = new RegExp(regexS);
			  	var results = regex.exec(window.location.search);
			  	if(results == null) return "";
		  		else return decodeURIComponent(results[1].replace(/\+/g, " "));
			}
		
			function getImageMaterial( url, geom )
			{
				var image = new Image();
				var material = new THREE.MeshBasicMaterial( { map : new THREE.Texture( image ) } );
				with ( { material : material } )
				{
	    			image.onload = function()
		    		{
		        		this.loaded = true;
	    	    		material.map.image = this;
	    			};
				}
				image.src = url;
				return material;
			}
		
			function getLineMaterial(score){

				var c = new THREE.Color(0x000000);

				/*var tmp = 1-score;
				
				if (score <= 0.4){//dans les tons vert
					c.r = Math.round(tmp*255);
					c.g = 255;
				}
				if ((score > 0.4)&&(score <= 0.7)){//dans les tons jaune
					c.r = 255;
					c.g = Math.round((1-tmp)*230);
				}
				if ((score > 0.7)&&(score <= 0.9)){//dans les tons orange
					c.r = 255;
					c.g = Math.round((1-tmp)*140);
				}
				if ((score > 0.9)){//dans les tons rouge
					c.r = Math.round(tmp*255);
					c.g = Math.round((1-tmp)*140);
				}*/


				
				if (score > 0.99){
					score = 0.99;
				}

				var tmp = 1-score;
				
				if (tmp <= 0.4){//dans les tons rouge
					if (tmp <0.2){//pour eviter de passer dans le noir
						tmp = 0.2;
					}
					c.r = Math.round(tmp*255);
					c.g = 255;
				}
				else if ((tmp > 0.4)&&(tmp <= 0.7)){//dans les tons orange
					c.r = 255;
					c.g = Math.round((1-tmp)*230);
				}
				else if ((tmp > 0.7)&&(tmp <= 0.9)){//dans les tons jaune
					c.r = 255;
					c.g = Math.round((1-tmp)*140);
				}
				else if ((tmp > 0.9)){//dans les tons vert
					if (tmp>0.95){//pour eviter de passer dans le rouge
						tmp = 0.95;
					}
					c.r = Math.round(tmp*255);
					c.g = Math.round((1-tmp)*140);
				}
				
				c.b = 0;//dans tout les cas le bleu est a 0
				
				return new THREE.LineBasicMaterial({
				    color: c.getHex(),
				    opacity: 1/*0.6*/,
				    blending: THREE.AdditiveBlending,
				    transparent: true,
				    linewidth: 1
				} );	
			}
			
			var PI2 = Math.PI * 2;
			var particleMaterial = new THREE.ParticleCanvasMaterial( {
				color: 0xFF0000,
				program: function ( context ) {
					context.beginPath();
					context.arc( 0, 0, 1, 0, PI2, true );
					context.closePath();
					context.fill();
				}
			} );
			
			var container, stats;
			var camera, scene, renderer, images, root, lignes;
			var imagesObjects = [], liensObjects = [], projector, keyValues = new Array();// pour le picking
			var mouseX = 0, mouseY = 0, ctrlPressed = false;// inputs
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			var liens, positions;
			var timer, timerEnabled = 0, step = 0, nextImage = 1, nextImagePosition = new THREE.Vector3(0, 0, 0);// animation
			var cameraLookAt = new THREE.Vector3(0, 0, 0);
			var lastCameraLookAt = new THREE.Vector3(0, 0, 0);
			var hoveredImage = [];var hoveredImageTimers = [];
			var minScore = 1, maxScore = 0;
			var min = 3;
			var max = 40;
			var midValue = Math.round((max-min)/2);

			var nbImage = 1490;
			var searchInputDefaultText = "Veuillez saisir un identifiant d'image";

			
			function explodeGraph() {
				if(!timerEnabled) {
					timerEnabled = true;
					drawImages();
					drawLiens();
					explode();	
				}
			}
			
			function explode(){
				for(var i in positions){
					var imgName = "img_" + positions[i][0];
					var imgNode = images.getChildByName(imgName, false);
					imgNode.position.x += (positions[i][1] * 0.1);
					imgNode.position.y += (positions[i][2] * 0.1);
					imgNode.position.z += (positions[i][3] * 0.1);
					for(var j in liens){
						if (liens[j][0] == positions[i][0]) {
							lignes.getChildByName("link_" + j).geometry.vertices[0].position = imgNode.position;
							continue;
						}
						if(liens [j][1] == positions[i][0]) {
							lignes.getChildByName("link_" + j).geometry.vertices[1].position = imgNode.position;
						}
					}
				}
				updateImagesLookAt();
				step++;
				if(step == 10){
					timerEnabled = false;
					step = 0;
				}
				else{
					timer = setTimeout('explode()', 100);
				}
			}
			
			function clearGraph() {
				positions = [];
				tmpPositions = [];
				for(var i = 0;i<imagesObjects.length;i++) {
					images.remove(imagesObjects[i]);// ici voir éventuelle fuite mémoire (cf doc Three.js)
				}
				imagesObjects = [];
				keyValues = new Array();
			}
			
			function clearLiens(){
				for(var i = 0;i<liensObjects.length;i++){
					lignes.remove(liensObjects[i]);
				}
				liens = [];
				liensObjects = [];		
			}
			
			function moveToNextImage(){
				if(!timerEnabled){
					timerEnabled = true;
					move();
				}
			}
			
			function move(){
				var imgNode;
				for(var i in positions){
					if(positions[i][0] == nextImage){
						// on recentre l'image
						var imgNode = images.getChildByName("img_" + nextImage, false);// positions[i][0], false);
						imgNode.position.x += (-(positions[i][1] * 0.1));
						imgNode.position.y += (-(positions[i][2] * 0.1));
						imgNode.position.z += (-(positions[i][3] * 0.1));
						break;
					}
				}
				
				cameraLookAt.x -= nextImagePosition.x * 0.1;//(cameraLookAt.x - nextImagePosition.x) * 0.04;
				cameraLookAt.y -= nextImagePosition.y * 0.1;//(cameraLookAt.y - nextImagePosition.y) * 0.04;
				cameraLookAt.z -= nextImagePosition.z * 0.1;
				updateImagesLookAt();
				
				
				step++;
				if(step == 10) {
					timerEnabled = false;
					step = 0;
					clearGraph();
					requestGraph(nextImage, 20);
				}else{
					timer = setTimeout('move()', 100);
				}
			}
			
			function implode(){
				for(var i in positions){
					if(positions[i][0] == nextImage) {
						continue;
					}
					var imgNode = images.getChildByName("img_" + positions[i][0], false);
					imgNode.position.x += (-(positions[i][1] * 0.1));
					imgNode.position.y += (-(positions[i][2] * 0.1));
					imgNode.position.z += (-(positions[i][3] * 0.1));
					for(var j in liens){
						if (liens[j][0] == positions[i][0]) {
							lignes.getChildByName("link_" + j).geometry.vertices[0].position = imgNode.position;
							continue;
						}
						if(liens [j][1] == positions[i][0]) {
							lignes.getChildByName("link_" + j).geometry.vertices[1].position = imgNode.position;
						}
					}
				}

				cameraLookAt.x += (nextImagePosition.x) * 0.1;
				cameraLookAt.y += (nextImagePosition.y) * 0.1;
				cameraLookAt.z += (nextImagePosition.z) * 0.1;
				
				updateImagesLookAt();
				
				step++;
				if(step == 10){
					timerEnabled = false;
					step = 0;
					moveToNextImage();
				}
				else{
					timer = setTimeout('implode()', 100);
				}
			}
			
			function implodeGraph() {
				if(!timerEnabled) {
					timerEnabled = true;
					for(var i in positions){
						if(positions[i][0] == nextImage){
							nextImagePosition.x = positions[i][1];
							nextImagePosition.y = positions[i][2];
							nextImagePosition.z = positions[i][3];
							break;
						}
					}
					implode();	
				}
			}
			
			function init() {
				nextImage = getParameterByName("id");
				projector = new THREE.Projector();
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
				camera.position.z = 600;
				
				scene = new THREE.Scene();
				scene.add( camera );
				
				var PI2 = Math.PI * 2;
				var program = function ( context ) {
					context.beginPath();
					context.arc( 0, 0, 1, 0, PI2, true );
					context.closePath();
					context.fill();
				}
				root = new THREE.Object3D();
				scene.add(root);
				
				images = new THREE.Object3D();
				root.add(images);

				lignes = new THREE.Object3D();
				root.add(lignes);
				
				requestGraph(nextImage, 20);
				
				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.domElement.id = "zoneGraph";
				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				
				var html5logo = new Image();
				html5logo.src = "Ressources/Images/HTML5_Logo_64.png";
				var jQuerylogo = new Image();
				jQuerylogo.src = "Ressources/Images/jquery12.gif";
				var webGLlogo = new Image();
				webGLlogo.src = "Ressources/Images/webgl-logo.png";
				$("div.index").after(renderer.domElement).append(stats.domElement).append("<div id='logos'></div>");
				$("#logos").append("<span id='poweredby'>powered by</span><br/>").append(webGLlogo).append(html5logo).append(jQuerylogo);
				
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
				
				
				
				/**
				 * Création du btn ok
				 * association de la fonction ok au click
				 */
				$("#btnOk").button();
				$("#btnOk").click(ok);
				
			}
			
			function drawImages(){
				for(var i in positions){
			    	  var o = new THREE.Object3D();
			    	  //o.matrixWorld = matrix;
			    	  var id = positions[i][0];
			    	  o.name = "img_" + id;
					  o.position = new THREE.Vector3(0, 0, 0);
			    	  var imageUrl = "../Server/index.php?controller=image&action=getImg&id="+id+"&t=300";
			    	  var geom = new THREE.CubeGeometry(100, 100, 1);
			    	  geom.dynamic = true;
					  geom.__dirtyVertices = true;
			    	  var cube = new THREE.Mesh(
			    				geom,
			    				//new THREE.MeshLambertMaterial( { color: 0xFF0000 } )
			    				getImageMaterial( imageUrl )
							);
			    	  o.add(cube);
					  images.add(o);
					  imagesObjects.push(o);
					  keyValues[o.id] = o.name;
			      }
			}
			
			function drawLiens() {
				for(var i in liens) {
					var img0 = images.getChildByName("img_" + liens[i][0], false);
					var img1 = images.getChildByName("img_" + liens[i][1], false);
					var geom = new THREE.Geometry();
					var vertice0 = new THREE.Vertex( new THREE.Vector3(0, 0, 0));
					var vertice1 = new THREE.Vertex( new THREE.Vector3(0, 0, 0));
					geom.vertices.push(vertice0);
					geom.vertices.push(vertice1);
					var o = new THREE.Line(geom, getLineMaterial(liens[i][2]));
					o.geometry.dynamic = true;
					o.geometry.__dirtyVertices = true;
					o.name = "link_" + i;
					lignes.add(o);
					liensObjects.push(o);
				}
			}
			
			function getMinMaxScore(){
				for(var i in liens){
					maxScore = liens[i][2] > maxScore ? liens[i][2] : maxScore;
					minScore = liens[i][2] < minScore ? liens[i][2] : minScore;
				}
			}
			
			function requestGraph(id_ref, nbVoisins) {console.log(id_ref);
				nextImage = id_ref;
				$.ajax({
					  url: '../Server/index.php',
					  dataType: 'json',
					  cache: false,
					  data:  {"controller" : "score", "id" : id_ref, "nn" : nbVoisins, "action" : "getScoreV3", "w": window.innerWidth, "h": window.innerHeight, "s": "1", "coords3D" : "1" },
					  success: function(data) {
						liens = data.liens;
						positions = data.positions;	
						getMinMaxScore();
						explodeGraph();
					  }
				});	
			}
			
			function animate() {
				requestAnimationFrame( animate );
				render();
				stats.update();
			}

			function render() {
				camera.lookAt(cameraLookAt);
				renderer.render( scene, camera );
			}	
			
			function updateImagesLookAt(){
				for(var i in imagesObjects){
					imagesObjects[i].lookAt(camera.position);
				}
			}
			
// 			function zoomOut(id, time){
// 				var o = images.getChildByName("img_" + hoveredImage); 
// 				o.position.z -= time / 2;
// 				time -= 50;
// 				if (time == 0) {
// 					delete hoveredImageTimers[o.name];
// 				}
// 				else {
// 					hoveredImageTimers[o.name] = setTimeout('function() { zoomOut(' + id + ',' + time + ') }', 50);
// 				}
// 			}
			
// 			function zoomOutImage(id, time){
// 				if(hoveredImageTimers == undefined){
// 					zoomOut(id, time);
// 				}
// 			}
			
// 			function zoomIn(id, time){
// 				var o = images.getChildByName("img_" + hoveredImage);
// 				o.position.z += time / 2;
// 				time -= 50;
// 				if (time == 0) {
// 					delete hoveredImageTimers[o.name];
// 				}
// 				else {
// 					hoveredImageTimers[o.name] = setTimeout('function() { zoomIn(' + id+ ',' + time+ ') }', 50);
// 					//setTimeout(function(){myFunction(parameter)}, myTimeout);
// 				}
// 			}
			
// 			function zoomInImage(id, time){
// 				if (hoveredImageTimers == undefined){
// 					zoomIn(id, time);	
// 				}
// 			}
			
			$(document).ready(function(){
				init();
				animate();
				$(document).bind('mousemove', function ( event ) {
					event.preventDefault();

// 						var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
// 						projector.unprojectVector( vector, camera );
// 						var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
// 						var intersects = ray.intersectObjects(imagesObjects);
// 						hoveredImage = [];
						
// 						if ( intersects.length > 0 ) {
// 							var o = intersects[i].object;
// 							hoveredImage.push(keyValues[parseInt(o.id) - 1].substring(4));
// 						}
						
// 						for(var i in positions){
// 							var found = false;
// 							for (var j in hoveredImage){
// 								if(positions[i][0] == hoveredImage[j])
// 								{
// 									var imgNode = images.getChildByName("img_" + positions[i][0]);
// 									imgNode.scale.x = 2;
// 									imgNode.scale.y = 2;
// 									imgNode.scale.z = 2;
// 									found = true;
// 									break; 
// 								}
// 							} 
// 							if (found) continue;
// 							else {
// 								var imgNode = images.getChildByName("img_" + positions[i][0]);
// 								imgNode.scale.x = 1;
// 								imgNode.scale.y = 1;
// 								imgNode.scale.z = 1;
// 							}
// 						}
						
				}).click(function(event){
						event.preventDefault();
						var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
						projector.unprojectVector( vector, camera );
						var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
						var intersects = ray.intersectObjects(imagesObjects);

						if ( intersects.length > 0 ) {
							var o = intersects[0].object;
							nextImage = keyValues[parseInt(o.id) - 1].substring(4);

							implodeGraph();
						}
				}).bind("keydown", function(event){
					switch (event.which) {
						case 17:
							ctrlPressed = true;
							event.preventDefault();
							break;
						case 37://Left Arrow
							var deltaAngle = (PI2/imagesObjects.length);
							root.rotation.z += deltaAngle; 
							updateImagesLookAt();
							event.preventDefault();
//							images.rotation.z += .1;
							//images.position.z += 0.1:
							break;
						case 38://Up Arrow
							
							event.preventDefault();
							//camera.position.z += 10;
							//images.position.z += 100:
							break;
						case 39://Right Arrow
							var deltaAngle = (PI2/imagesObjects.length);
							root.rotation.z -= deltaAngle;
							updateImagesLookAt();
							event.preventDefault();
							//camera.position.x -= 10;
							break;
						case 40://Down Arrow
							
							event.preventDefault();
							//camera.position.x += 10;
							break;						

					}
				}).bind("keyup", function(event){
					
					if (event.keyCode == 17){
						event.preventDefault();
						ctrlPressed = false;
					}
				}).keypress(function(event){
					console.log(event);
					
					switch(event.which){
						case 122://Z
							camera.position.z -= 10;
							updateImagesLookAt();
							console.log(camera.position.x + " " + camera.position.y + " " + camera.position.z);
							event.preventDefault();
							break;
						case 115://S
							camera.position.z += 10;
							updateImagesLookAt();
							console.log(camera.position.x + " " + camera.position.y + " " + camera.position.z);
							event.preventDefault();
							break;
						case 113://Q
							camera.position.x -= 10;
							updateImagesLookAt();
							console.log(camera.position.x + " " + camera.position.y + " " + camera.position.z);
							event.preventDefault();
// 							images.rotation.y -= .1;
// 							lignes.rotation.y -= .1;
							break;
						case 100://D
							camera.position.x += 10;
							updateImagesLookAt();
							event.preventDefault();
// 							images.rotation.y += .1;
// 							lignes.rotation.y += .1;
							break;
					}
				});
			
				document.addEventListener('touchstart',function(event){
					event.preventDefault();
					var vector = new THREE.Vector3( ( event.pageX / window.innerWidth ) * 2 - 1, - ( event.pageY / window.innerHeight ) * 2 + 1, 0.5 );
					projector.unprojectVector( vector, camera );
					var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
					var intersects = ray.intersectObjects(imagesObjects);

					if ( intersects.length > 0 ) {
						var o = intersects[0].object;
						nextImage = keyValues[parseInt(o.id) - 1].substring(4);

						implodeGraph();
					}
				},false);
				/* * 
				 * function touchEvent(){ if(isClicked){ setTimeout(function(){
				 * graphCenter.x -= 25; draw(); touchEvent(); },100); }else isClicked =
				 * true; }
				 * 
				 * document.getElementById("fg").addEventListener('touchend',function(){
				 * isClicked = false; },false);*/
			
			});
			
			function centrerGraph(){
				zoom =1;			// réinitialisation du zoom
				translateX = 0;		// réinitialisation du x de la translation
				translateY = 0;		// réinitialisation du x de la translation
				draw();
			}			
			
			
			/**
			 * Declenchement d'une recherche avec le lancement de l'animation en cas de premi?re recherche
			 */
			function ok(){
				if(isCorrectSearch()){	
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
						$('#radio, #bloc, #logo, #menu_gauche, #menu_droite, #zoneGraph, .fleche, #zoomDiv').show().animate({
							opacity : 100
						},1000,function() {});
				
						search();
						//resized();
				
					});
					
					/**
					 * Slider pour selectionner un nombre de voisins
					 */
					
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
					
					/**
					 * Création du btn ok
					 * association de la fonction ok au click
					 */
					$("#btnOk").button();
					$("#btnOk").click(ok);
					
				}
			}
			

			/**
			 * Gestion de changement de valeur des boutons radio
			 * @param object
			 */
			function evenement(object){
				if (object.id == 'htm'){
					if(HTML != true){
						var nodeId = getHistoCookie().split("|")[getHistoCookie().split("|").length-1];
						setTransferData($("#nbNeighboursInput").val(), zoom, translateX , translateY, nodeId);
						HTML = true;
						window.open("./index.html","_self");
					}
				}
				if (object.id == 'svg'){
					if(HTML == true){
						var nodeId = getHistoCookie().split("|")[getHistoCookie().split("|").length-1];
						setTransferData($("#nbNeighboursInput").val(), zoom, graphCenter.x , graphCenter.y, nodeId);
						HTML = false;
						window.open("./indexSVG.html","_self");
					}
				}
				if (object.id == 'niv1'){
					algoNPlusUn = false;
					max = 40;
					$("#topLabelSlider").html(max);
					$( "#slider" ).slider( "option", "max", max );
					if (($( "#slider" ).slider( "option", "value"))> max){
						$( "#slider" ).slider( "option", "value", max );
						$("#nbNeighboursInput").val(max);
					}
						
				}
				if (object.id == 'niv2'){
					algoNPlusUn = true;
					max = nbImage;
					$("#topLabelSlider").html(max);
					$( "#slider" ).slider( "option", "max", max );
				}
			}

			/**
			 * Remplissage du carroussel de la page d'accueil avec des images al?atoires
			 */
			function remplirSlider(){
				//on parcour le slider
				for (var i = 1;i <= 20 ;i++) {
					//on genere un entier al�atoire en 1 et 1491
					var numRand = Math.floor(Math.random()*nbImage) + 1;
					//on recupere la case du slider
					var img = document.getElementById("img"+i);
					//on remplace l'image de cette case par celle dont
					//l'ID sur le serveur coorespond au nombre al�atoire
					img.src="../Server/index.php?controller=image&action=getImg&id="+numRand+"&w=100&l=100";
					//on remplace aussi l'attribut alt de l'image par son id
					img.alt=numRand;
				}
			}

			/**
			 * M?thode de remplissage de la barre de recherche quand on clique sur une miniature du carroussel
			 * @param object
			 */
			function remplirSearch(object){
				//on recupere le fils du lien (notre image)
				var enfant = object.childNodes;
				//on recupere son attribut alt (son ID)
				var idImg = enfant[0].alt;
				$("#searchInput").css('color', '#000000').css('font-style', 'normal');
				$("#searchInput").val(idImg);
				$("#searchInput").effect("highlight", {'color' : 'red'}, 1000);

			}			
			
			/**
			 * V?rifie que le contenu de la barre de recherche est au format valide
			 * @returns {Boolean}
			 */
			function isCorrectSearch(){
				var searchVal = $('#searchInput').val();
				return (searchVal.toString().search(/^[0-9]+$/) == 0)
					&& searchVal != ""
					&& searchVal != searchInputDefaultText
					&& searchVal >= 1
					&& searchVal <= nbImage+1;;
			}			
			
			/**
			 * Lancement d'une recherche a partir du contenu de la barre de recherche
			 */
			function search(){
				if(isCorrectSearch()){
					//saveHisto($('#searchInput').val());
					implodeGraph();
					requestGraph($('#searchInput').val(), $("#nbNeighboursInput").val());
				}
			}
			
			/**
			 * Gestion de la touche entr?e pour le champ de recherche et 
			 */
			function okKeypressedEnter(event){
				if ( event.which == 13 ) { ok(); }
			}
			function searchKeypressedEnter(event){
				if ( event.which == 13 ) { search(); }
			}

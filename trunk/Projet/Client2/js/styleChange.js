function ok(){
	//moveTo("searchDiv",15,5,20);
	$('.index').animate({
		opacity: 0
	},500, function(){
		$('#searchDiv').animate({
			top: "-="+($('#searchDiv').offset().top-20)+""
		},500,function() {
			$('#changeMode').animate({
				opacity : 100
			},5000,function() {});
		});
	});
}

function moveTo(id, targetX, targetY, nbStep){
	// moves an object ( from his id ) from his current position ( % ) do a new one with nbStep steps
	var currentX = parseInt((document.getElementById(id).style.left).split("%")[0]);
	var stepX = Math.abs( targetX - currentX )/nbStep;
	if(targetX > currentX ){
		if(targetX - currentX > stepX){
			document.getElementById(id).style.left = currentX + stepX+"%";
		}
		else{
			document.getElementById(id).style.left = targetX+"%";
		}
	}else{
		if(targetX + currentX > stepX){
			document.getElementById(id).style.left = currentX - stepX+"%";
		}
		else{
			document.getElementById(id).style.left = targetX+"%";
		}
	}

	var currentY = parseInt((document.getElementById(id).style.top).split("%")[0]);
	var stepY = Math.abs( targetY - currentY )/nbStep;
	if(targetY > currentY){
		if(targetY - currentY > stepY){
			document.getElementById(id).style.top = currentY + stepY+"%";
		}
		else{
			document.getElementById(id).style.top = targetY+"%";
		}
	}else{
		if(targetX + currentY > stepY){
			document.getElementById(id).style.top = currentY - stepY+"%";
		}
		else{
			document.getElementById(id).style.top = targetY+"%";
		}
	}
	if(currentX != targetX || currentY != targetY ){
		setTimeout("moveTo('"+id+"',"+targetX+","+targetY+","+nbStep+")",20);
	}
}
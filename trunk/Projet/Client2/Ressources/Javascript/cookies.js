//save the object and its value with expired day to cookie
function saveCookie(obj, objValue, day)
{
  var expireDate = new Date;
  expireDate.setDate(expireDate.getDate()+ day);
  document.cookie = obj + "=" + objValue + "; expires="
  + expireDate.toGMTString() + "; path=/";
}

// save the object and its value with expired day to local cookie without path
function saveLocalCookie(obj, objValue, day)
{
  var expireDate = new Date;
  expireDate.setDate(expireDate.getDate()+ day);
  document.cookie = obj + "=" + objValue + ";expires=" + expireDate.toGMTString();
}

// get the object value of obj from cookie
function getCookie(objName)
{
  var arrStr = document.cookie.split("; ");
  for(var i = 0;i < arrStr.length; i++)
  {
    var temp = arrStr[i].split("=");
    if(temp[0] == objName)
      return unescape(temp[1]);
  }
  return null;
}

function addHistoCookie( nodeId ) 
{
  //Get cookie
  var currentHisto = getHistoCookie();
  //Set cookie
  saveCookie('histo', currentHisto+"|"+nodeId, 60);

}

function getHistoCookie( ) 
{
  //Check cookie
  var currentHisto = getCookie('histo');
  if (currentHisto == "null" || currentHisto == null) currentHisto = "";
  //Return cookie
  return currentHisto
}

function setTransferData(nbNeighbours, zoom, x, y, nodeId){
	 saveCookie('transferData', nbNeighbours+="|"+zoom+"|"+x+"|"+y+"|"+nodeId, 60);
}

function getTransferData(){
	var result = getCookie('transferData');
	if(result == "null" || result == null) result = "";
	return result;
}

function resetTransferData(){
	saveCookie('transferData', "", 60);
}

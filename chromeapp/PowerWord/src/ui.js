 var jsLib='http://dict-co.iciba.com/js/';
 var plut_css='http://dict-co.iciba.com/ui/';
 var _jsInterFaceHost='http://dict-co.iciba.com';
 var _icbaUiType=0;
 var _icibaLanguage="";
 var html = "\r\n<style>\r\n/*\r\n#iciba_plug h5,#iciba_plug p, #iciba_plug pre,#iciba_plug table, #iciba_plug form, #iciba_plug div div{margin:0;padding:0}\r\n#iciba_plug th,#iciba_plug td,#iciba_plug tr {\r\npadding:0;\r\nvertical-align:middle;\r\n}*/\r\n#iciba_plug table,#iciba_plug tr,#iciba_plug td,#iciba_plug th{margin:auto 0;padding:0}\r\n\r\n#icibaSearchToolBar div div{padding:0;}\r\n\r\n#iciba_plug #icibaContext{text-align:left;}\r\n#icibaTableBg {border-collapse:separate ;border-spacing:1px;}\r\n#iciba_plug table{width:100%;}\r\n#iciba_plug .icibaItemIcon,#iciba_plug .icibaItemIcon_2{float:none}\r\n#iciba_plug td{font-size:12px;white-space:normal;}\r\n#kshy_switch_v4 a,#icibaNotice  a{text-decoration:none;}\r\nimg{border:0;}\r\n<\/style>\r\n<div id=\"iciba_plug\" name=\"iciba_plug\" style=\"top:10px;left:10px;display:none;z-index:5\">\r\n\r\n<table width=\"100%\"  border=\"0\" cellpadding=\"0\" cellspacing=\"1\" class=\"icibaTableBg\" id=\"icibaTableBg\">\r\n  <tr>\r\n    <td valign=\"top\"  class=\"icibaTdBg\">\r\n	\r\n	<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" id=\"icibaDrawBar\">\r\n      <tr class=\"icibaBarBg\">\r\n        <td   id=\"icibaBar\">     \r\n		<div id=\"icibaLogo\">爱词霸 即划即译<\/div>		\r\n		<\/td>\r\n		<td width=\"60\">\r\n		<div id=\"icibaIcon\">\r\n		  <span title=\"关闭\" id=\"icibaClose\">关闭<\/span>\r\n		  <span title=\"放大\" id=\"icibaBig\" class=\"icibaBig1\">放大<\/span>\r\n		  <span title=\"定位\" id=\"icibaDw\" class=\"icibaDw\">定位<\/span>\r\n		  <div style=\"clear:both;\"><\/div>\r\n		<\/div>\r\n\r\n		<\/td>\r\n      <\/tr>\r\n    <\/table>\r\n\r\n      <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" id=\"icibaSearchToolBar\">\r\n	    \r\n        <tr class=\"icibaInputBg\">\r\n         <td>\r\n          <div id=\"icibaInputW\">\r\n			  <div id=\"icibaInput\">\r\n			    <INPUT TYPE=\"text\" NAME=\"icibaInputWord\" id=\"icibaInputWord\" style=\"width:210px;\"><span id=\"onOff\">on<\/span>\r\n				<div style=\"clear:both;\"><\/div>\r\n			  <\/div>\r\n		 <\/div>\r\n           <span id=\"icibaBotton\" class=\"icibaBotton\">翻译<\/span>            \r\n		<div style=\"clear:both;\"><\/div>\r\n\r\n		<\/td>          \r\n        <\/tr>\r\n      <\/table>\r\n\r\n      <table width=\"100%\"  border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\r\n        <tr>\r\n          <td valign=\"top\">\r\n		  <div id=\"icibaContext\" >\r\n\r\n		     <!--查词的基本解释 -->\r\n		    <div id=\"icibaDict_context\" class=\"icibaItemContext\">Loading......<\/div>\r\n		    <!-- end 查词的基本解释 -->\r\n\r\n			<!-- 爱心 -->\r\n			<div id=\"icibaLove\" class=\"icibaItemTitle\">百科词典<span class=\"icibaItemIcon\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/span> <\/div>\r\n			<div id=\"icibaLove_context\" class=\"icibaItemContext\" isDisplay=\"block\">Loading......<\/div>\r\n			<!-- end 爱心-->\r\n             \r\n\r\n			<!-- 翻译 -->\r\n			<div id=\"icibaFy\" class=\"icibaItemTitle\">机器翻译<span class=\"icibaItemIcon\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/span> <\/div>\r\n			<div id=\"icibaFy_context\" class=\"icibaItemContext\" >Loading......<\/div>\r\n			<!-- end 翻译 -->\r\n\r\n\r\n			<!-- 短句 -->\r\n			<div id=\"icibaDj\" class=\"icibaItemTitle\">相关例句<span class=\"icibaItemIcon\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/span> <\/div>\r\n			<div id=\"icibaDj_context\" class=\"icibaItemContext\" isDisplay=\"block\">Loading......<\/div>\r\n			<!-- end 短句-->\r\n\r\n\r\n			<!-- 同反义词 -->\r\n			<div id=\"icibaTf\" class=\"icibaItemTitle\">同反义词<span class=\"icibaItemIcon\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/span><\/div>\r\n			<div id=\"icibaTf_context\" class=\"icibaItemContext\">Loading......<\/div>\r\n			<!-- end 同反义词 -->\r\n\r\n\r\n			<!-- 英英词典 -->\r\n			<div id=\"icibaEnen\" class=\"icibaItemTitle\">英英词典<span class=\"icibaItemIcon\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/span><\/div>\r\n			<div id=\"icibaEnen_context\" class=\"icibaItemContext\">Loading......<\/div>\r\n			<!-- end 英英词典 -->\r\n\r\n			<div id=\'no_res\' style=\'margin:8px;display:none\'>对不起，您搜索的词条暂无结果。<br />请到<a href=\'http://www.iciba.com\' target=\'_blank\'>爱词霸<\/a>查询<\/div>\r\n		  <\/div>\r\n\r\n		  <\/td>\r\n        <\/tr>\r\n      <\/table>\r\n	  <!-- ad -->\r\n      <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" id=\"icibaAdsBoot\">\r\n        <tr>\r\n		  <td><div id=\"icibaSkin\" title=\"点击换皮肤\" onclick=\"K.skinChangPlay()\" class=\"icibaSkinNo\">皮肤<\/div><\/td>\r\n          <td  id=\"icibaAdsBootLeft\"><a href=\"#\" target=\"_blank\" >牛津专业版优惠价!   牛津新词典<\/a><\/td>\r\n		  \r\n          <td   id=\"icibaAdsBootRight\" align=\"right\" style=\"\"><div id=\"kshy_switch_v4\">4566<\/div><\/td>\r\n        <\/tr>\r\n      <\/table>\r\n	  <!-- end ad -->\r\n	  <\/td>\r\n  <\/tr>\r\n<\/table>\r\n\r\n<\/div>\r\n		\r\n<ul id=\"icibaHistory\" style=\"z-index:10\">\r\n<\/ul>\r\n<div id=\"icibaSkinChoice\" style=\"display:none;\">\r\n<\/div>\r\n<div id=\"kshyr\" style=\"display:none\"><\/div>\r\n<FORM METHOD=\"POST\" ACTION=\"\" target=\"_blank\" id=\"icibaForm\" style=\"display:none;\"><\/FORM>\r\n";
 var ui = document.createElement('div');
 ui.innerHTML = html;
 document.body.appendChild(ui);
 var nodes = [].slice.call(ui.children, 0);
 document.head.appendChild(nodes[0]);
 for (var i=1;i<nodes.length;i++){
      document.body.appendChild(nodes[i]);
 }

/*--------------------------------------------------------------------------+
   | JSLoad (url           // String  - Scripts location (i.e. http:///a.js)
   |         [, container] // Object  - Window with script loading capability
   |         [, type]      // String  - Type of script (i.e. text/javascript)
   |         [, defer]     // Boolean - Flag for delaying script processing
   |         [, language]  // String  - Language script is written in.
   |         [, title])    // String  - Title for loaded script
   |+--------------------------------------------------------------------------+
   | 从新载入 js文件
   *--------------------------------------------------------------------------*/
var K2 = K2 || {};
if(typeof(iciba_param)=="undefined") iciba_param=new Array();

function JSLoad(url, container, type, defer, language, title)
{
	// verify / attain container
	if(container == undefined || container == null) container = this;

	// setup container
	if(typeof container.write == "undefined")
		if(typeof container.document != "undefined")
			container = container.document;
		else throw "Invalid container. Unable to load [" + url + "]";

	// no type set
	if(type == undefined || type == null)
	{
		type = '';

		// no language so set default type
		if(language == undefined || language == null)
		{
			language = undefined;
			type = "text/javascript";
		}
	}

	// set default language
	if(language == undefined || language == null) language = "JavaScript";

	// set title
	if(title == undefined || title == null) title = '';

	// set defer
	if(defer == undefined) defer = false;

	// build the script object
	var script = container.createElement("script");
	script.defer = defer;
	script.language = language;
	script.title = title;
	script.type = type;
	script.charset = "UTF-8";//charset="UTF-8"
	script.src = url;

	// dynamically load the script via it's container
	var head = container.getElementsByTagName("head")[0];
	head.appendChild(script);
}

//载入css文件
function CssLoad(url,container){
	if(container == undefined || container == null) container = this;

	// setup container
	if(typeof container.write == "undefined")
		if(typeof container.document != "undefined")
			container = container.document;
		else throw "Invalid container. Unable to load [" + url + "]";
	var css = container.createElement("link");
	css.rel = "stylesheet";
	css.type = "text/css";
	css.href = url;
	css.id = 'icibaCssDefault';
	var head = container.getElementsByTagName("head")[0];
	head.appendChild(css);
}

function isEnglish(name) //英文值检测
{
	if(name.length == 0)return false;
	for(i = 0; i < name.length; i++) {
		if(name.charCodeAt(i) > 128)
			return false;
	}
	return true;
}



//翻译
K2.config={
	from_language:''
	,
	to_language:''
}
/*K2.translateRest= function (result) {
	if (!result.error) {
		K.config.fyText+= result.translation;

		if(K.config.Paragraphslength>= K.config.Paragraphs.length ){
			K.config.loadType['icibaFy_context']=1;
			K.$('icibaFy_context').innerHTML=K.config.fyText;//(result.translation);
			K.$('icibaFy_context').style.display='block';
			callBackIsDisplay('icibaFy');
		}
		else{
			google.language.translate(K.config.Paragraphs[K.config.Paragraphslength],K2.config.from_language,K2.config.to_language,  K2.translateRest);
			K.config.Paragraphslength++;
		}
	}else{
		K.config.loadType['icibaFy_context']= -1;
		alert(result.error);
	}
}*/
K2.translate= function (s,from_language,to_language){
	//	try{
	//		K.config.Paragraphslength=1;
	//		K.config.Paragraphs=new Array();
	//		K.getParagraphs(K.config.fyText);
	//		K.config.fyText='';
	//		//alert(K.config.Paragraphs.length);
	//		//alert(K.config.fyText);
	//		K2.config.from_language= from_language;
	//		K2.config.to_language= to_language;
	//		//alert(K.config.Paragraphs[0]);
	//
	//		google.language.translate(K.config.Paragraphs[0],from_language,to_language,  K2.translateRest);
	//	}catch(e){
	//		K.$('icibaFy_context').style.display='none';
	//		K.$('icibaFy').style.display='none';
	//	}
	K.$('icibaFy_context').style.display='none';
	K.$('icibaFy').style.display='none';
}
// end 翻译

//翻译2
function fyCallback(str){
	K.config.loadType['icibaFy_context']= str==''?-1:1;
	K.$('icibaFy_context').innerHTML=str;
	K.$('icibaFy_context').style.display=str==''?'none':'block';
	callBackIsDisplay('icibaFy');
}
// end 翻译2



//短句
function djCallback(str){
	K.config.loadType['icibaDj_context']= str==''?-1:1;
	try{
		K.$('icibaDj_context').innerHTML=str;
		K.$('icibaDj_context').style.display= str==''?'none':'block';
		if(K.$('icibaDj'))K.$('icibaDj').style.display= str==''?'none':'block';
		if(str!='')callBackIsDisplay('icibaDj');
		K.observe(K.$('icibaDjMore'),'click',K.regDjMore);
	}catch(e){
	}
}
//end 短句

function En2enCallback(str){
	K.config.loadType['icibaEnen_context']= str==''?-1:1;
	try{

		K.$('icibaEnen_context').innerHTML=str;
		K.$('icibaEnen_context').style.display= str==''?'none':'block';
		if(K.$('icibaEnen'))K.$('icibaEnen').style.display= str==''?'none':'block';
		if(str!='')callBackIsDisplay('icibaEnen');

	}catch(e){
	}
}

function netDictCallback(str){
	K.config.loadType['icibaNetDict_context']= str==''?-1:1;
	try{
		K.$('icibaNetDict_context').innerHTML=str;
		K.$('icibaNetDict_context').style.display= str==''?'none':'block';
		if(K.$('icibaNetDict'))K.$('icibaNetDict').style.display= str==''?'none':'block';
		if(str!='')callBackIsDisplay('icibaNetDict');

	}catch(e){

	}
}

//查词
function dictCallBack(str){
	K.config.loadType['icibaDict_context']= str==''?-1:1;
	try{
		K.$('icibaDict_context').innerHTML=str;
		K.$('icibaDict_context').style.display= str==''?'none':'block';
		if(K.$('icibaDict'))K.$('icibaDict').style.display= str==''?'none':'block';
		if(str!=''){
			//添加生词本 事件
			K.observe(K.$('icibaScb'),'click',K.addWordToScb);
			K.observe(K.$('icibaExplain'),'click',K.toExplain);
			// K.observe(K.$('icibaCopy'),'click',K.copy);
			if(K.$('icibaCopy')){
				K.$('icibaCopy').style.display=K.is_ie?'block':'none';
				if(K.is_ie)K.observe(K.$('icibaCopy'),'click',K.copy);
			}

		}else{
			//当是搜狐邮箱的时候
			if(_icbaUiType==3){
				K.$('icibaFy_src').style.display='block';
				K.$('icibaFy_line').style.display='block';
				if(K.$('icibaFy_context'))K.$('icibaFy_context').setAttribute('isGo',"true");
				if(K.$('icibaDict_context'))K.$('icibaDict_context').setAttribute('isGo',"false");
				K.$(K.config.icibaDiv).style.width= K.config.oObjWidth+'px';
				K.$('icibaContext').style.height= K.config.oObjHeight+'px';
				//翻译
				if( Loading('icibaFy_context') ){
					var q=K.$(K.config.icibaDiv).content;
					if(isEnglish(q)) K2.translate(q,"en", "zh-CN");else  K2.translate(q, "zh-CN","en");
				}
			}
		}

		if(_icbaUiType==2 || _icibaLanguage=='en'){
			if(K.$('icibaScb'))K.$('icibaScb').title='Add to New Word List';
			if(K.$('icibaCopy'))K.$('icibaCopy').title='Copy';
			if(K.$('icibaExplain'))K.$('icibaExplain').innerHTML='Details';
			if(K.$('icibaExplain'))K.$('icibaExplain').title='Details';
		}
	}catch(e){
	}
	callBackIsDisplay('icibaDict');
}
//end 查词

//同反
function tfCallback(str){
	K.config.loadType['icibaTf_context']= str==''?-1:1;
	try{
		if(str!=''){
			//$str=strtr($str,array('反义词'=>'Antonyms','同义词'=>'Synonyms'));
			if(_icbaUiType==2 || _icibaLanguage=='en'){
				str=str.replace('反义词','Antonyms');
				str=str.replace('同义词','Synonyms');
			}
		}
		K.$('icibaTf_context').innerHTML=str;
		K.$('icibaTf_context').style.display= str==''?'none':'block';
		if(K.$('icibaTf'))K.$('icibaTf').style.display= str==''?'none':'block';
		if(_icbaUiType==2 || _icibaLanguage=='en'){
			if(K.$('icibaDjMore')){
				K.$('icibaDjMore').innerHTML='More';
				K.$('icibaDjMore').title='';
			}
		}
		callBackIsDisplay('icibaTf');
	}catch(e){
	}
}

function LoveCallback(str){
	//alert(str);
	K.config.loadType['icibaLove_context']= str==''?-1:1;
	K.$('icibaLove_context').style.display= str==''?'none':'block';
	if(K.$('icibaLove'))K.$('icibaLove').style.display= str==''?'none':'block';
	if(str=='')return ;
	//alert('asdf');
	try{
		K.$('icibaLove_context').innerHTML=str;
		callBackIsDisplay('icibaLove');
	}catch(e){
	}
}

//判断
function Loading(divStr){
	try{
		document.getElementById(divStr).innerHTML='Loading.......';
		if(document.getElementById(divStr).getAttribute('isGo')=='false') {
			document.getElementById(divStr).style.display='none';
			return false;
		}
		document.getElementById(divStr).style.display='block';
		K.config.loadType[divStr]=0;
		return true;
	}catch(e){
		return false;
	}
}

function callBackIsDisplay(divStr){
	try{
		if(K.$(divStr+'_context').getAttribute('isDisplay')=='none'){
			var temIds= K.$(divStr).getElementsByTagName('span');//tagName
			temIds[0].className="icibaItemIcon_2";//icibaItemIcon_2
			K.$(divStr+'_context').style.display='none';
		}
	}catch(r){}
}

//判断是否在
function isOnDiv(id){

	if(!K.config.isSelfDeter) return false;
	if(id=='icibaDj_context') return true;
	if(id=='icibaFy_context') return true;
	//if(id=='icibaTf_context') return true;
	if(id=='icibaDict_context') return true;
	if(id=='icibaLove_context') return true;
	if(id=='icibaEnen_context') return true;
	if(id=='icibaFy_src') return true;

	return false;
}

function inputKey(q){
	if(q=='') return;
	try{
		K.config.fyText=q;
		if(K.$('icibaInputWord'))K.$('icibaInputWord').value=q;
		if(K.$('icibaOutWord') && q!='')K.$('icibaOutWord').value=q;
	}catch(e){
	}
	K.$(K.config.icibaDiv).content=q;
}

//初始化查询历史
initHistory=function(){
	if(!K.$('icibaHistory')) return ;
	var cookie=(K.rCookie('historyT'));
	var str='';
	var arr=cookie.split('/===/');
	//alert(arr.length);
	iK=0;
	for(i =0;i<arr.length;i++){
		w=arr[i];
		if(w.replace(/^\s+/,"")!=''){
			str+='<li title="'+w+'" onclick="HistoryQuery(event);" class="icibaItem" onmousemove="mmove(event)" onmouseout="mout(event)">'+w+'</li>' +K.$('icibaHistory').innerHTML;
			iK++;
		}
	//if(iK>=5) break;
	}
	K.$('icibaHistory').innerHTML=str;
}
HistoryQuery=function(e){
	e = e || window.event;
	var src = e.srcElement || e.target;
	closeHistory();
	inputKey(src.innerHTML);
	K.Search(e,src.innerHTML,false);
}
function mmove(e){
	e = e || window.event;
	var src = e.srcElement || e.target;
	src.className='icibaItem2';
}
function mout(e){
	e = e || window.event;
	var src = e.srcElement || e.target;
	src.className='icibaItem';
}
function addHistory(w){
	if(_icbaUiType==3) {
		K.wCookie('historyT','');
		return ;
	}
	if(w.length>50) return;
	if(!K.$('icibaHistory')) return ;
	if(w.replace(/^\s+/,"")!=''){
		var historyT= w+'/===/'+ K.rCookie('historyT');
		//alert(historyT.split('/===/').length+"**"+K.config.historyMax);
		if(historyT.split('/===/').length>K.config.historyMax){
			var tArr=historyT.split('/===/');
			cont="";
			historyT='';
			for(i=0;i<K.config.historyMax;i++){
				historyT+= cont + tArr[i];
				cont='/===/';
			}
		}
		K.wCookie('historyT',historyT);
		K.$('icibaHistory').innerHTML= '<li title="'+w+'" onclick="HistoryQuery(event);" class="icibaItem" onmousemove="mmove(event)" onmouseout="mout(event)">'+w+'</li>' +K.$('icibaHistory').innerHTML;
	}
}
function closeHistory(){
	if(K.$('icibaSkinChoice')){
		K.$('icibaSkinChoice').style.display='none';
		K.$('icibaSkin').className='icibaSkinNo';
	}
	if(!K.$('icibaHistory')) return ;
	K.$('icibaHistory').style.display = 'none' ;
}
regShowHistory=function(e){
	if(!K.$('icibaHistory')) return ;
	e = e || window.event;
	var src = e.srcElement || e.target;
	var xy=K.getCoords(src);
	//alert(xy.x);
	var icibaHistory=K.$('icibaHistory');
	icibaHistory.style.display= icibaHistory.style.display=='block'?"none":'block';
	K.$('icibaHistory').style.width= (K.$('icibaInputWord').clientWidth+K.$('onOff').clientWidth)+'px';
	K.$('icibaHistory').style.left=(K.getCoords(K.$('icibaInputWord')).x-1)+"px";
	K.$('icibaHistory').style.top=(K.getCoords(K.$('icibaInputWord')).y+K.$('icibaInputWord').clientHeight-1)+"px";
	if(K.is_ie){
		if(icibaHistory.style.display!='none')K.flashDisplay('none');else K.flashDisplay('');
	}
}


isOnHistory=function(id){
	if(id=='icibaHistory') return true;
	return false;


}
//end 历史

//再链接
function searchDictByWord(e){
	e = e || window.event;
	var src = e.srcElement || e.target;
	var q=(src.innerHTML);
	if(q.replace(/^\s+/,"") =='') {
		return ;
	}
	K.Search(e,q,false);
	inputKey(q);
	addHistory(q);
}

isFy=true;
if( typeof(iciba_param['context']) !='undefined' ){
	isFy=false;
	for(i=0;i<iciba_param['context'].length;i++){
		if(iciba_param['context'][i][0]=='Fy'){
			isFy=true;
			break;
		}
	}
}
if(isFy){
	document.write('<script type=\"text/javascript\" charset=\"UTF-8\" id=\"fyIntoface\" src=\"'+jsLib+'/fy.js\"><\/script>');
}


if(typeof(iciba_param['isPopIcon']) !='undefined' && iciba_param['isPopIcon']=='1'){
	if( typeof(iciba_param['isPopStyle']) =='undefined' ) iciba_param['isPopStyle']='4';
	switch(iciba_param['isPopStyle']){
		case '1':
			style='background-position:-20px -10px;  width:18px;height:24px;';
			break;
		case '2':
			style='background-position:-20px -40px;  width:18px;height:18px;';
			break;
		case '3':
			style='background-position:-20px -70px;  width:18px;height:18px;';
			break;
		case '4':
			style='background-position:-20px -100px;  width:20px;height:20px;';
			break;
		case '5':
			style='background-position:-20px -130px;  width:22px;height:22px;';
			break;
		default:
			style='background-position:-20px -100px;  width:20px;height:20px;';
	}
	document.write('<div id="icibaPopIcon" style="'+style+';display:none" >译</div>');
}


//if(K.$('icibaCssInterface')==null)
if(document.getElementById('icibaCssInterface')==null){
	if(_icbaUiType==2)CssLoad(plut_css+'hangban.css');
	else CssLoad(plut_css+'plug.css');
}

function netDictClick(i){
	//alert(i);
	var mItem=K.$('icibaNetDictWord'+i);
	var item=K.$('icibaND'+i);


	mItem.className= mItem.className=='icibaNetDictWord'?'icibaNetDictWord2':'icibaNetDictWord';
	display= item.getAttribute('display');
	display= display=='none'?'':'none';
	//alert(i);
	if(i==1){
		divs=item.getElementsByTagName('div');
		for(j=0;j<divs.length;j++){
			if(divs[j].className=='icibaNetDictItem')divs[j].style.display= display;
		}
	}else{
		item.style.display= display;
	}

	item.setAttribute('display',display);
}

function icibaLog(){
	if(K.config.isLog){
		for(  p in K.config.loadType ){
			if(K.config.loadType[p]==0){
				//alert(p+":"+K.config.loadType[p]);
				return ;
			}
		}
		q=K.$(K.config.icibaDiv).content;
		var str='';
		var cont='';//+;
		for(  p in K.config.loadType ){
			str+= cont+p.replace('_context','').replace('iciba','')+'='+K.config.loadType[p];
			cont='&';
		}
		var qvar= 'isEnglis='+(isEnglish(q)?1:-1);
		qvar += '&q='+encodeURIComponent(q);
		qvar += '&length='+q.length;
		qvar += '&hCount='+K.config.hCount;
		qvar += '&'+str;
		K.config.isLog=false;
		for(  p in K.config.loadType ){
			K.config.loadType[p]=0;
		}
	//JSLoad('http://dict-co.iciba.com/log.php?'+qvar);
	}
}
JSLoad(jsLib+'K.js');


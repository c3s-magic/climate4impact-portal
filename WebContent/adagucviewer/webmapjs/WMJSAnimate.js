var WMJSAnimate = function (_map){
  var callBack = _map.getListener();
  var imageStore = _map.getImageStore();
  var _this = this;
  
      var divAnimationInfo  = document.createElement('div');
    $(divAnimationInfo).mouseout(function(){
      _map.mouseHoverAnimationBox = false;
    });
  
      function removeAllChilds(element){
      try{
        if ( element.hasChildNodes() ){
          while ( element.childNodes.length >= 1 ){
            element.removeChild( element.firstChild );
          } 
        } 
      }catch(e){}
    }
    
   var drawAnimationBar = function(h){
    /* return;
        var total = 0;
        var done = 0;
        var loading = 0;
        var h = jQuery('<div/>', {
          'class':"animationdiv",
          mouseout:function(event){
            _map.mouseHoverAnimationBox = false;
            //_map.animationTimer.init(animationDelay, animate);
            
          }});
        
        for(var j=0;j<_map.animationList.length;j++){
          
          var animationBoxMouseOver = function(event,element){
            if(!isDefined(element.value))return;
            _map.mouseHoverAnimationBox = true;
            event.stopPropagation();preventdefault_event(event);
            _map.currentAnimationStep = element.value;
            var animationStep = _map.animationList[_map.currentAnimationStep];
            _map.setDimension(animationStep.name,animationStep.value);
            _map._pdraw(); 
            drawAnimationBar();
          };
          
          //Determine state of each "block"
          var imageReady = true;
          var prefetching = false;
          var imInP = _map.animationList[j].imagesInPrefetch;
          
          if(isDefined(imInP)){
            for(var i=0;i<imInP.length;i++){
              if(imInP[i].isLoaded() === false)imageReady = false;
              if(imInP[i].isLoading() === true)prefetching = true;
            }
          }else{
            var requests = _map.animationList[j].requests;
            for(var i=0;i<requests.length;i++){
              var image = imageStore.getImageForSrc(requests[i]);
              if(image){
                if(image.isLoaded() !== true){
                  imageReady = false;
                }
              }else{
                imageReady = false;
              }
            }
          }
          
          var  a;
          if(prefetching){
            a = $('<div/>', {value:j,'class':"animationimage animationimageprefetch",mouseover:function(event){animationBoxMouseOver(event,this);},mouseout:function(){_map.mouseHoverAnimationBox=false;}});
          }else if(imageReady){
            //debug(b.value);
            a = $('<div/>', {value:j,'class':"animationimage animationimageready",mouseover:function(event){animationBoxMouseOver(event,this);},mouseout:function(){_map.mouseHoverAnimationBox=false;}});
            done++;
          }else{
            loading++;
            a = $('<div/>', {value:j,'class':"animationimage animationimageloading",mouseover:function(event){animationBoxMouseOver(event,this);},mouseout:function(){_map.mouseHoverAnimationBox=false;}});
          }
          if(j == _map.currentAnimationStep){
            a = $('<div/>', {value:j,'class':"animationimage animationimagecurrent",mouseover:function(event){animationBoxMouseOver(event,this);},mouseout:function(){_map.mouseHoverAnimationBox=false;}});
          }
          h.append(a);
          a = null;
          total++;
        }
        var a= $('<div/>',{css:{'float':'left',width:'48px'}});
        a.html(' ['+done+'/'+total+']');
        h.append(a);
        a= null;
      
        removeAllChilds(divAnimationInfo);
        h.appendTo(divAnimationInfo);
        divAnimationInfo.style.display='';
        divAnimationInfo.style.top='8px';
        divAnimationInfo.style.right='68px';
        h= null;
    */  };//drawAnimationBar
       
    
  var animate = function(){
    // console.log("animate");
//         if(controlsBusy == true)return;
//         if(_map.isAnimating == false)return;
//         if(_map.animateBusy == true)return;
      
        
      var animationStep = _map.animationList[_map.currentAnimationStep];
      if(!animationStep){
        error("No animation step for "+_map.currentAnimationStep);
        return;
      }
      //_map.animateBusy = true;
      
      
      
      

      
      //console.log("draw on animation");
      _map.setDimension(animationStep.name,animationStep.value);
      _map._pdraw(); 
      _map.animateBusy = false;
      drawAnimationBar();
    };//animate
    
  
  var animateLoop = function(){
    
    if(_map.isAnimating == false){
      _map.isAnimatingLoopRunning = false;
      return;
    }
    var animationDelay = _map.animationDelay;
    
      if( _map.currentAnimationStep == 0 || _map.currentAnimationStep == _map.animationList.length-1){
        animationDelay = 800;
      }
      
    
    
    
    _map.animationTimer.init(animationDelay, animateLoop);
    var continueAnimation=false;
    if(_map.animationList[_map.currentAnimationStep].imagesInPrefetch!=undefined){
      if(_map.animationList[_map.currentAnimationStep].imagesInPrefetch.length==0){
        continueAnimation=true;
      }
    }else continueAnimation=true;
        
    if(continueAnimation){
      
    if(_map.mouseHoverAnimationBox === false){
      //Increase step
      animate();
      _map.currentAnimationStep++;
      if(_map.currentAnimationStep>=_map.animationList.length){
        _map.currentAnimationStep = 0;
      }
    
    }
    
    }
    
  };
    
  _map.isAnimatingLoopRunning = false;
  
  _this.checkAnimation = function(){
    //console.log("checkAnimation");
    if(_map.isAnimating == false){
      _map.isAnimatingLoopRunning = false;
      return;
    }
    if(!_map.animationTimer){
      _map.animationTimer = new WMJSTimer();
    }
    drawAnimationBar();
    //console.log("Check animation");
    callBack.triggerEvent("onnextanimationstep",_map);

      if( _map.mouseHoverAnimationBox === false){
        //_map.setDimension(animationStep.name,animationStep.value);
        //animationStep.imagesInPrefetch = _map.prefetch(animationStep.requests);
        
        var maxSimultaneousLoads=2;
        
          
        
        var numberPreCacheSteps = 106;
        for(var j=0;j<numberPreCacheSteps;j++){
          var index=j+_map.currentAnimationStep-1;
          if(index<0)index = 0;
          while(index>=_map.animationList.length)index-=_map.animationList.length;
          if(index>=0){
            //while(imageStore.getNumImagesLoading()<=maxSimultaneousLoads)
            {
            //_map.setDimension(_map.animationList[index].name,_map.animationList[index].value);
            //console.log("prefetch");
            _map.animationList[index].imagesInPrefetch = _map.prefetch(_map.animationList[index].requests);
            
//             var imInP =
           // _map.animationList[index].imagesInPrefetch;
          
//             for(var i=0;i<imInP.length;i++){
//               if(imInP[i].isLoading() == true || imInP[i].isLoaded() == false)maxSimultaneousLoads--;
//             }
//             if(maxSimultaneousLoads<=0)break;
            if(imageStore.getNumImagesLoading()>maxSimultaneousLoads)break;
            }
          }
        } 
      }

      
      
      
      
    
    if(_map.isAnimatingLoopRunning == false){
      _map.isAnimatingLoopRunning = true;
      animateLoop();
    }
    

    
  };
  
      _map.stopAnimating = function(){
      if(_map.isAnimating == false)return;
      divAnimationInfo.style.display='none';
      _map.isAnimating = false;
      _map.animateBusy = false;
      _map.rebuildMapDimensions();
      callBack.triggerEvent("onstopanimation",_map);
      
    };
    
    
    _map.currentAnimationStep = 0;
    _map.animationList = undefined;
    _map.isAnimating = false;
    _map.animationDelay = 300;
    
    _map.setAnimationDelay = function (delay){
      if(delay<1)delay=1;
      _map.animationDelay = delay;
    }

  
  
  
    
      divAnimationInfo.style.zIndex     = 10000;
      divAnimationInfo.style.background = 'none';
      divAnimationInfo.style.position   = 'absolute';
      divAnimationInfo.style.border     = 'none';
      divAnimationInfo.style.margin     = '0px';
      divAnimationInfo.style.padding    = '0px';
      //divAnimationInfo.style.border     = '1px solid #888';
      divAnimationInfo.style.lineHeight =  '14px';
      divAnimationInfo.style.fontFamily = '"Courier New", "Lucida Console", Monospace';
      divAnimationInfo.style.fontSize   = '10px';
      _map.getBaseElement().append(divAnimationInfo);
};
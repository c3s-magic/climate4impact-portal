var BasketWidget = function() {
  var t = this;
  var basketWindow = undefined;
  var basketPanel = undefined;
  var _callbackFunction;
  var initialized = false;
  var tree = undefined;
  var store = undefined;
  var openedWindows = [];
  var _init = function(){
    if(initialized == true)return;
    initialized = true;

    Ext.define('basketgrid', {
      extend : 'Ext.data.Model',
      fields : [{
        name : 'text',
        type : 'string'
      },{
        name : 'id',
        type : 'string'
      },{
        name : 'dapurl',
        type : 'string'
      },{
        name : 'hasdap',
        type : 'string'
      },{
        name : 'hashttp',
        type : 'string'
      },{
        name : 'httpurl',
        type : 'string'
      },{
        name : 'catalogurl',
        type : 'string'
      },{
        name : 'date',
        type : 'string'
      },{
        name : 'type',
        type : 'string'
      },{
        name : 'filesize',
        type : 'string'
      }]
    });

    store = Ext.create('Ext.data.TreeStore', {
      model : 'basketgrid',
      root : {
        expanded : true,
        children : []
      },
      proxy: {
        type: 'ajax',
        url : '/impactportal/ImpactService?&service=basket&request=getoverview',
        listeners:{
          exception:{
            fn:function(t, type, action, options, response, arg ){
              if(type == 'remote'){
                Ext.MessageBox.alert("Error","Remote: Unable to load basket from server: "+response+ arg);
              }else{
                if(t.getReader().rawData.statuscode == 401){
                  generateLoginDialog(function(){ 
                    store.reload();
                    //  basketWindow.show();
                  });
                  return;
                }else{
                  Ext.MessageBox.alert("Error","Response: Unable to load basket from server:\n"+ (t.getReader().rawData.message));
                }
              }
            }
          }
        }
      },
      listeners:{
        beforeload:{
          fn:function(t,a){
            tree.setLoading(true);
          }
        },
        load:{
          fn:function(t,a){
            tree.setLoading(false);
          }
        }
      }


    });

    function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }



    var getButtons = function(){
      var buttons =[{
        text : 'Link file',
        tooltip:'Link a file to your baskets remote data folder',
        iconCls : 'ext-ui-icon-link',
        handler : function() {
          openLinkDialog();
        }
      },{
        text : 'Search',
        tooltip:'Opens up the search window, data can be added to the basket from here',
        iconCls:'ext-ui-icon-search',
        handler : function() {
          var el=jQuery('<div/>');
          renderSearchInterface({
            element:el,
            service:c4iconfigjs.searchservice,
            query:"",
            catalogbrowserservice:c4iconfigjs.impactservice,
            dialog:true
          });

        }

      },{
        text : 'View',
        tooltip:'Open the NetCDF file in the fileviewer',
        iconCls:'ext-ui-icon-video',
        handler : function() {
          if (tree.getSelectionModel().hasSelection()) {
            var selectedNode = tree.getSelectionModel().getSelection();

            if(selectedNode.length>1){
              Ext.MessageBox.alert('Error','Please select a single file to browse.');
              return;
            }
            selectedNode = selectedNode[0];
            showFileInfo(selectedNode,true);
          } else {
            Ext.MessageBox.alert('Error','No selected files.');
          }
        }
      },{
        text : 'Download',
        tooltip:'Download a file from your basket via the browser',
        iconCls : 'ext-ui-icon-arrowthickstop-1-s',
        handler : function() {
          var downloadWin;
          if (tree.getSelectionModel().hasSelection()) {
            var selectedNodes = tree.getSelectionModel().getSelection();
            if ((selectedNodes.length>1)||(selectedNodes.length==0)) { 
              Ext.MessageBox.alert('Error','Please select exactly one file with HTTP enabled to download.');
            } else {
              var securePage=location.protocol=="https:";
              var selectedNode = selectedNodes[0];
              var httpURL = selectedNode.data.httpurl;
              if(!httpURL){
                Ext.MessageBox.alert('Error','Please select a file with HTTP enabled to download.');
              } else {
                if(openid){
                  if(openid!=""){
                    httpURL+="?openid="+openid;
                  }
                }
                if (downloadWin) {
                  downloadwin.close();
                }
                downloadWin=window.open(httpURL, 'dwnl', 'width=900,height=600,resizable=yes');
              }
            }
          } else {
            Ext.MessageBox.alert('Error','No selected files.');
          }
        }
      },{
        text : 'Script download',
        tooltip:'Creates a download script which is able to download multiple files at once',
        iconCls : 'ext-ui-icon-arrowthickstop-1-s',
        handler : function() {
          if (tree.getSelectionModel().hasSelection()) {
            var selectedNodes = tree.getSelectionModel().getSelection();

            console.log('INFO Script Download: '+selectedNodes.length+" files");
            var urlList=[];
            var i;
            for (i=0; i<selectedNodes.length; i++){
              var selectedNode = selectedNodes[i];
              var httpURL = selectedNode.data.httpurl;
              if(!httpURL){
                Ext.MessageBox.alert('Error','Please select a file with HTTP enabled to download.');
                continue; //return;
              }
              urlList.push(httpURL);
              console.log(selectedNode);
            }
            if (urlList.length>0) {
              var mySecureHostname="https:"+"//"+window.location.hostname;
              var scriptForm = $('<form/>', {
                action: serverurlhttps+"/account/downloadscript.jsp",
                target: "_blank",
                method: "post"
              });
              scriptForm.append($("<input/>", {
                type: "hidden",
                name: "urls",
                value: urlList.join("\r\n")
              }));
              if ((openid) && (openid != "")) {
                scriptForm.append($("<input/>", {
                  type: "hidden",
                  name: "openid",
                  value: openid
                }));
              }
              $("body").append(scriptForm);
              scriptForm.submit();
            } else {
              Ext.MessageBox.alert('Error','No selected files.');
            }
          } else {
            Ext.MessageBox.alert('Error','No selected files.');
          }
        }
      },{
        text : 'Upload',
        tooltip:'Upload a file from your  computer to your basket',
        iconCls : 'ext-ui-icon-arrowthickstop-1-n ',
        handler : function() {
          window.location='upload.jsp'; 
        }
      },{
        text : 'Delete',
        tooltip:'Deletes the selected files or directories',
        iconCls : 'ext-ui-icon-trash',
        handler : function() {




          if (tree.getSelectionModel().hasSelection()) {
            Ext.MessageBox.show({
              title:'Messagebox Title',
              msg: 'Are you sure want to delete these item(s)?',
              buttonText: {yes: "Yes, delete",no: "No!",cancel: "Cancel"},
              fn: function(btn){
                if(btn == 'yes'){
                  var selectedNode = tree.getSelectionModel().getSelection();
                  var itemsToRemove = [];
                  for(var j=0;j<selectedNode.length;j++){
                    if(selectedNode[j].data.id){
                      itemsToRemove.push(selectedNode[j].data.id);
                      if( selectedNode[j].data.leaf == true){
                        selectedNode[j].remove();
                      }else{
                        if(selectedNode[j].data.type == 'folder'){
                          selectedNode[j].remove();
                        }
                      }
                    }

                  }
                  basket.removeId(itemsToRemove,function(){t.reload();});
                  store.sync();

                }
              }
            });
          } else {
            Ext.MessageBox.alert('Error','No selected files.');
          }
          ;
        }
      },{
        text : 'Reload',
        tooltip:'Reloads the basket',

        iconCls : 'ext-ui-icon-refresh',
        handler : function() {
          store.reload();
        }
      }];

      if(_callbackFunction){
        var useFileButton =  {
            text : 'Use file(s)',
            handler : function() {
              console.log("Use files");
              var selectedNodesMixed = tree.getSelectionModel().getSelection();
              widgetExpandNodes(selectedNodesMixed,_callbackFunction);
           
            }

        };
    
        buttons.push(useFileButton);
      }
      return buttons;
    }
    
    var widgetExpandNodes = function(selectedNodesMixed,_callbackFunction){
      
      basket.expandNodes(selectedNodesMixed,
          function(selectedNodes){
            console.log("expand nodes ready");
            var doClose = _callbackFunction(selectedNodes);
            console.log("doClose: "+doClose);
              if (doClose === true) {
                for(w in openedWindows){
                  w = openedWindows[w];
                  try{
                    w.close();
                    w.destroy();
                  }catch(e){
                  }
                }
                openedWindows = [];
    
                basketWindow.close();
              }
          }
      );
    };

    var showFileInfo = function(record,frombutton){
      if (!record.get('dapurl')&&!record.get('httpurl')&&!record.get('catalogurl')) {
        if(record.get('leaf')==false){
          if(frombutton==true){
            alert("There is no information available for this entry");
          }
        }else{
          alert("There is no information available for this file");
        }
        return;
      }
      if(record.get('dapurl')||record.get('httpurl')){
        var el=jQuery('<div/>');
        renderFileViewerInterface({element:el,
          service:c4iconfigjs.impactservice,
          adagucservice:c4iconfigjs.adagucservice,
          adagucviewer:c4iconfigjs.adagucviewer,
          provenanceservice:c4iconfigjs.provenanceservice,
          //query:"http://dapurl.knmi.nl/knmi/thredds/dodsC/CLIPC/jrc/tier2/SPI3.nc",
          query:record.get('dapurl')?record.get('dapurl'):record.get('httpurl'),
          dialog:true
        });   
      }else if(record.get('catalogurl')){
        var el = jQuery('<div></div>', {
          title: record.get("id"),
        }).dialog({
          width:900,
          height:500
        });
        el.html('<div class="ajaxloader"></div>');
        //var callback = function(data){

        renderCatalogBrowser({element:el,url:record.get('catalogurl')});
        //alert("Found "+data.numFiles+" files with totalsize of "+data.fileSize+" bytes");
        //}
        //window.open('/impactportal/data/catalogbrowser.jsp?catalog='+URLEncode(record.get('catalogurl')));
      }
    };

    tree = Ext.create('Ext.tree.Panel', {
      store : store,
      rootVisible : false,
      seArrows : true,
      multiSelect : true,
      singleExpand : false,
      border:false,
      columns : [
                 {
                   xtype : 'treecolumn', // this is so we know which column will show the
                   // tree
                   text : 'File',
                   flex : 2,
                   sortable : true,
                   dataIndex : 'text'
                 },{
                   text : 'Type',
                   width : 65,
                   dataIndex : 'type',
                   hidden:true
                 },{
                   text : 'DAP',
                   width : 60,
                   dataIndex : 'hasdap'
                 },{
                   text : 'HTTP',
                   width : 60,
                   dataIndex : 'hashttp'
                 },{
                   text : 'Filesize',
                   width : 80,
                   dataIndex : 'filesize'
                 },{
                   text : 'Date',
                   width : 200,
                   dataIndex : 'date',
                   hidden:false
                 }/*,{
            text : 'Info',
            width : 40,
            menuDisabled : true,
            xtype : 'actioncolumn',
            tooltip : 'Show file information',
            align : 'center',
            iconCls : 'button_info',
            handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
              showFileInfo(record);
            }
          }*/],
          buttons : getButtons(),
          listeners:{
            itemdblclick:{
              fn:function(e,node,e){
                if(_callbackFunction){
                  var selectedNodesMixed = tree.getSelectionModel().getSelection();
                  widgetExpandNodes(selectedNodesMixed,_callbackFunction);
                }else{
                  showFileInfo(node,false);
                }
              }
            }
          }
    });
  }

  t.show = function(callbackFunction) {

    _callbackFunction = callbackFunction;
    if (basketWindow == undefined) {
      _init();
      basketWindow = Ext.create('Ext.Window', {
        width : 900,
        height : 550,
        autoScroll : true,
        autoDestroy : false,
        closeAction : 'hide',
        maximizable : true,
        frame : false,
        title : 'Basket',
        layout : 'fit',
        items : tree,
        listeners : {
          afterrender : {
            fn : function() {
              window.setTimeout(function(){store.load();;}, 300);    


            }
          }
        }
      });
    }

    basketWindow.show();
  };

  t.embed = function(element,callbackFunction){
    _callbackFunction = callbackFunction;
    _init();
    basketPanel = Ext.create('Ext.panel.Panel', {
      renderTo:element,
      autoScroll : true,
      autoDestroy : false,
      minHeight:480,
      frame : true,
      border:false,
      //title : 'Basket',
      layout : 'fit',
      items : tree,
      listeners : {
        afterrender : {
          fn : function() {
            store.load();
          }
        }
      }
    });
  }

  this.reload = function(){
    store.reload();
  };

  var linkDialog;
  var openLinkDialog=function(){

    var linkFile = function(){
      var input=Ext.getCmp('c4i-basket-linkfiletextfield').getValue().trim();
      var httpurl="null";
      var dapurl = "null";
      var catalogurl="null";

      if(input.indexOf("fileServer")!=-1){
        httpurl = input;
      }
      if(input.indexOf("dodsC")!=-1){
        dapurl= input;
      }
      if(input.endsWith(".xml")||input.endsWith(".html")){
        catalogurl= input;
        catalogurl = catalogurl.replace(".html",".xml");
      }

      if(dapurl == "null" && httpurl != "null"){
        dapurl = httpurl.replace("fileServer","dodsC");
        alert("<h1>Info:</h1> You entered a URL with HTTP enabled.<br/>Automatically derived dapurl by replacing fileServer by dodsC.");
      }
      
      if(dapurl == "null" &&httpurl == "null"&&catalogurl=="null"){
        httpurl=input;
        dapurl=input;
      }

      var id = input.substring(input.lastIndexOf("/")+1);
//      console.log(id);
//      console.log(httpurl);
//      console.log(dapurl);
//      console.log(catalogurl);
      //http://dapurl.knmi.nl/knmi/thredds/dodsC/CLIPC/tudo/tier3/WATER_LUISA_2010-2050.nc
      basket.postIdentifiersToBasket({id:id,
        httpurl:httpurl,
        dapurl:dapurl,
        catalogurl:catalogurl});
      linkDialog.close();
    };

    if(!linkDialog){

      linkDialog = Ext.create('Ext.Window', {
        width : 900,
        height : 100,
        autoScroll : true,
        autoDestroy : false,
        modal:true,
        closeAction : 'hide',
        frame : false,
        title : 'Link a file to your basket by URL',
        layout : 'fit',
        items : [{xtype:'textfield',id: 'c4i-basket-linkfiletextfield',    listeners: {
          specialkey: function(f,e){
            if(e.getKey() == e.ENTER){
              linkFile();
            }
          }
        }}],

        buttons:[{
          text:'Cancel',
          iconCls:'ext-ui-icon-cancel',
          tooltip:'Cancel',
          handler:function(){linkDialog.close();}

        },{
          text:'Link',
          tooltip:'Link this file to your basket',
          iconCls : 'ext-ui-icon-link',
          handler:function(){
            linkFile()
          }
        }]

      });
    }
    linkDialog.show();


  }
};

var basketWidget = new BasketWidget();

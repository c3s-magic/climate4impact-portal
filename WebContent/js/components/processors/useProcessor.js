var impactBase = '/impactportal/';
var impactWPSURL = '/impactportal/ImpactService?';

var configuredWPSItems = [];
var currentWPSId = undefined;

var showStatusReport = function(json) {

	var results = Ext
			.create(
					'Ext.Window',
					{
						width : 900,
						minHeight : 600,
						// autoScroll : true,
						autoDestroy : true,
						maximizable : true,
						// overflowX : 'scroll',
						// overflowY : 'scroll',
						closeAction : 'destroy',
						frame : true,
						title : 'WPS report',
						layout : {
							type : 'vbox',
							align : 'stretch',
							pack : 'start'
						},
						items : [
								{
									xtype : 'panel',
									layout : 'fit',
									autoScroll : false,
									bodyStyle : "padding:10px;background:#FFFFFF;background-color:#FFFFFF",
									collapsible : false,
									// minHeight:400,

									// title:'Results',

									listeners : {
										afterrender : {
											fn : function() {
												var failFn = function() {
													alert("Unable to show report for  "
															+ status.id);
													wresults.close();
												};
												var passFn = function(data) {
													// alert("c");
													if (data.responseText.error) {
														alert(error);
														return;
													}
													results
															.getComponent(0)
															.update(
																	data.responseText);
													results.doLayout();
													// results.render();
												};
												try {
													Ext.Ajax
															.request({
																url : impactWPSURL
																		+ 'service=processor&request=GetStatusReport&statusLocation='
																		+ json.statuslocation,
																success : passFn,
																failure : failFn
															});
												} catch (e) {
													alert('GetStatusReport: '
															+ e);
												}

											}
										}
									}
								},
								{
									xtype : 'panel',
									collapsible : false,
									collapsed : false,
									// title:'Used settings',
									layout : 'fit',
									bodyStyle : "padding:10px;background:#FFFFFF;background-color:#FFFFFF",
									items : {
										xtype : 'panel',
										title : 'Settings',
										id : 'wpsparams2',
										layout : {
											type : 'vbox',
											align : 'stretch'
										}
									// ,frame:true,border:false//,
									// buttons:[{text:'Load
									// preset',handler:function(){alert("not yet
									// implemented");}},{text:'Save
									// preset',handler:function(){alert("not yet
									// implemented");}}]

									},
									listeners : {
										afterrender : {
											fn : function(t) {
												var c = results.getComponent(1);
												// try{
												var v = json.wpspostdata;// .Execute.DataInputs;
												// console.log("Creating input
												// settings list");
												// console.log(dump(json));

												var reRunProcessInputs = [];
												// alert(id);
												// return;
												if (v) {
													// console.log("getting
													// id");
													var id = json.wpspostdata.Execute.Identifier.value;
													// console.log("id==" + id);
													var url = impactWPSURL
															+ 'service=processor&request=describeProcessor&id='
															+ id;
													var failFn = function() {
														alert("Unable to describe process:<br/>\n"
																+ url);
													};
													var passFn = function(e) {
														var json = Ext.JSON
																.decode(e.responseText);
														if (json.error) {
															alert("Error:\n"
																	+ json.error);
															return;
														}
														// alert(dump(v));

														var preConfiguredDefaultValues = v.Execute.DataInputs.Input;

														var wpsInputList = undefined;
														try {
															wpsInputList = json.ProcessDescriptions.ProcessDescription.DataInputs.Input;
														} catch (e) {
														}

														var cmp = c
																.getComponent(0);
														// cmp =
														// Ext.getCmp('wpsparams2');
														// alert(dump(wpsInputList)+dump(json.wpspostdata));
														buildWPSInterface(
																cmp,
																wpsInputList,
																reRunProcessInputs,
																preConfiguredDefaultValues);
														cmp
																.add({
																	xtype : 'button',
																	text : 'Re-run process '
																			+ id,
																	handler : function() {
																		startProcessing(
																				reRunProcessInputs,
																				id);
																	}
																});
													};
													Ext.Ajax.request({
														url : url,
														success : passFn,
														failure : failFn
													});
												} else {
													c.getComponent(0).update(
															"Unspecified");
												}
												/*
												 * }catch(e){
												 * c.update("Invalid"); }
												 */
											}
										}
									}

								} ]

					});

	results.show();
};

var processProgressMonitoring = function(status) {

	var uniqueId = status.uniqueid;

	var results = status;

	var p = Ext.create('Ext.ProgressBar', {
		region : 'south'
	});
	var t = Ext.create('Ext.form.field.TextArea', {
		region : 'center',
		border : false,
		frame : false,
		padding : 0,
		margin : 0
	});
	var b = Ext.create('Ext.button.Button', {
		text : 'view details',
		// disabled : true,
		handler : function() {
			w.showResults(results);
		}
	});
	var c = Ext.create('Ext.button.Button', {
		text : 'close',
		// disabled : true,
		handler : function() {
			w.close();
		}
	});
	var url = {
		xtype : 'panel',
		height : 25,
		html : 'Location: <a target="_blank" href="' + status.statuslocation + '">'
				+ status.statuslocation + '</a>',
		region : 'south',
		frame : true,
		border : false,
		frameHeader : false,
		padding : 0,
		margin : 0
	};
	var p2 = Ext.create('Ext.panel.Panel', {
		layout : 'border',
		items : [ t, p ],
		region : 'center',
		frame : false,
		border : false,
		frameHeader : false,
		padding : 0,
		margin : 0
	});

	var w = Ext.create('Ext.Window', {
		width : 600,
		height : 250,
		title : 'Progress ' + status.id,
		collapsible : true,
		layout : 'border',
		listeners : {
			expand : {
				fn : function() {
					p2.doLayout();
					p.updateProgress(1, '100 %', false);
					return true;
				}

			}
		},
		items : [ p2, url ],
		buttons : [ b, c ]

	});

	w.showResults = function(json) {
		/*
		 * p.updateProgress(1, 100 + " %", true); t.setValue("Completed: " +
		 * json.status); b.enable(); c.enable();
		 */
		showStatusReport(json);
	}

	w.show();

	var wpsConfig = {
		service : 'processor',
		request : 'monitorProcessor',
		id : status.id,
		statusLocation : status.statuslocation
	};

	var makeMonitorRequest = function() {

		var failFn = function() {
			alert("Unable to monitor progress for  " + status.id);
			w.close();
		};
		var passFn = function(e) {

			if (e) {
				try {
					var json = Ext.JSON.decode(e.responseText);
					if (json.error) {
						if (json.error) {
							alert("Error:\n" + json.error);
						}
						w.close();
						// setTimeout(makeMonitorRequest, 2000);
						return;
					}
				} catch (error) {
					alert("Invalid JSON string: " + e.reponseText)
					setTimeout(makeMonitorRequest, 2000);
					// w.close();
					return;
				}

			}
			try {
				if(!json.progress){
					p.updateProgress(0, "0 %", true);
					w.setTitle("Initializing");
				}else{
				
					t.setValue(json.status);
	
					var percentage = json.progress / 100;
					var percentageText = parseInt(percentage * 100) + " %";
					p.updateProgress(percentage, percentageText, true);
					w.setTitle('Progress ' + status.id + " (" + percentageText
							+ ")");
				}
			} catch (e) {
			}
			// console.log(dump(json));
			if (!json.ready) {
				setTimeout(makeMonitorRequest, 800);
			} else {
				results = json;
				w.showResults(results);
			}

		};
		try {
			Ext.Ajax.request({
				url : impactWPSURL,
				method : 'GET',
				success : passFn,
				failure : failFn,
				params : wpsConfig
			});
		} catch (e) {
			alert('makeMonitorRequest: ' + e);
		}
	};
	makeMonitorRequest();

}

/**
 * Called when user presses button 'Start processing' Scans all user input grids
 * and fields and composes a JSON object with input information for the Process.
 * This information is posted to the server.
 */
var startProcessing = function(configuredWPSItems, currentWPSId) {
	// var wpsparams=Ext.getCmp('wpsparams');
	var wpsConfig;
	var h = "[";
	for ( var j = 0; j < configuredWPSItems.length; j++) {
		if (j > 0)
			h += ";";
		h += configuredWPSItems[j].wpsid + "=";
		var store = configuredWPSItems[j].store;
		var inputs = "";
		//console.log("Configuring "+configuredWPSItems[j].wpsid );
		for ( var i = 0; i < configuredWPSItems[j].getCount(); i++) {
		    var record = configuredWPSItems[j].getValue(i);
		    if(record.enabled === true){
		    	if (inputs.length > 0)
					inputs += ",";
		    	//console.log(configuredWPSItems[j].wpsid +"=" +record.value);
				inputs += record.value;
		    }
			
		}
		h += inputs;
	}
	h += "]";
	// alert(h);
	wpsConfig = {
		service : 'processor',
		request : 'executeProcessor',
		id : currentWPSId,
		dataInputs : h
	};

	var failFn = function() {
		alert("Unable to execute process.");
	};
	var passFn = function(e) {
		try {
			var json = Ext.JSON.decode(e.responseText);
		} catch (error) {
			alert("Invalid JSON string: " + e.reponseText)
			return;
		}
		if (json.error) {
			alert("Error:\n" + json.error);
			return;
		}
		processProgressMonitoring(json);
	}

	Ext.Ajax.request({
		url : impactWPSURL,
		success : passFn,
		failure : failFn,
		params : wpsConfig
	});
}

/**
 * Returns a grid component based on a json object with structure: id:'<id of
 * the component>' title:'<title of the component displayed>; default:'<default
 * values>' Can be a comma separted list. type:'<type, can be string, etc..>'
 * 
 * @param preConfiguredInput
 *            optional, a set of preconfigured values. For example from a
 *            previousely runned process
 * 
 */
var createLiteralDataStringGrid = function(input, preConfiguredInput) {
	
	var identifier = input.Identifier.value;
	// var id=cmpidprefix+'stringarraygrid_'+identifier;
	var values = [];
	if(input.LiteralData.DefaultValue){
		if(input.LiteralData.DefaultValue.value){
			if(input.attr.maxOccurs <= 1){
				values = [input.LiteralData.DefaultValue.value.split(',')];
			}else{
				values = input.LiteralData.DefaultValue.value.split(',');
			}
		}
		
	}else{
		values = ["None"];
	}
	if (preConfiguredInput) {
		if(preConfiguredInput.length>0){
			values = [];
			//console.log("preConfiguredInput="+dump(preConfiguredInput));
			for(var j=0;j<preConfiguredInput.length;j++){
				values.push(preConfiguredInput[j].Data.LiteralData.value);
			}
		}
	}
	
	//console.log("values="+dump(values));
	
	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit : 1,
		listeners : {
			edit : {
				fn : function(editor, e, eOpts) {
				}
			}
		}
	});
	
	
	var multipleValuesAllowed = false;
	var showBasketWidget = false;
	var inputType='grid'
	var input ;	
	
	var allowedValues;
	
	if(input.attr.maxOccurs){
		if(input.attr.maxOccurs>1){
			multipleValuesAllowed = true;
		}
	}
	
	if(input.Abstract){
		if(input.Abstract.value.indexOf("application/netcdf")!=-1||input.Abstract.value.indexOf("application/opendap")!=-1){
			showBasketWidget = true;
		}
	}
	console.log(input);
	if(input.Identifier.value.indexOf("wpsnetcdfinput_files")==0){
	  showBasketWidget = true;
	}
	
	
	if(input.LiteralData.AllowedValues){
		if(input.LiteralData.AllowedValues.Value){
			allowedValues = toArray(input.LiteralData.AllowedValues.Value);
		}
		inputType = 'combo';
	}
	
	if(input.LiteralData.DataType.value == 'boolean'){
		inputType = 'combo';
	}
	
	if(inputType == 'combo'){
		
		var data = [];
		
		if(input.LiteralData.DataType.value == 'boolean'){
			data.push({"name":'True'});
			data.push({"name":'False'});
		}else{
			for(j=0;j<allowedValues.length;j++){
				data.push({"name":allowedValues[j].value});
			}
		}
		
		var store = Ext.create('Ext.data.Store', {
		    fields: [ 'name'],
		    data :data
		    
		});

		// Create the combo box, attached to the states data store
		var combo = Ext.create('Ext.form.field.ComboBox', {
		    store: store,
		    queryMode: 'local',
		    displayField: 'name',
		    valueField: 'name',
			value:values[0],
			width:160
		});

		input = Ext.create('Ext.panel.Panel',{
			title : input.Title.value ,
			wpsid : input.Identifier.value,
			wpstype : input.LiteralData.DataType.value,
			//layout : 'fit',
			frame : true,
			width : 'auto',
			padding:4,
			margin : '0 0 6 0',
			autoScroll : false,
			height : 'auto',
			border : false,
			//collapsible : true,
			collapsed : false,
			hideHeaders : true,
			items:[combo]
		});
		input.getCount = function(){
			return 1;
		};
		input.getValue = function(index){
			
			var returnValue = [];
			
			returnValue.enabled = true;
			returnValue.value = combo.getValue();
			
			
			return returnValue;
		};
	}
	
	if(inputType == 'grid'){
		var toolbar = undefined;
		if(multipleValuesAllowed === true){
			toolbar =  {
				height:30,
				padding:'3 2 3 0',
				style:{background: '#DFEAF2'},
				items:[{xtype : 'tbfill'}, {xtype : 'button',iconCls : 'icon-add',tooltip : 'Add an exta row',handler : function(d) {input.addEntry();}}]
			};
		}
		//Create the dataObject
		var data = [];
		for ( var j = 0; j < values.length; j++) {
			data.push({value : values[j],remove : 'X',enabled : true})
		}

		var store = new Ext.data.Store({
			fields : [ {
				name : 'value',
				type : 'string'
			}, {
				name : 'remove',
				type : 'float'
			}, {
				name : 'enabled',
				type : 'bool'
			}, {
				name : 'filler',
				type : 'float'
			} ],
			data : data
		});
		
		var columns = [{
			header : 'value',
			/*width : 780,*/
			flex:1,
			dataIndex : 'value',
			editor : {
				allowBlank : false
			},
			autoScroll : false
		}];
		
		if(showBasketWidget === true){
			columns.push({
				xtype : 'actioncolumn',
				header : 'drop',
			
				width : 34,
				dataIndex : 'filler',
				items : [ {
					iconCls : 'button_basket',
					tooltip : 'Use an item from your basket...',
					handler : function(grid, rowIndex, colIndex) {
					  
						basketWidget.show(function(selectedNodes) {
						  if(selectedNodes.length == 0){
						    alert("No files with opendap enabled found.");
						    return;
						  }
						  console.log(selectedNodes);
							var first = true;
							for ( var j = 0; j < selectedNodes.length || j < 1; j++) {
								if(first == true){
									first = false;
									grid.getStore().getAt(rowIndex).set('value',selectedNodes[j].dapurl);
								}else{
									grid.getStore().insert(grid.getStore().getCount()-1,{'value':selectedNodes[j].dapurl,'enabled':true});
								}
							}
							return true;
						});
					}
				} ]
			});
		}
		
		if(multipleValuesAllowed === true){
			columns.push({
				xtype : 'actioncolumn',
				// header : 'drop',
				width : 34,
				dataIndex : 'remove',
				items : [ {
					iconCls : 'button_remove',
					tooltip : 'remove',
					handler : function(grid, rowIndex, colIndex) {
						grid.getStore().removeAt(rowIndex);
					}
				} ]
			});
		}
		
		input = {
			title : input.Title.value,
			wpsid : input.Identifier.value,
			wpstype : input.LiteralData.DataType.value,
			layout : 'fit',
			xtype : 'grid',
			frame : true,
			width : 'auto',
			margin : '0 0 6 0',
			autoScroll : false,
			height : 'auto',
			border : false,
			//collapsible : true,
			collapsed : false,// ,id:id,
			hideHeaders : true,
			store : store,
			columns : columns,
			/*[
			
					{
						xtype : 'checkcolumn',
						header : 'use',
						dataIndex : 'enabled',
						width : 55
					},
					{
						xtype : 'actioncolumn',
						header : 'drop',
						width : 34,
						dataIndex : 'filler',
						items : [ {
							iconCls : 'button_basket',
							tooltip : 'Use an item from your basket...',
							handler : function(grid, rowIndex, colIndex) {
								basketWidget.show(function(selectedNodes) {
	
									var list = "";
									for ( var j = 0; j < selectedNodes.length
											|| j < 1; j++) {
										if (list.length > 0)
											list += ",";
										list += selectedNodes[j].dapurl;
									}
									grid.getStore().getAt(rowIndex).set('value',
											list);
									// alert("selected:
									// "+item+'WITH'+grid.getStore().getAt(rowIndex).get('value'));
									return true;
								});
							}
						} ]
					}, ],*/
			listeners : {
				itemclick : function(i, record) {
					this.itemClicked(i, record);
				},
				itemdblclick : function(i, record) {
					this.itemClicked(i, record);
					selectProcessor();
				}
			},
			itemClicked : function(i, record, item, index) {
				selectedProcessor = record;
			},
			bbar:toolbar,
			plugins : [ cellEditing ],
			// selType: 'cellmodel',
			// selModel: {selType: 'cellmodel'},
			addEntry : function() {
				store.add({
					value : '',
					remove : 'X',
					enabled : true
				});
			}
		}
		input.getCount = function(){
			//console.log("input.getCount = "+store.getCount());
			return store.getCount();
		};
		input.getValue = function(index){
			var record = store.getAt(index);
			var returnValue = [];
			
			returnValue.enabled = false;
			if (record.get('enabled') == true) {
				returnValue.enabled = true;
				returnValue.value = record.get('value');
			}
			
			return returnValue;
		};
	}
	
	
	
	
	
	return input;
};


var createComplexDataGrid = function(input, preConfiguredInput) {
	var data = [];
	var identifier = input.Identifier.value;
	// var id=cmpidprefix+'stringarraygrid_'+identifier;
	var values = [];
	if(input.ComplexData.DefaultValue){
		if(input.ComplexData.DefaultValue.value){
			values = input.ComplexData.DefaultValue.value.split(',');
		}
	}else{
		values = ["None"];
	}

	if (preConfiguredInput) {
		if(preConfiguredInput.length>0){
			values = [];
			for(var j=0;j<preConfiguredInput.length;j++){
				values.push(preConfiguredInput[0].Data.LiteralData.value);
			}
		}
	}
	
	for ( var j = 0; j < values.length; j++) {
		data.push({
			value : values[j],
			remove : 'X',
			enabled : true
		})
	}

	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit : 1,
		listeners : {
			edit : {
				fn : function(editor, e, eOpts) {
				}
			}
		}
	});
	var store = new Ext.data.Store({
		fields : [ {
			name : 'value',
			type : 'string'
		}, {
			name : 'remove',
			type : 'float'
		}, {
			name : 'enabled',
			type : 'bool'
		}, {
			name : 'filler',
			type : 'float'
		} ],
		data : data
	});
	var input = {
		title : input.Title.value,
		wpsid : input.Identifier.value,
		wpstype : input.ComplexData.Default.Format.MimeType.value,
		layout : 'fit',
		xtype : 'grid',
		frame : true,
		width : 'auto',
		margin : 4,
		autoScroll : false,
		height : 'auto',
		border : false,
		//collapsible : true,
		collapsed : false,// ,id:id,
		hideHeaders : true,
		store : store,
		columns : [
				{
					header : 'value',
					flex: 1,
					dataIndex : 'value',
					editor : {
						allowBlank : false
					},
					autoScroll : false
				},
				/*{
					xtype : 'checkcolumn',
					header : 'use',
					dataIndex : 'enabled',
					width : 55
				},*/
				{
					xtype : 'actioncolumn',
					header : 'drop',
				
					width : 34,
					dataIndex : 'filler',
					items : [ {
						iconCls : 'button_basket',
						tooltip : 'Use an item from your basket...',
						handler : function(grid, rowIndex, colIndex) {
							basketWidget.show(function(selectedNodes) {

								var list = "";
								for ( var j = 0; j < selectedNodes.length
										|| j < 1; j++) {
									if (list.length > 0)
										list += ",";
									list += selectedNodes[j].dapurl;
								}
								grid.getStore().getAt(rowIndex).set('value',
										list);
								// alert("selected:
								// "+item+'WITH'+grid.getStore().getAt(rowIndex).get('value'));
								return true;
							});
						}
					} ]
				}, {
					xtype : 'actioncolumn',
					// header : 'drop',
					width : 34,
				
					dataIndex : 'remove',
					items : [ {
						iconCls : 'button_remove',
						tooltip : 'Remove this row from the list',
						handler : function(grid, rowIndex, colIndex) {
							grid.getStore().removeAt(rowIndex);
						}
					} ]
				} ],
		listeners : {
			itemclick : function(i, record) {
				this.itemClicked(i, record);
			},
			itemdblclick : function(i, record) {
				this.itemClicked(i, record);
				selectProcessor();
			}
		},
		itemClicked : function(i, record, item, index) {
			selectedProcessor = record;
		},
		bbar : {
			height:30,
			padding:'3 2 3 0',
			style:{background: '#DFEAF2'},
			items:[{xtype : 'tbfill'}, {xtype : 'button',iconCls : 'icon-add',tooltip : 'Add an exta row',handler : function(d) {input.addString();}}]
		},
		plugins : [ cellEditing ],
		// selType: 'cellmodel',
		// selModel: {selType: 'cellmodel'},
		addString : function() {
			store.add({
				value : '',
				remove : 'X',
				enabled : true
			});
		}
	}
	input.getCount = function(){
		return store.getCount();
	}
	input.getValue = function(index){
		var record = store.getAt(index);
		var returnValue = [];
		
		returnValue.enabled = false;
		if (record.get('enabled') == true) {
			returnValue.enabled = true;
			returnValue.value = record.get('value');
		}
		
		return returnValue;
	}
	return input;
};

var createBoundingBoxGrid = function(input, preConfiguredInput){
	var grid = {
			title : input.Title.value+' ('+input.LiteralData.DataType.value+')',
			layout : 'hbox',
			xtype : 'panel',
			frame : true,
			width : 'auto',
			padding : 4,
			margin: 4,
			autoScroll : false,
			height : 'auto',
			border : false,
			//collapsible : true,
			collapsed : false,// ,id:id,
			hideHeaders : true,
			items:[{
				xtype:'textfield',
				width:60
			},{
				xtype:'textfield',
				width:60
			},{
				xtype:'textfield',
				width:60
			},{
				xtype:'textfield',
				width:60
			},{
				xtype:'button',
				text:'Select'
			}]
	}
	return grid;
}

var buildWPSInterface = function(componentToBuild, wpsInputList,
		configuredWPSItems, preConfiguredDefaultValues) {
	// console.log(dump(preConfiguredDefaultValues));
	if (!wpsInputList) {
		return;
	}
	for (j = 0; j < wpsInputList.length; j++) {
		var input = wpsInputList[j];
		
		var preConfiguredInput = [];
		if (preConfiguredDefaultValues) {
			for ( var i = 0; i < preConfiguredDefaultValues.length; i++) {
				if (preConfiguredDefaultValues[i].Identifier.value == input.Identifier.value) {
					preConfiguredInput.push(preConfiguredDefaultValues[i]);
				}
			}
		}
		
		/*LiteralData*/
		if (input.LiteralData) {

			
			
			/* String */
			//if (input.LiteralData.DataType.value == 'string') {
				//console.log("LiteralData->String")
				var literalDataInput = input.LiteralData;
				try {
					var item = createLiteralDataStringGrid(input, preConfiguredInput);
					if (configuredWPSItems)configuredWPSItems.push(item);
					componentToBuild.add(item);
				} catch (e) {
					alert('Describe process: ' + e);
				}
			//}
		}
		
		
		/*
     * ComplexInput
     */
    if (input.ComplexInput) {
      try {
        /* String */
        if (input.ComplexInput.Default.Format.MimeType.value == 'application/opendap') 
        {
//          console.log("ComplexData->application/netcdf")
          var literalDataInput = input.ComplexInput;
          
            var item = createComplexDataGrid(input, preConfiguredInput);
            if (configuredWPSItems)configuredWPSItems.push(item);
            componentToBuild.add(item);
          
        }
      } catch (e) {
        alert('ComplexData process: ' + e);
      }
    }
		
		/*
		 * ComplexData
		 */
		if (input.ComplexData) {
			try {
				/* String */
			//	if (input.ComplexData.Default.Format.MimeType.value == 'application/opendap') {
			//	{
//					console.log("ComplexData->application/netcdf")
					var literalDataInput = input.ComplexData;
					
						var item = createComplexDataGrid(input, preConfiguredInput);
						if (configuredWPSItems)configuredWPSItems.push(item);
						componentToBuild.add(item);
					
				//}
			} catch (e) {
				alert('ComplexData process: ' + e);
			}
		}
		
		/* Bounding Box */
		if (input.BoundingBoxData) {
			var literalDataInput = input.BoundingBoxData;
			try {
				var item = createBoundingBoxGrid(input, preConfiguredInput);
				if (configuredWPSItems)configuredWPSItems.push(item);
				componentToBuild.add(item);
			} catch (e) {
				alert('Describe process: ' + e);
			}
		}
	}
};

var wpsProcessorDetails = function(id) {

	var url = impactWPSURL + 'service=processor&request=describeProcessor&id='
			+ id;

	// List wpsProcessorDetails
	var failFn = function() {
		alert("Unable to describe process:<br/>\n" + url);
	};
	var passFn = function(e) {
		var json = Ext.JSON.decode(e.responseText);
		if (json.error) {
			alert("Error:\n" + json.error);
			return;
		}
		// alert(e.responseText);
		// alert(json.inputs[0].type);
		// alert(json.ProcessDescriptions.ProcessDescription.DataInputs.Input)
		var wpsparams = Ext.getCmp('wpsparams');
		;

		currentWPSId = id;

		var wpsInputList = undefined;
		try {
			wpsInputList = json.ProcessDescriptions.ProcessDescription.DataInputs.Input;
		} catch (e) {
		}
		if (wpsInputList == undefined) {
			// alert("No inputs available");
			// return;
		} else {

			configuredWPSItems = [];

			buildWPSInterface(wpsparams, wpsInputList, configuredWPSItems);

		}

		var wpsstart = Ext.getCmp('wpsstart');
		;
		var html ='<h1>Processor '+json.ProcessDescriptions.ProcessDescription.Title.value+'</h1>';
		  
		html+='<table class="c4i-wpsuseprocessor-table">';
		html += '<tr><td>Title:</td><td>'
				+ json.ProcessDescriptions.ProcessDescription.Title.value
				+ '</td></tr>';
		html += '<tr><td>Identifier:</td><td>'
				+ json.ProcessDescriptions.ProcessDescription.Identifier.value
				+ '</td></tr>';
		html += '<tr><td>Abstract:</td><td>'
				+ json.ProcessDescriptions.ProcessDescription.Abstract.value
				+ '</td></tr>';
		html += '<tr><td>Location:</td><td><a target="_blank" href="'
				+ json.url + '">' + json.url + '</a></td></tr>';

		html += '</table>'

		Ext.get('wpsdivdescription').update(html);
		// startProcessing();

	}
	Ext.Ajax.request({
		url : url,
		success : passFn,
		failure : failFn
	});

}

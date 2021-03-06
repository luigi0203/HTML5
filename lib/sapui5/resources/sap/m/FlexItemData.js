/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.FlexItemData");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.LayoutData");sap.ui.core.LayoutData.extend("sap.m.FlexItemData",{metadata:{library:"sap.m",properties:{"alignSelf":{type:"sap.m.FlexAlignSelf",group:"Misc",defaultValue:sap.m.FlexAlignSelf.Auto},"order":{type:"int",group:"Misc",defaultValue:0},"growFactor":{type:"float",group:"Misc",defaultValue:0},"styleClass":{type:"string",group:"Misc",defaultValue:''}}}});jQuery.sap.require("sap.ui.core.EnabledPropagator");jQuery.sap.require("sap.m.FlexBoxStylingHelper");sap.ui.core.EnabledPropagator.apply(sap.m.FlexItemData.prototype,[true]);
sap.m.FlexItemData.prototype.setAlignSelf=function(v){this.setProperty("alignSelf",v,true);sap.m.FlexBoxStylingHelper.setStyle(null,this,"align-self",v);return this};
sap.m.FlexItemData.prototype.setOrder=function(v){this.setProperty("order",v,true);sap.m.FlexBoxStylingHelper.setStyle(null,this,"order",v);return this};
sap.m.FlexItemData.prototype.setGrowFactor=function(v){this.setProperty("growFactor",v,true);sap.m.FlexBoxStylingHelper.setStyle(null,this,"flex-grow",v);return this};

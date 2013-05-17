/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.m.BarRenderer");sap.m.BarRenderer={};
sap.m.BarRenderer.render=function(r,c){var i=0;switch(c._context){case'header':r.write("<header");break;case'footer':r.write("<footer");r.addClass("sapMFooter-CTX");break;default:r.write("<div");break}r.writeControlData(c);r.addClass("sapMBar");r.addClass("sapMBar-CTX");r.writeClasses();r.write(">");r.write("<div id='");r.write(c.getId());r.write("-BarMiddle' class='sapMBarMiddle' >");if(c.getEnableFlexBox()){c._oflexBox=c._oflexBox||new sap.m.HBox(c.getId()+"-BarPH",{alignItems:"Center"}).addStyleClass("sapMBarPH").setParent(c,null,true);m=c.getContentMiddle();for(i=0;i<m.length;i++){c._oflexBox.addItem(m[i])}r.renderControl(c._oflexBox)}else{r.write("<div id='"+c.getId()+"-BarPH' class='sapMBarPH' >");var m=c.getContentMiddle();for(i=0;i<m.length;i++){r.renderControl(m[i])}r.write("</div>")}r.write("</div>");r.write("<div id='");r.write(c.getId());r.write("-BarLeft' class='sapMBarLeft' >");var l=c.getContentLeft();for(i=0;i<l.length;i++){r.renderControl(l[i])}r.write("</div>");r.write("<div id='");r.write(c.getId());r.write("-BarRight' class='sapMBarRight' >");var R=c.getContentRight();for(i=0;i<R.length;i++){r.renderControl(R[i])}r.write("</div>");switch(c._context){case'header':r.write("</header>");break;case'footer':r.write("</footer>");break;default:r.write("</div>");break}};
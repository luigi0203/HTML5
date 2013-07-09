/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.base.ManagedObject");jQuery.sap.require("jquery.sap.script");jQuery.sap.require("jquery.sap.strings");jQuery.sap.require("sap.ui.base.EventProvider");jQuery.sap.require("sap.ui.base.DataType");jQuery.sap.require("sap.ui.base.ManagedObjectMetadata");jQuery.sap.require("sap.ui.model.Model");jQuery.sap.require("sap.ui.model.Type");jQuery.sap.require("sap.ui.model.CompositeBinding");sap.ui.base.EventProvider.extend("sap.ui.base.ManagedObject",{metadata:{"abstract":true,publicMethods:["getId","getMetadata","getModel","setModel","hasModel","bindProperty","unbindProperty","bindAggregation","unbindAggregation"],library:"sap.ui.core",properties:{},aggregations:{},associations:{},events:{}},constructor:function(i,s){sap.ui.base.EventProvider.apply(this);if(typeof(i)!="string"&&arguments.length>0){s=i;if(s&&s.id){i=s["id"]}else{i=null}}if(!i){i=this.getMetadata().uid()||jQuery.sap.uid()}else{var p=sap.ui.base.ManagedObject._fnIdPreprocessor;i=(p?p.call(this,i):i);var t=sap.ui.base.DataType.getType("sap.ui.core.ID");if(!t.isValid(i)){throw new Error("\""+i+"\" is not a valid ID.")}}this.sId=i;this.mProperties=this.getMetadata().createPropertyBag();this.mAggregations={};this.mAssociations={};this.mMethods={};this.oParent=null;this.aDelegates=[];this.aBeforeDelegates=[];this.iSuppressInvalidate=0;this.oPropagatedProperties={oModels:{},oBindingContexts:{}};this.oModels={};this.oBindingContexts={};this.mBindingInfos={};this.sBindingPath=null;this.mBindingParameters=null;this.mBoundElements={};if(this._initCompositeSupport){this._initCompositeSupport(s)}if(this.init){this.init()}this.applySettings(s);if(this.register)this.register()}},sap.ui.base.ManagedObjectMetadata);
sap.ui.base.ManagedObject.create=function(d,k){if(!d||d instanceof sap.ui.base.ManagedObject||typeof d!=="object"||d instanceof String){return d}function g(t){if(typeof t==="function"){return t}if(typeof t==="string"){return jQuery.sap.getObject(t)}}var c=g(d.Type)||g(k&&k.type);if(typeof c==="function"){return new c(d)}var m="Don't know how to create a ManagedObject from "+d+" ("+(typeof d)+")";jQuery.sap.log.fatal(m);throw new Error(m)};
sap.ui.base.ManagedObject._fnIdPreprocessor=null;sap.ui.base.ManagedObject._fnSettingsPreprocessor=null;
sap.ui.base.ManagedObject.runWithPreprocessors=function(f,p){var o={id:this._fnIdPreprocessor,settings:this._fnSettingsPreprocessor};p=p||{};this._fnIdPreprocessor=p.id;this._fnSettingsPreprocessor=p.settings;try{var r=f.call();this._fnIdPreprocessor=o.id;this._fnSettingsPreprocessor=o.settings;return r}catch(e){this._fnIdPreprocessor=o.id;this._fnSettingsPreprocessor=o.settings;throw e}};
sap.ui.base.ManagedObject.prototype.applySettings=function(s){if(!s||jQuery.isEmptyObject(s)){return this}var m=this.getMetadata(),v=m.getJSONKeys(),a=sap.ui.base.ManagedObject.create,p=sap.ui.base.ManagedObject._fnSettingsPreprocessor,k,V,K;p&&p.call(this,s);if(s.models){if(typeof s.models!=="object"){throw new Error("models must be a simple object")}if(s.models instanceof sap.ui.model.Model){this.setModel(s.models)}else{for(var k in s.models){this.setModel(s.models[k],k)}}delete s.models}if(s.bindingContexts){if(typeof s.bindingContexts!=="object"){throw new Error("bindingContexts must be a simple object")}if(s.bindingContexts instanceof sap.ui.model.Context){this.setBindingContext(s.bindingContexts)}else{for(var k in s.bindingContexts){this.setBindingContext(s.bindingContexts[k],k)}}delete s.bindingContexts}for(k in s){if(K=v[k]){V=s[k];switch(K._iKind){case 0:if(this.isBinding(V,K)){var b=this.extractBindingInfo(V);this.bindProperty(k,b)}else{this[K._sMutator](V)}break;case 1:if(K.altTypes&&this.isBinding(V,K)){var b=this.extractBindingInfo(V);this.bindProperty(k,b)}else{this[K._sMutator](a(V,K))}break;case 2:if(this.isBinding(V,K)){var b=this.extractBindingInfo(V);this.bindAggregation(k,b)}else{if(V&&!jQuery.isArray(V)){V=[V]}if(V){for(var i=0,l=V.length;i<l;i++){this[K._sMutator](a(V[i],K))}}}break;case 3:this[K._sMutator](V);break;case 4:if(V&&!jQuery.isArray(V)){V=[V]}if(V){for(var i=0,l=V.length;i<l;i++){this[K._sMutator](V[i])}}break;case 5:if(typeof V=="function"){this[K._sMutator](V)}else{this[K._sMutator](V[0],V[1],V[2])}break;default:break}}}return this};
sap.ui.base.ManagedObject.prototype.toString=function(){return"ManagedObject "+this.getMetadata().getName()+"#"+this.getId()};
sap.ui.base.ManagedObject.prototype.getId=function(){return this.sId};
sap.ui.base.ManagedObject.prototype.setProperty=function(p,v,s){var o=this.mProperties[p];v=this.validateProperty(p,v);if(jQuery.sap.equal(o,v)){return this}if(s){this.iSuppressInvalidate++}this.mProperties[p]=v;if(!this.isInvalidateSuppressed()){this.invalidate()}this.updateModelProperty(p,v,o);sap.ui.base.EventProvider.prototype.fireEvent.apply(this,["_change",{"id":this.getId(),"name":p,"oldValue":o,"newValue":v}]);if(s){this.iSuppressInvalidate--}return this};
sap.ui.base.ManagedObject.prototype.getProperty=function(p){var v=this.mProperties[p],m=this.getMetadata(),P=m.getAllProperties()[p],t;if(!P){throw new Error("Property \""+p+"\" does not exist in "+this)}t=sap.ui.base.DataType.getType(P.type);if(t instanceof sap.ui.base.DataType&&t.isArrayType()&&jQuery.isArray(v)){v=v.slice(0)}if(v instanceof String){v=v.valueOf()}return v};
sap.ui.base.ManagedObject.prototype.validateProperty=function(p,v){var m=this.getMetadata(),P=m.getAllProperties()[p],t;if(!P){throw new Error("Property \""+p+"\" does not exist in "+this)}t=sap.ui.base.DataType.getType(P.type);if(t instanceof sap.ui.base.DataType&&t.isArrayType()&&jQuery.isArray(v)){v=v.slice(0)}if(v===null||v===undefined){if(P.defaultValue!==null){return P.defaultValue}else{return t.getDefaultValue()}}if(t instanceof sap.ui.base.DataType){if(t.getName()=="string"){if(!(typeof v=="string"||v instanceof String)){v=""+v}}else if(t.getName()=="string[]"){for(var i=0;i<v.length;i++){if(!typeof v[i]=="string"){v[i]=""+v[i]}}}else if(!t.isValid(v)){throw new Error("\""+v+"\" is of type "+typeof v+", expected "+t.getName()+" for property \""+p+"\" of "+this)}}else if(!(v in t)){throw new Error("\""+v+"\" is not a valid entry of the enumeration for property \""+p+"\" of "+this)}return v};
sap.ui.base.ManagedObject.prototype.getOriginInfo=function(p){var v=this.mProperties[p];if(!(v instanceof String&&v.originInfo)){return null}return v.originInfo};
sap.ui.base.ManagedObject.prototype.setAssociation=function(a,i,s){if(i instanceof sap.ui.base.ManagedObject){i=i.getId()}else if(i!=null&&typeof i!=="string"){return this}if(this.mAssociations[a]===i){return this}if(s){this.iSuppressInvalidate++}this.mAssociations[a]=i;if(!this.isInvalidateSuppressed()){this.invalidate()}if(s){this.iSuppressInvalidate--}return this};
sap.ui.base.ManagedObject.prototype.getAssociation=function(a,d){var r=this.mAssociations[a];if(!r){r=this.mAssociations[a]=d||null}else{if(typeof r.length==='number'&&!(r.propertyIsEnumerable('length'))){return r.slice()}return r}return r};
sap.ui.base.ManagedObject.prototype.addAssociation=function(a,i,s){if(i instanceof sap.ui.base.ManagedObject){i=i.getId()}else if(typeof i!=="string"){return this}if(s){this.iSuppressInvalidate++}var I=this.mAssociations[a];if(!I){I=this.mAssociations[a]=[i]}else{I.push(i)}if(!this.isInvalidateSuppressed()){this.invalidate()}if(s){this.iSuppressInvalidate--}return this};
sap.ui.base.ManagedObject.prototype.removeAssociation=function(a,o,s){var I=this.mAssociations[a];var b=null;if(s){this.iSuppressInvalidate++}if(typeof(o)=="object"&&o.getId){o=o.getId()}if(typeof(o)=="string"){for(var i=0;i<I.length;i++){if(I[i]==o){o=i;break}}}if(typeof(o)=="number"){if(o<0||o>=I.length){jQuery.sap.log.warning("ManagedObject.removeAssociation called with invalid index: "+a+", "+o)}else{b=I[o];I.splice(o,1);if(!this.isInvalidateSuppressed()){this.invalidate()}}}if(s){this.iSuppressInvalidate--}return b};
sap.ui.base.ManagedObject.prototype.removeAllAssociation=function(a,s){var i=this.mAssociations[a];if(!i){return[]}if(s){this.iSuppressInvalidate++}delete this.mAssociations[a];if(!this.isInvalidateSuppressed()){this.invalidate()}if(s){this.iSuppressInvalidate--}return i};
sap.ui.base.ManagedObject.prototype.validateAggregation=function(a,o,m){var M=this.getMetadata(),A=M.getAllAggregations()[a],b,t,i,c;if(!A){if(a&&M._mHiddenAggregations&&M._mHiddenAggregations[a]){A=M._mHiddenAggregations[a]}else{c="Aggregation \""+a+"\" does not exist in "+this;if(/^sap\.(ui\.core|ui\.commons|ui\.table|ui\.ux3|m|makit|viz|uiext\.inbox)$/.test(M.getLibraryName()||"")){throw new Error(c)}else{return o}}}if(A.multiple!==m){throw new Error("Aggregation '"+a+"' of "+this+" used with wrong cardinality (declared as "+(A.multiple?"0..n":"0..1")+")")}if(!A.multiple&&!o){return o}t=jQuery.sap.getObject(A.type);if(typeof t==="function"&&o instanceof t){return o}if(o&&o.getMetadata&&o.getMetadata().isInstanceOf(A.type)){return o}b=A.altTypes;if(b&&b.length){if(o==null){return o}for(i=0;i<b.length;i++){t=sap.ui.base.DataType.getType(b[i]);if(t instanceof sap.ui.base.DataType){if(t.isValid(o)){return o}}else if(o in t){return o}}}c="\""+o+"\" is not valid for aggregation \""+a+"\" of "+this;if(sap.ui.base.DataType.isInterfaceType(A.type)){return o}else{throw new Error(c)}};
sap.ui.base.ManagedObject.prototype.setAggregation=function(a,o,s){var O=this.mAggregations[a];if(O===o){return this}o=this.validateAggregation(a,o,false);if(s){this.iSuppressInvalidate++}if(O instanceof sap.ui.base.ManagedObject){O.setParent(null)}this.mAggregations[a]=o;if(o instanceof sap.ui.base.ManagedObject){o.setParent(this,a,s)}else{if(!this.isInvalidateSuppressed()){this.invalidate()}}if(s){this.iSuppressInvalidate--}return this};
sap.ui.base.ManagedObject.prototype.getAggregation=function(a,d){var c=this.mAggregations[a];if(!c){c=this.mAggregations[a]=d||null}if(c){if(typeof c.length==='number'&&!(c.propertyIsEnumerable('length'))){return c.slice()}return c}else{return null}};
sap.ui.base.ManagedObject.prototype.indexOfAggregation=function(a,o){var c=this.mAggregations[a];if(c){if(c.length==undefined){return-2}for(var i=0;i<c.length;i++){if(c[i]==o){return i}}}return-1};
sap.ui.base.ManagedObject.prototype.insertAggregation=function(a,o,I,s){if(!o){return this}o=this.validateAggregation(a,o,true);var c=this.mAggregations[a]||(this.mAggregations[a]=[]);var i=I<0?0:(I>c.length?c.length:I);if(i!==I){jQuery.sap.log.warning("ManagedObject.insertAggregation: index '"+I+"' out of range [0,"+c.length+"], forced to "+i)}c.splice(i,0,o);o.setParent(this,a,s);return this};
sap.ui.base.ManagedObject.prototype.addAggregation=function(a,o,s){if(!o){return this}o=this.validateAggregation(a,o,true);var c=this.mAggregations[a];if(!c){c=this.mAggregations[a]=[o]}else{c.push(o)}o.setParent(this,a,s);return this};
sap.ui.base.ManagedObject.prototype.removeAggregation=function(a,o,s){var c=this.mAggregations[a];var C=null;if(s){this.iSuppressInvalidate++}if(typeof(o)=="string"){o=sap.ui.getCore().byId(o)}if(typeof(o)=="object"){for(var i=0;i<c.length;i++){if(c[i]==o){o=i;break}}}if(typeof(o)=="number"){if(o<0||o>=c.length){jQuery.sap.log.warning("ManagedObject.removeAggregation called with invalid index: "+a+", "+o)}else{C=c[o];c.splice(o,1);C.setParent(null);if(!this.isInvalidateSuppressed()){this.invalidate()}}}if(s){this.iSuppressInvalidate--}return C};
sap.ui.base.ManagedObject.prototype.removeAllAggregation=function(a,s){var c=this.mAggregations[a];if(!c){return[]}if(s){this.iSuppressInvalidate++}delete this.mAggregations[a];for(var i=0;i<c.length;i++){c[i].setParent(null)}if(!this.isInvalidateSuppressed()){this.invalidate()}if(s){this.iSuppressInvalidate--}return c};
sap.ui.base.ManagedObject.prototype.destroyAggregation=function(a,s){var c=this.mAggregations[a];if(!c){return this}if(s){this.iSuppressInvalidate++}delete this.mAggregations[a];if(c instanceof sap.ui.base.ManagedObject){c.destroy(s)}else if(c&&jQuery.isArray(c)){for(var i=0;i<c.length;i++){if(c[i]){c[i].destroy(s)}}}if(!this.isInvalidateSuppressed()){this.invalidate()}if(s){this.iSuppressInvalidate--}return this};
sap.ui.base.ManagedObject.prototype.invalidate=function(){if(this.oParent){this.oParent.invalidate(this)}};
sap.ui.base.ManagedObject.prototype.isInvalidateSuppressed=function(){var i=this.iSuppressInvalidate>0;if(this.oParent&&this.oParent instanceof sap.ui.base.ManagedObject){i=i||this.oParent.isInvalidateSuppressed()}return i};
sap.ui.base.ManagedObject.prototype._removeChild=function(c,a,s){if(!a){jQuery.sap.log.error("Cannot remove aggregated child without aggregation name.",null,this)}else{if(s){this.iSuppressInvalidate++}var i=this.indexOfAggregation(a,c);var A=this.getMetadata().getJSONKeys()[a];if(i==-2){if(A&&this[A._sMutator]){this[A._sMutator](null)}else{this.setAggregation(a,null,s)}}else if(i>-1){if(A&&this[A._sRemoveMutator]){this[A._sRemoveMutator](i)}else{this.removeAggregation(a,i,s)}}else{}if(!this.isInvalidateSuppressed()){this.invalidate()}if(s){this.iSuppressInvalidate--}}};
sap.ui.base.ManagedObject.prototype.setParent=function(p,a,s){var t=this;if(!p){this.oParent=null;this.sParentAggregationName=null;return}if(s){this.iSuppressInvalidate++}var o=this.getParent();if(o){o._removeChild(this,this.sParentAggregationName)}this.oParent=p;this.sParentAggregationName=a;this.oPropagatedProperties.oBindingContexts=jQuery.extend({},p.oPropagatedProperties.oBindingContexts,p.oBindingContexts);this.oPropagatedProperties.oModels=jQuery.extend({},p.oPropagatedProperties.oModels,p.oModels);if(this.hasModel()){this.updateBindingContext(false,true,undefined,true);this.updateBindings(true,null,false);this.propagateProperties(true)}if(p&&!this.isInvalidateSuppressed()){p.invalidate(this)}if(s){this.iSuppressInvalidate--}return this};
sap.ui.base.ManagedObject.prototype.getParent=function(){return this.oParent};
sap.ui.base.ManagedObject.prototype.destroy=function(s){var t=this;if(s){this.iSuppressInvalidate++}if(this.exit){this.exit()}if(this._exitCompositeSupport){this._exitCompositeSupport()}for(var a in this.mAggregations){this.destroyAggregation(a,s)}if(this.deregister)this.deregister();if(this.oParent&&this.sParentAggregationName){this.oParent._removeChild(this,this.sParentAggregationName,s)}jQuery.each(this.mBindingInfos,function(n,b){if(b.factory){t.unbindAggregation(n)}else{t.unbindProperty(n)}});if(s){this.iSuppressInvalidate--}this.setParent=function(){throw Error("The object with ID "+t.getId()+" was destroyed and cannot be used anymore.")};this.bIsDestroyed=true};
sap.ui.base.ManagedObject.prototype.isBinding=function(v,k){if(v&&typeof v=="object"&&(v.path||v.parts)&&k.type!="object"){return true}if(typeof v=="string"&&jQuery.sap.startsWith(v,"{")&&jQuery.sap.endsWith(v,"}")){return true}return false};
sap.ui.base.ManagedObject.prototype.extractBindingInfo=function(v){var b;if(v&&typeof v=="object"){b=v;if(b.template){b.template=sap.ui.base.ManagedObject.create(b.template)}}if(typeof v=="string"){b={};b.path=v.substr(1,v.length-2)}return b};
sap.ui.base.ManagedObject.prototype.getBindingInfo=function(n){return this.mBindingInfos[n]};
sap.ui.base.ManagedObject.prototype.bindElement=function(p,P){var b={},m=undefined,s=p.indexOf(">");b.sBindingPath=p;b.mBindingParameters=P;if(s>0){m=p.substr(0,s);b.sBindingPath=p.substr(s+1)}this.mBoundElements[m]=b;this.updateBindingContext(false,false,m);return this};
sap.ui.base.ManagedObject.prototype.bindContext=function(p){this.bindElement(p);return this};
sap.ui.base.ManagedObject.prototype.unbindContext=function(m){return this.unbindElement(m)};
sap.ui.base.ManagedObject.prototype.unbindElement=function(m){this.mBoundElements[m].sBindingPath=null;this.mBoundElements[m].mBindingParameters=null;delete this.oBindingContexts[m];this.updateBindingContext(false,false,m);return this};
sap.ui.base.ManagedObject.prototype.bindProperty=function(n,b){var p,f,m,M,F,t,s,a=true,c=this,o=this.getMetadata(),P=o.getAllProperties()[n],k=o.getJSONKeys()[n];if(!P&&!k.altTypes){throw new Error("Property \""+n+"\" does not exist in "+this)}if(typeof b=="string"){p=arguments[1];f=arguments[2];m=arguments[3];if(typeof f=="function"){F=f}else if(f instanceof sap.ui.model.Type){t=f}b={formatter:F,parts:[{path:p,type:t,mode:m}]}}if(!b.parts){b.parts=[];b.parts[0]={path:b.path,type:b.type,model:b.model,mode:b.mode};delete b.path;delete b.mode;delete b.model}jQuery.each(b.parts,function(i,d){if(typeof d=="string"){d={path:d};b.parts[i]=d}s=d.path.indexOf(">");if(s>0){d.model=d.path.substr(0,s);d.path=d.path.substr(s+1)}if(b.parts.length>1){d.mode=sap.ui.model.BindingMode.OneWay}if(!c.getModel(d.model)){a=false}});if(this.isBound(n)){this.unbindProperty(n)}this.mBindingInfos[n]=b;if(a){this._bindProperty(n,b)}return this};
sap.ui.base.ManagedObject.prototype._bindProperty=function(n,b){var m,c,B,p=this.getMetadata().getJSONKeys()[n],t=this,a=[],M=function(){try{var v=B.getExternalValue();b.skipModelUpdate=true;t[p._sMutator](v);b.skipModelUpdate=false}catch(e){if(e instanceof sap.ui.model.FormatException){sap.ui.getCore().fireFormatError({element:t,property:n,type:B.getType(),newValue:B.getValue(),oldValue:t.getProperty(n),exception:e})}else{throw e}}};c=this.getBindingContext(b.model);jQuery.each(b.parts,function(i,P){c=t.getBindingContext(P.model);m=t.getModel(P.model);B=m.bindProperty(P.path,c,b.parameters);B.setType(P.type,p.type);if(!P.mode||!m.isBindingModeSupported(P.mode)){P.mode=m.getDefaultBindingMode()}a.push(B)});if(a.length>1){B=new sap.ui.model.CompositeBinding(a,b.useRawValues);B.setType(b.type,p.type)}else{B=a[0]}if(b.parts[0].mode!=sap.ui.model.BindingMode.OneTime){B.attachChange(M)}B.setFormatter(jQuery.proxy(b.formatter,this));b.skipModelUpdate=false;b.binding=B;b.modelChangeHandler=M;M()};
sap.ui.base.ManagedObject.prototype.unbindProperty=function(n){var b=this.mBindingInfos[n];if(b){if(b.binding){b.binding.detachChange(b.modelChangeHandler)}delete this.mBindingInfos[n]}return this};
sap.ui.base.ManagedObject.prototype.updateModelProperty=function(n,v,o){if(this.isBound(n)){var b=this.mBindingInfos[n],B=b.binding;if(b.parts[0].mode==sap.ui.model.BindingMode.TwoWay&&B&&!b.skipModelUpdate){try{B.setExternalValue(v);sap.ui.getCore().fireValidationSuccess({element:this,property:n,type:B.getType(),newValue:v,oldValue:o})}catch(e){if(e instanceof sap.ui.model.ParseException){sap.ui.getCore().fireParseError({element:this,property:n,type:B.getType(),newValue:v,oldValue:o,exception:e})}else if(e instanceof sap.ui.model.ValidateException){sap.ui.getCore().fireValidationError({element:this,property:n,type:B.getType(),newValue:v,oldValue:o,exception:e})}else{throw e}}}}};
sap.ui.base.ManagedObject.prototype.bindAggregation=function(n,b){var p,t,s,f,m=this.getMetadata(),a=m.getAllAggregations()[n];if(!a){throw new Error("Aggregation \""+n+"\" does not exist in "+this)}if(typeof b=="string"){p=arguments[1];t=arguments[2];s=arguments[3];f=arguments[4];b={path:p,sorter:s,filters:f};if(t instanceof sap.ui.base.ManagedObject){b.template=t}else if(typeof t==="function"){b.factory=t}}if(this.isBound(n)){this.unbindAggregation(n)}if(!(b.template||b.factory)){throw new Error("Missing template or factory function for aggregation "+n+" of managed object id "+this.getId()+" !")}if(b.template){b.factory=function(i){return b.template.clone(i)}}var S=b.path.indexOf(">");if(S>0){b.model=b.path.substr(0,S);b.path=b.path.substr(S+1)}this.mBindingInfos[n]=b;if(this.getModel(b.model)){this._bindAggregation(n,b)}return this};
sap.ui.base.ManagedObject.prototype._bindAggregation=function(n,b){var t=this,B,m=function(e){var u="update"+n.substr(0,1).toUpperCase()+n.substr(1);if(t[u]){t[u]()}else{t.updateAggregation(n)}};if(this.isTreeBinding(n)){B=this.getModel(b.model).bindTree(b.path,this.getBindingContext(b.model),b.filters,b.parameters)}else{B=this.getModel(b.model).bindList(b.path,this.getBindingContext(b.model),b.sorter,b.filters,b.parameters)}b.binding=B;b.modelChangeHandler=m;B.attachChange(m);m()};
sap.ui.base.ManagedObject.prototype.unbindAggregation=function(n){var b=this.mBindingInfos[n];if(b){if(b.binding){b.binding.detachChange(b.modelChangeHandler)}delete this.mBindingInfos[n]}return this};
sap.ui.base.ManagedObject.prototype.isTreeBinding=function(n){return false};
sap.ui.base.ManagedObject.prototype.updateBindings=function(u,m,r){var t=this,U,i,I;jQuery.each(this.mBindingInfos,function(n,b){U=t._updateRequired(b);I=b.binding&&b.binding.updateRequired(t.getModel(m));if(u||!b.binding||!I){if(r&&b.binding){b.binding.detachChange(b.modelChangeHandler);delete b.binding}if(!b.binding){if(U){if(b.factory){t._bindAggregation(n,b)}else{t._bindProperty(n,b)}}}}})};
sap.ui.base.ManagedObject.prototype._updateRequired=function(b){var u=true,t=this;if(b.parts&&b.parts.length>1){jQuery.each(b.parts,function(i,p){u=u&&t.getModel(p.model)})}else if(b.factory){u=!!this.getModel(b.model)}else{u=!!this.getModel(b.parts[0].model)}return u};
sap.ui.base.ManagedObject.prototype.updateAggregation=function(n){var b=this.mBindingInfos[n],B=b.binding,f=b.factory,a=this.getMetadata().getJSONKeys()[n],c,t=this;this[a._sDestructor]();if(this.isTreeBinding(n)){var N=0,u=function(C,f,B,p){jQuery.each(C,function(i,o){var I=t.getId()+"-"+N++;c=f(I,o);c.setBindingContext(o,b.model);p[a._sMutator](c);u(B.getNodeContexts(o),f,B,c)})};u(B.getRootContexts(),f,B,this)}else{jQuery.each(B.getContexts(),function(i,C){var I=t.getId()+"-"+i;c=f(I,C);c.setBindingContext(C,b.model);t[a._sMutator](c)})}};
sap.ui.base.ManagedObject.prototype.isBound=function(n){return(n in this.mBindingInfos)};
sap.ui.base.ManagedObject.prototype.getBinding=function(n){return this.mBindingInfos[n]&&this.mBindingInfos[n].binding};
sap.ui.base.ManagedObject.prototype.getBindingPath=function(n){return this.mBindingInfos[n]&&this.mBindingInfos[n].path};
sap.ui.base.ManagedObject.prototype.setBindingContext=function(c,m){this.oBindingContexts[m]=c;this.updateBindingContext(true,true,m);this.propagateProperties(true);return this};
sap.ui.base.ManagedObject.prototype.updateBindingContext=function(s,S,m,u){var M,o={},p,t=this;if(u){for(m in this.oModels){if(this.oModels.hasOwnProperty(m)){o[m]=m}}for(m in this.oPropagatedProperties.oModels){if(this.oPropagatedProperties.oModels.hasOwnProperty(m)){o[m]=m}}}else{o[m]=m}for(m in o){if(o.hasOwnProperty(m)){M=this.getModel(m);if(this.mBoundElements[m]&&this.mBoundElements[m].sBindingPath&&!s){if(this.oParent&&M==this.oParent.getModel(m)){p=this.oParent.getBindingContext(m)}if(M){M.createBindingContext(this.mBoundElements[m].sBindingPath,p,this.mBoundElements[m].mBindingParameters,function(c){t.setBindingContext(c,m);t.updateBindingContext(true,S,m)})}else{this.oBindingContexts[m]=undefined}return}var c=this.getBindingContext(m);jQuery.each(this.mBindingInfos,function(n,b){var B=b.binding;if(B&&B.updateRequired(M)){B.setContext(c)}});if(!S){jQuery.each(this.mAggregations,function(n,a){if(a instanceof sap.ui.base.ManagedObject){a.oPropagatedProperties.oBindingContexts[m]=c;a.updateBindingContext(false,false,m)}else if(a instanceof Array){for(var i=0;i<a.length;i++){a[i].oPropagatedProperties.oBindingContexts[m]=c;a[i].updateBindingContext(false,false,m)}}})}}}};
sap.ui.base.ManagedObject.prototype.getBindingContext=function(m){var M=this.getModel(m);if(this.oBindingContexts[m]){return this.oBindingContexts[m]}else if(M&&this.oParent&&this.oParent.getModel(m)&&M!=this.oParent.getModel(m)){return undefined}else{return this.oPropagatedProperties.oBindingContexts[m]}};
sap.ui.base.ManagedObject.prototype.setModel=function(m,n){if(!m&&this.oModels[n]){delete this.oModels[n];this.propagateProperties(n);this.updateBindings(false,n,true)}else if(m!==this.oModels[n]){this.oModels[n]=m;this.propagateProperties(n);if(!n){this.updateBindingContext(false,true,n)}this.updateBindings(false,n,true)}else{}return this};
sap.ui.base.ManagedObject.prototype.propagateProperties=function(n){var p=this._getPropertiesToPropagate(),u=n===true,N=u?undefined:n;jQuery.each(this.mAggregations,function(a,A){if(A instanceof sap.ui.base.ManagedObject){A.oPropagatedProperties=p;A.updateBindings(u,N,true);A.updateBindingContext(false,true,N,u);A.propagateProperties(n)}else if(A instanceof Array){for(var i=0;i<A.length;i++){if(A[i]instanceof sap.ui.base.ManagedObject){A[i].oPropagatedProperties=p;A[i].updateBindings(u,N,true);A[i].updateBindingContext(false,true,N,u);A[i].propagateProperties(n)}}}})};
sap.ui.base.ManagedObject.prototype._getPropertiesToPropagate=function(){var p,h=!jQuery.isEmptyObject(this.oModels),H=!jQuery.isEmptyObject(this.oBindingContexts);if(this.oBindingContexts||h){p={};if(h){p.oModels={};jQuery.extend(p.oModels,this.oPropagatedProperties.oModels);jQuery.each(this.oModels,function(n,m){p.oModels[n]=m})}else{p.oModels=this.oPropagatedProperties.oModels}if(H){p.oBindingContexts={};jQuery.extend(p.oBindingContexts,this.oPropagatedProperties.oBindingContexts);jQuery.each(this.oBindingContexts,function(n,b){p.oBindingContexts[n]=b})}else{p.oBindingContexts=this.oPropagatedProperties.oBindingContexts}}else{p=this.oPropagatedProperties}return p};
sap.ui.base.ManagedObject.prototype.getModel=function(n){return this.oModels[n]||this.oPropagatedProperties.oModels[n]};
sap.ui.base.ManagedObject.prototype.hasModel=function(){return!(jQuery.isEmptyObject(this.oModels)&&jQuery.isEmptyObject(this.oPropagatedProperties.oModels))};
sap.ui.base.ManagedObject.prototype.clone=function(I,l,o){var t=this,c=true,C=true;if(o){c=!!o.cloneChildren;C=!!o.cloneBindings}if(!I){I=sap.ui.base.ManagedObjectMetadata.uid("clone")||jQuery.sap.uid()}if(!l&&c){l=jQuery.map(this.findAggregatedObjects(true),function(O){return O.getId()})}var m=this.getMetadata(),a=m._oClass,s=this.getId()+"-"+I,S={},p=this.mProperties,k,b;for(k in p){if(p.hasOwnProperty(k)&&!(this.isBound(k)&&C)){S[k]=p[k]}}S["models"]=this.oModels;S["bindingContexts"]=this.oBindingContext;if(c){jQuery.each(this.mAggregations,function(n,A){if(m.hasAggregation(n)&&!(t.isBound(n)&&C)){if(A instanceof sap.ui.base.ManagedObject){S[n]=A.clone(I,l)}else if(jQuery.isArray(A)){S[n]=[];for(var i=0;i<A.length;i++){S[n].push(A[i].clone(I,l))}}else{S[n]=A}}});jQuery.each(this.mAssociations,function(n,A){if(jQuery.isArray(A)){A=A.slice(0);for(var i=0;i<A.length;i++){if(jQuery.inArray(A[i],l)>=0){A[i]+="-"+I}}}else if(jQuery.inArray(A,l)>=0){A+="-"+I}S[n]=A})}b=new a(s,S);jQuery.each(this.mEventRegistry,function(n,L){b.mEventRegistry[n]=L.slice()});if(C){jQuery.each(this.mBindingInfos,function(n,B){var d=jQuery.extend({},B);delete d.binding;if(B.factory){b.bindAggregation(n,d)}else{b.bindProperty(n,d)}})}return b};
sap.ui.base.ManagedObject._mapAggregation=function(p,o,n){var k=p.getMetadata().getJSONKeys();var O=k[o];var N=k[n];if(!O||!N||O._iKind!=2||N._iKind!=2){return}var f={"insert":true,"add":true,"remove":true,"removeAll":false,"indexOf":true,"destroy":false,"get":false};function m(P,c){return P+c.substring(0,1).toUpperCase()+c.substring(1)}function a(F){return function(){return this[F].apply(this,arguments)}}for(var P in f){var s=m(P,f[P]?O.singularName:O._sName);var b=m(P,f[P]?N.singularName:N._sName);p[s]=a(b)}};
sap.ui.base.ManagedObject.prototype.findAggregatedObjects=function(r){var A=[];function f(o){for(var n in o.mAggregations){var a=o.mAggregations[n];if(jQuery.isArray(a)){for(var i=0;i<a.length;i++){A.push(a[i]);if(r){f(a[i])}}}else if(a instanceof sap.ui.base.ManagedObject){A.push(a);if(r){f(a)}}}}f(this);return A};
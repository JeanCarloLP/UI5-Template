/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Control","sap/ui/core/CustomData","sap/ui/core/IconPool","sap/ui/core/HTML","sap/ui/core/Icon","./Button","./Toolbar","./ToolbarSpacer","./List","./MessageListItem","./library","./Text","./SegmentedButton","./Page","./NavContainer","./Link","./MessageItem","./GroupHeaderListItem","sap/ui/core/library","sap/ui/base/ManagedObject","./MessageViewRenderer","sap/ui/events/KeyCodes","sap/base/Log","sap/base/security/URLListValidator","sap/ui/thirdparty/caja-html-sanitizer"],function(e,t,i,s,a,n,o,r,l,g,u,p,c,h,d,f,_,m,y,v,I,L,T,M,B){"use strict";var P=v.ValueState;var C=v.MessageType;var S=p.ListType;var w=t.extend("sap.m.MessageView",{metadata:{library:"sap.m",properties:{asyncDescriptionHandler:{type:"any",group:"Behavior",defaultValue:null},asyncURLHandler:{type:"any",group:"Behavior",defaultValue:null},groupItems:{type:"boolean",group:"Behavior",defaultValue:false},showDetailsPageHeader:{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.MessageItem",multiple:true,singularName:"item"},headerButton:{type:"sap.m.Button",multiple:false},_navContainer:{type:"sap.m.NavContainer",multiple:false,visibility:"hidden"}},events:{afterOpen:{parameters:{openBy:{type:"sap.ui.core.Control"}},deprecated:true},itemSelect:{parameters:{item:{type:"sap.m.MessageItem"},messageTypeFilter:{type:"sap.ui.core.MessageType"}}},listSelect:{parameters:{messageTypeFilter:{type:"sap.ui.core.MessageType"}}},longtextLoaded:{},urlValidated:{},activeTitlePress:{parameters:{item:{type:"sap.m.MessageItem"}}}}}});var D="sapMMsgView";var A={back:s.getIconURI("nav-back"),close:s.getIconURI("decline"),information:s.getIconURI("message-information"),warning:s.getIconURI("message-warning"),error:s.getIconURI("message-error"),success:s.getIconURI("message-success")};var k=["all","error","warning","success","information"];var H=["asyncDescriptionHandler","asyncURLHandler"];var E={asyncDescriptionHandler:function(t){var i=t.item.getLongtextUrl();if(i){e.ajax({type:"GET",url:i,success:function(e){t.item.setDescription(e);t.promise.resolve()},error:function(){var e="A request has failed for long text data. URL: "+i;M.error(e);t.promise.reject(e)}})}}};w.setDefaultHandlers=function(e){H.forEach(function(t){if(e.hasOwnProperty(t)){E[t]=e[t]}})};w.prototype.init=function(){var e=this;this._bHasHeaderButton=false;this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._createNavigationPages();this._createLists();H.forEach(function(t){if(E.hasOwnProperty(t)){e.setProperty(t,E[t])}})};w.prototype._afterNavigate=function(){setTimeout(this["_restoreFocus"].bind(this),0);setTimeout(this["_restoreItemsType"].bind(this),0)};w.prototype._restoreFocus=function(){if(this._isListPage()&&this.getItems().length){this._oLists[this._sCurrentList||"all"].focus()}else if(this._oBackButton){this._oBackButton.focus()}};w.prototype._restoreItemsType=function(){if(this._isListPage()&&this.getItems().length>1){var e=this;this._oLists[this._sCurrentList||"all"].getItems().forEach(function(t){if(t.isA("sap.m.MessageListItem")){e._setItemType(t)}})}};w.prototype._setItemType=function(e){var t,i=e.getActiveTitle();if(!e.getTitle()||!e.getDescription()){if(i){t=".sapMSLITitleOnly a"}else{t=".sapMSLITitleOnly"}}else if(i){t=".sapMSLITitle a"}else{t=".sapMSLITitle"}var s=e.getDomRef().querySelector(t);if(s.offsetWidth<s.scrollWidth){e.setType(S.Navigation);if(this.getItems().length===1){this._fnHandleForwardNavigation(e,"show")}}};w.prototype.onBeforeRendering=function(){var e,t=this.getItems();this._clearLists();this._detailsPage.setShowHeader(this.getShowDetailsPageHeader());if(this.getGroupItems()){e=this._groupItems(t);this._fillGroupedLists(e)}else{this._fillLists(t)}var i=this.getHeaderButton();if(i){this._bHasHeaderButton=true;this._oListHeader.insertContent(i,2)}this._clearSegmentedButton();this._fillSegmentedButton();this._fnFilterList(this._getCurrentMessageTypeFilter()||"all");if(t.length===1&&this._oLists.all.getItems()[0].getType()===S.Navigation){this._fnHandleForwardNavigation(this._oLists.all.getItems()[0],"show");this._navContainer._pageStack[this._navContainer._pageStack.length-1].transition="slide"}this._makeAutomaticBinding()};w.prototype._fillGroupedLists=function(e){var t=Object.keys(e),i=t.indexOf(""),s;if(i!==-1){s=e[""];this._fillLists(s);delete e[""];t.splice(i,1)}t.forEach(function(t){this._fillListsWithGroups(t,e[t])},this)};w.prototype._fillListsWithGroups=function(e,t){var i=new y({title:e});this._oLists["all"].addAggregation("items",i,true);["error","warning","success","information"].forEach(function(e){if(this._hasGroupItemsOfType(t,e)){this._oLists[e].addAggregation("items",i.clone(),true)}},this);this._fillLists(t)};w.prototype._hasGroupItemsOfType=function(e,t){return e.some(function(e){return e.getType().toLowerCase()===t})};w.prototype.exit=function(){if(this._oLists){this._destroyLists()}if(this._oMessageItemTemplate){this._oMessageItemTemplate.destroy()}this._oResourceBundle=null;this._oListHeader=null;this._oDetailsHeader=null;this._oSegmentedButton=null;this._oBackButton=null;this._navContainer=null;this._listPage=null;this._detailsPage=null;this._sCurrentList=null};w.prototype._makeAutomaticBinding=function(){var e=this.getItems();if(!this.getBindingInfo("items")&&!e.length){this._bindToMessageModel()}};w.prototype._bindToMessageModel=function(){var e=this;this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(),"message");this._oMessageItemTemplate=new m({type:"{message>type}",title:"{message>message}",description:"{message>description}",longtextUrl:"{message>longtextUrl}"});this.bindAggregation("items",{path:"message>/",template:e._oMessageItemTemplate})};w.prototype._groupItems=function(e){var t={},i;e.forEach(function(e){i=e.getGroupName();t[i]=t[i]||[];t[i].push(e)});return t};w.prototype._onkeypress=function(e){if(e.shiftKey&&e.keyCode==T.ENTER){this.navigateBack()}};w.prototype._getListHeader=function(){return this._oListHeader||this._createListHeader()};w.prototype._getDetailsHeader=function(){return this._oDetailsHeader||this._createDetailsHeader()};w.prototype._createListHeader=function(){var e=this._oResourceBundle.getText("MESSAGEPOPOVER_CLOSE");var t=this.getId()+"-CloseBtnDescr";var i=new a(t,{content:'<span id="'+t+'" style="display: none;">'+e+"</span>"});var s=this._oResourceBundle.getText("MESSAGEPOPOVER_ARIA_HEADING");var n=this.getId()+"-HeadingDescr";var o=new a(n,{content:'<span id="'+n+'" style="display: none;" role="heading">'+s+"</span>"});this._oSegmentedButton=new h(this.getId()+"-segmented",{}).addStyleClass("sapMSegmentedButtonNoAutoWidth");this._oListHeader=new r({content:[this._oSegmentedButton,new l,i,o]});return this._oListHeader};w.prototype._createDetailsHeader=function(){var e=this._oResourceBundle.getText("MESSAGEPOPOVER_CLOSE");var t=this.getId()+"-CloseBtnDetDescr";var i=new a(t,{content:'<span id="'+t+'" style="display: none;">'+e+"</span>"});var s=this._oResourceBundle.getText("MESSAGEPOPOVER_ARIA_BACK_BUTTON_TOOLTIP");var n=this._oResourceBundle.getText("MESSAGEPOPOVER_ARIA_BACK_BUTTON");var g=this.getId()+"-BackBtnDetDescr";var u=new a(g,{content:'<span id="'+g+'" style="display: none;">'+n+"</span>"});this._oBackButton=new o({icon:A["back"],press:this.navigateBack.bind(this),ariaLabelledBy:u,tooltip:s}).addStyleClass(D+"BackBtn");this._oDetailsHeader=new r({content:[this._oBackButton,new l,i,u]});return this._oDetailsHeader};w.prototype._createNavigationPages=function(){this._listPage=new d(this.getId()+"listPage",{customHeader:this._getListHeader()});this._detailsPage=new d(this.getId()+"-detailsPage",{customHeader:this._getDetailsHeader()});this._detailsPage.addEventDelegate({onclick:function(e){var t=e.target;if(t.nodeName.toUpperCase()==="A"&&(t.className.indexOf("sapMMsgViewItemDisabledLink")!==-1||t.className.indexOf("sapMMsgViewItemPendingLink")!==-1)){e.preventDefault()}}});this._navContainer=new f(this.getId()+"-navContainer",{initialPage:this.getId()+"listPage",pages:[this._listPage,this._detailsPage],afterNavigate:this._afterNavigate.bind(this)});this.setAggregation("_navContainer",this._navContainer);return this};w.prototype._createLists=function(){this._oLists={};k.forEach(function(e){this._oLists[e]=new g({itemPress:this._fnHandleItemPress.bind(this),visible:false});this._listPage.addAggregation("content",this._oLists[e],true)},this);return this};w.prototype._clearLists=function(){k.forEach(function(e){if(this._oLists[e]){this._oLists[e].destroyAggregation("items",true)}},this);return this};w.prototype._destroyLists=function(){k.forEach(function(e){this._oLists[e]=null},this);this._oLists=null};w.prototype._fillLists=function(e){e.forEach(function(e){var t=this._mapItemToListItem(e),i=this._mapItemToListItem(e);this._oLists["all"].addAggregation("items",t,true);this._oLists[e.getType().toLowerCase()].addAggregation("items",i,true)},this)};w.prototype._mapItemToListItem=function(e){if(!e){return null}var t=e.getType(),i=this,s=this._getItemType(e),a=new u({title:I.escapeSettingsValue(e.getTitle()),description:I.escapeSettingsValue(e.getSubtitle()),counter:e.getCounter(),icon:this._mapIcon(t),infoState:this._mapInfoState(t),info:"\r",type:s,messageType:e.getType(),activeTitle:e.getActiveTitle(),activeTitlePress:function(){i.fireActiveTitlePress({item:e})}}).addStyleClass(D+"Item").addStyleClass(D+"Item"+t).toggleStyleClass(D+"ItemActive",e.getActiveTitle());if(s!==S.Navigation){a.addEventDelegate({onAfterRendering:function(){i._setItemType(a)}},this)}a._oMessageItem=e;return a};w.prototype._mapInfoState=function(e){if(!e){return null}switch(e){case C.Warning:return P.Warning;case C.Error:return P.Error;case C.Success:return P.Success;case C.Information:case C.None:return P.None;default:M.warning("The provided MessageType is not mapped to a specific ValueState",e);return null}};w.prototype._mapIcon=function(e){if(!e){return null}return A[e.toLowerCase()]};w.prototype._getItemType=function(e){return e.getDescription()||e.getMarkupDescription()||e.getLongtextUrl()?S.Navigation:S.Inactive};w.prototype._clearSegmentedButton=function(){if(this._oSegmentedButton){this._oSegmentedButton.destroyAggregation("buttons",true)}return this};w.prototype._fillSegmentedButton=function(){var e=this;var t=function(t){return function(){e._fnFilterList(t)}};k.forEach(function(e){var i=this._oLists[e],s=e=="all"?"MESSAGEPOPOVER_ALL":"MESSAGEVIEW_BUTTON_TOOLTIP_"+e.toUpperCase(),a=i.getItems().filter(function(e){return e instanceof u}).length,n;if(a>0){n=new o(this.getId()+"-"+e,{text:e=="all"?this._oResourceBundle.getText(s):a,tooltip:this._oResourceBundle.getText(s),icon:A[e],press:t(e)}).addStyleClass(D+"Btn"+e.charAt(0).toUpperCase()+e.slice(1));this._oSegmentedButton.addButton(n,true)}},this);var i=this._oSegmentedButton.getButtons().length>2;this._oSegmentedButton.setVisible(i);if(!i){this._oSegmentedButton.setSelectedButton(this._oSegmentedButton.getButtons()[0]);this._fnFilterList("all")}var s=i||this._bHasHeaderButton;this._listPage.setShowHeader(s);return this};w.prototype._setIcon=function(e,t){this._previousIconTypeClass=D+"DescIcon"+e.getType();this._oMessageIcon=new n({src:t.getIcon()}).addStyleClass(D+"DescIcon").addStyleClass(this._previousIconTypeClass);this._detailsPage.addContent(this._oMessageIcon)};w.prototype._setTitle=function(e,t){var i=e.getActiveTitle(),s,a=this,n=I.escapeSettingsValue(e.getTitle()),o=this.getId()+"MessageTitleText";if(i){s=new _(o,{text:n,ariaDescribedBy:t.getId()+"-link",press:function(){a.fireActiveTitlePress({item:e})}})}else{s=new c(o,{text:n})}s.addStyleClass("sapMMsgViewTitleText");this._detailsPage.addAggregation("content",s)};w.prototype._setDescription=function(e){var t=e.getLink();this._oLastSelectedItem=e;if(e.getMarkupDescription()){this._oMessageDescriptionText=new a(this.getId()+"MarkupDescription",{content:"<div class='sapMMsgViewDescriptionText'>"+I.escapeSettingsValue(e.getDescription())+"</div>"})}else{this._oMessageDescriptionText=new c(this.getId()+"MessageDescriptionText",{text:I.escapeSettingsValue(e.getDescription())}).addStyleClass("sapMMsgViewDescriptionText")}this._detailsPage.addContent(this._oMessageDescriptionText);if(t){var i=this._createLinkCopy(t);this._detailsPage.addContent(i);i.addStyleClass("sapMMsgViewDescriptionLink")}};w.prototype._createLinkCopy=function(e){var t,s=e.clone("","",{cloneChildren:false,cloneBindings:false}),a=e.getCustomData()||[];t=Object.keys(e.getMetadata().getProperties());t.forEach(function(t){s.setProperty(t,e.getProperty(t))});s.destroyCustomData();a.forEach(function(e){var t=new i({key:e.getKey(),value:e.getValue()});s.addCustomData(t)});return s};w.prototype._iNextValidationTaskId=0;w.prototype._validateURL=function(e){if(B.validate(e)){return e}M.warning("You have entered invalid URL");return""};w.prototype._queueValidation=function(e){var t=this.getAsyncURLHandler();var i=++this._iNextValidationTaskId;var s={};var a=new Promise(function(a,n){s.resolve=a;s.reject=n;var o={url:e,id:i,promise:s};t(o)});a.id=i;return a};w.prototype._getTagPolicy=function(){var t=this,i;var s=html.makeTagPolicy(this._validateURL());return function a(n,o){var r,l=false;if(n.toUpperCase()==="A"){for(i=0;i<o.length;){if(o[i]==="href"){l=true;r=o[i+1];o.splice(0,2);continue}i+=2}}o=s(n,o);if(l&&typeof t.getAsyncURLHandler()==="function"){o=o||[];var g="sapMMsgViewItemDisabledLink sapMMsgViewItemPendingLink";var u=o.indexOf("class");if(u>-1){o[u+1]+=g}else{o.unshift(g);o.unshift("class")}var p=o.indexOf("id");if(p>-1){o.splice(p+1,1);o.splice(p,1)}var c=t._queueValidation(r);o.push("href");o.push(r);o.push("target");o.push("_blank");o.push("id");o.push("sap-ui-"+t.getId()+"-link-under-validation-"+c.id);c.then(function(i){var s=e(document.getElementById("sap-ui-"+t.getId()+"-link-under-validation-"+i.id));if(i.allowed){M.info("Allow link "+r)}else{M.info("Disallow link "+r)}s.removeClass("sapMMsgViewItemPendingLink");s.toggleClass("sapMMsgViewItemDisabledLink",!i.allowed);t.fireUrlValidated()}).catch(function(){M.warning("Async URL validation could not be performed.")})}return o}};w.prototype._sanitizeDescription=function(e){var t=e.getDescription();if(e.getMarkupDescription()){var i=this._getTagPolicy();t=html.sanitizeWithPolicy(t,i)}e.setDescription(t);this._setDescription(e)};w.prototype._fnHandleForwardNavigation=function(e,t){var i=e._oMessageItem,s=this._detailsPage.getContent()||[],a=this.getAsyncDescriptionHandler();this._previousIconTypeClass=this._previousIconTypeClass||"";this.fireItemSelect({item:i,messageTypeFilter:this._getCurrentMessageTypeFilter()});this._clearDetailsPage.call(this,s);if(typeof a==="function"&&i.getLongtextUrl()){i.setMarkupDescription(true);var n={};var o=new Promise(function(e,t){n.resolve=e;n.reject=t});var r=function(){this._detailsPage.setBusy(false);this._navigateToDetails.call(this,i,e,t,true)}.bind(this);o.then(r).catch(function(){M.warning("Async description loading could not be performed.");r()});this._navContainer.to(this._detailsPage);this._detailsPage.setBusy(true);a({promise:n,item:i})}else{this._navigateToDetails.call(this,i,e,t,false)}this._listPage.$().attr("aria-hidden","true")};w.prototype._fnHandleItemPress=function(e){this._fnHandleForwardNavigation(e.getParameter("listItem"),"slide")};w.prototype._navigateToDetails=function(e,t,i,s){this._setTitle(e,t);this._sanitizeDescription(e);this._setIcon(e,t);this._detailsPage.invalidate();this.fireLongtextLoaded();if(!s){this._navContainer.to(this._detailsPage,i)}};w.prototype._clearDetailsPage=function(e){e.forEach(function(e){e.destroy()},this)};w.prototype.navigateBack=function(){this._listPage.$().removeAttr("aria-hidden");this._navContainer.back()};w.prototype._fnFilterList=function(e){k.forEach(function(t){if(t!=e&&this._oLists[t].getVisible()){this._oLists[t].setVisible(false)}},this);this._sCurrentList=e;this._oLists[e].setVisible(true);this.fireListSelect({messageTypeFilter:this._getCurrentMessageTypeFilter()})};w.prototype._getCurrentMessageTypeFilter=function(){return this._sCurrentList=="all"?"":this._sCurrentList};w.prototype._isListPage=function(){return this._navContainer.getCurrentPage()==this._listPage};return w});
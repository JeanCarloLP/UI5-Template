/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Core","./NotificationListBase","sap/ui/core/InvisibleText","./ListItemBase","sap/ui/core/IconPool","sap/ui/core/library","sap/ui/Device","sap/m/Button","./NotificationListGroupRenderer","sap/ui/events/KeyCodes"],function(e,t,i,o,r,s,n,a,p,u,l){"use strict";var g=n.Priority;var I=e.ButtonType;var T=t.getLibraryResourceBundle("sap.m"),h=T.getText("NOTIFICATION_LIST_GROUP_EXPAND"),c=T.getText("NOTIFICATION_LIST_GROUP_COLLAPSE"),f=T.getText("NOTIFICATION_LIST_GROUP_READ"),y=T.getText("NOTIFICATION_LIST_GROUP_UNREAD"),_="sap-icon://slim-arrow-right",d="sap-icon://slim-arrow-down";var m=a.system.desktop?400:100;var N=i.extend("sap.m.NotificationListGroup",{metadata:{library:"sap.m",properties:{collapsed:{type:"boolean",group:"Behavior",defaultValue:false},autoPriority:{type:"boolean",group:"Behavior",defaultValue:true},showEmptyGroup:{type:"boolean",group:"Behavior",defaultValue:false},enableCollapseButtonWhenEmpty:{type:"boolean",group:"Behavior",defaultValue:false},showItemsCounter:{type:"boolean",group:"Behavior",defaultValue:true},authorName:{type:"string",group:"Appearance",defaultValue:"",deprecated:true},authorPicture:{type:"sap.ui.core.URI",multiple:false,deprecated:true},datetime:{type:"string",group:"Appearance",defaultValue:"",deprecated:true}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.NotificationListItem",multiple:true,singularName:"item"},_collapseButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},events:{onCollapse:{parameters:{collapsed:{type:"boolean"}}}}}});N.prototype._getCollapseButton=function(){var e=this.getAggregation("_collapseButton"),t=this.getCollapsed();if(!e){e=new p(this.getId()+"-collapseButton",{type:I.Transparent,press:function(){var e=!this.getCollapsed();this.setCollapsed(e);this.fireOnCollapse({collapsed:e});this.getAggregation("_collapseButton").focus()}.bind(this)});this.setAggregation("_collapseButton",e,true)}e.setIcon(t?_:d);e.setTooltip(t?h:c);return e};N.prototype.init=function(){this._groupTitleInvisibleText=new o({id:this.getId()+"-invisibleGroupTitleText"})};N.prototype.exit=function(){i.prototype.exit.apply(this,arguments);if(this._groupTitleInvisibleText){this._groupTitleInvisibleText.destroy();this._groupTitleInvisibleText=null}};N.prototype.getVisibleItems=function(){var e=this.getItems().filter(function(e){return e.getVisible()});return e};N.prototype._getVisibleItemsCount=function(){return this.getVisibleItems().length};N.prototype._getGroupTitleInvisibleText=function(){var e=this.getUnread()?y:f,t,i=this.getPriority(),o,r=[e];if(i!==g.None){t=T.getText("NOTIFICATION_LIST_GROUP_PRIORITY",i);r.push(t)}if(this.getShowItemsCounter()){o=T.getText("LIST_ITEM_COUNTER",[this._getVisibleItemsCount()]);r.push(o)}return this._groupTitleInvisibleText.setText(r.join(" "))};N.prototype.getPriority=function(){if(!this.getAutoPriority()){return this.getProperty("priority")}var e=this.getAggregation("items");var t=g.None;if(e){e.forEach(function(e){t=b(t,e.getPriority())})}else{t=this.getProperty("priority")}return t};function b(e,t){if(e==t){return e}if(e=="None"){return t}if(e=="Low"&&t!="None"){return t}if(e=="Medium"&&(t!="None"&&t!="Low")){return t}return e}N.prototype.onBeforeRendering=function(){i.prototype.onBeforeRendering.apply(this,arguments);this._getCollapseButton().setVisible(this.getEnableCollapseButtonWhenEmpty()||this._getVisibleItemsCount()>0)};N.prototype._isMaxNumberReached=function(){return this.getItems().length>m};N.prototype._getMaxNumberReachedMsg=function(){return{title:T.getText("NOTIFICATION_LIST_GROUP_MAX_NOTIFICATIONS_TITLE",this.getItems().length-m),description:T.getText("NOTIFICATION_LIST_GROUP_MAX_NOTIFICATIONS_BODY")}};return N});
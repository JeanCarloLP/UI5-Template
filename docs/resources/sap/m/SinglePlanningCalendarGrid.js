/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.getCore().loadLibrary("sap.ui.unified");sap.ui.define(["./SinglePlanningCalendarUtilities","sap/ui/core/Control","sap/ui/core/LocaleData","sap/ui/core/Locale","sap/ui/core/InvisibleText","sap/ui/core/format/DateFormat","sap/ui/core/date/UniversalDate","sap/ui/core/dnd/DragInfo","sap/ui/core/dnd/DropInfo","sap/ui/core/dnd/DragDropInfo","sap/ui/unified/library","sap/ui/unified/CalendarAppointment","sap/ui/unified/calendar/DatesRow","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/calendar/CalendarUtils","sap/ui/unified/DateTypeRange","sap/ui/events/KeyCodes","./SinglePlanningCalendarGridRenderer","sap/ui/core/delegate/ItemNavigation","sap/ui/thirdparty/jquery","./PlanningCalendarLegend"],function(t,e,a,i,n,o,r,s,l,g,p,d,u,c,h,m,f,D,_,C,v){"use strict";var y=69,A=48,S=34,R=25,M=36e5/2,H=60*1e3,P=7,T=0,b=24;var w=e.extend("sap.m.SinglePlanningCalendarGrid",{metadata:{library:"sap.m",properties:{startDate:{type:"object",group:"Data"},startHour:{type:"int",group:"Data",defaultValue:0},endHour:{type:"int",group:"Data",defaultValue:24},fullDay:{type:"boolean",group:"Data",defaultValue:true},enableAppointmentsDragAndDrop:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsResize:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsCreate:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{appointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"appointment",dnd:{draggable:true}},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},_columnHeaders:{type:"sap.ui.unified.calendar.DatesRow",multiple:false,visibility:"hidden"},_intervalPlaceholders:{type:"sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",multiple:true,visibility:"hidden",dnd:{droppable:true}},_blockersPlaceholders:{type:"sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",multiple:true,visibility:"hidden",dnd:{droppable:true}}},dnd:true,associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.m.PlanningCalendarLegend",multiple:false}},events:{appointmentSelect:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},appointments:{type:"sap.ui.unified.CalendarAppointment[]"}}},appointmentDrop:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"},copy:{type:"boolean"}}},appointmentResize:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"}}},appointmentCreate:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}},cellPress:{parameters:{startDate:{type:"object"},endDate:{type:"object"}}}}}});w.prototype.init=function(){var t=new Date,e=new u(this.getId()+"-columnHeaders",{showDayNamesLine:false,showWeekNumbers:false,startDate:t}).addStyleClass("sapMSinglePCColumnHeader"),a=(60-t.getSeconds())*1e3,i=this._getCoreLocaleData().getTimePattern("medium");e._setAriaRole("columnheader");this.setAggregation("_columnHeaders",e);this.setStartDate(t);this._setColumns(7);this._configureBlockersDragAndDrop();this._configureAppointmentsDragAndDrop();this._configureAppointmentsResize();this._configureAppointmentsCreate();this._oUnifiedRB=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");this._oFormatStartEndInfoAria=o.getDateTimeInstance({pattern:"EEEE dd/MM/YYYY 'at' "+i});this._oFormatAriaFullDayCell=o.getDateTimeInstance({pattern:"EEEE dd/MM/YYYY"});this._sLegendId=undefined;setTimeout(this._updateRowHeaderAndNowMarker.bind(this),a)};w.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation}};w.prototype.onBeforeRendering=function(){var t=this._createAppointmentsMap(this.getAppointments()),e=this.getStartDate(),a=c.fromLocalJSDate(e),i=this._getColumns();this._oVisibleAppointments=this._calculateVisibleAppointments(t.appointments,this.getStartDate(),i);this._oAppointmentsToRender=this._calculateAppointmentsLevelsAndWidth(this._oVisibleAppointments);this._aVisibleBlockers=this._calculateVisibleBlockers(t.blockers,a,i);this._oBlockersToRender=this._calculateBlockersLevelsAndWidth(this._aVisibleBlockers);if(this._iOldColumns!==i||this._oOldStartDate!==e){this._createBlockersDndPlaceholders(e,i);this._createAppointmentsDndPlaceholders(e,i)}};w.prototype.onmousedown=function(t){var e=t.target.classList;this._isResizeHandleBottomMouseDownTarget=e.contains("sapMSinglePCAppResizeHandleBottom");this._isResizeHandleTopMouseDownTarget=e.contains("sapMSinglePCAppResizeHandleTop")};w.prototype._isResizingPerformed=function(){return this._isResizeHandleBottomMouseDownTarget||this._isResizeHandleTopMouseDownTarget};w.prototype._configureBlockersDragAndDrop=function(){this.addDragDropConfig(new g({sourceAggregation:"appointments",targetAggregation:"_blockersPlaceholders",dragStart:function(t){if(!this.getEnableAppointmentsDragAndDrop()){t.preventDefault();return false}var e=function(){var t=C(".sapMSinglePCOverlay");setTimeout(function(){t.addClass("sapMSinglePCOverlayDragging")});C(document).one("dragend",function(){t.removeClass("sapMSinglePCOverlayDragging")})};e()}.bind(this),dragEnter:function(t){var e=t.getParameter("dragSession"),a=e.getDragControl(),i=e.getDropControl(),n=this.isAllDayAppointment(a.getStartDate(),a.getEndDate()),o=function(){var t=C(e.getIndicator()),o=a.$().outerHeight(),r=a.$().outerWidth(),s=i.$().closest(".sapMSinglePCBlockersColumns").get(0).getBoundingClientRect(),l=i.getDomRef().getBoundingClientRect(),g=l.left+r-(s.left+s.width);if(n){t.css("min-height",o);t.css("min-width",Math.min(r,r-g))}else{t.css("min-height",e.getDropControl().$().outerHeight());t.css("min-width",e.getDropControl().$().outerWidth())}};if(!e.getIndicator()){setTimeout(o,0)}else{o()}}.bind(this),drop:function(t){var e=t.getParameter("dragSession"),a=e.getDragControl(),i=e.getDropControl(),n=i.getDate().getJSDate(),o,r=t.getParameter("browserEvent"),s=r.metaKey||r.ctrlKey,l=this.isAllDayAppointment(a.getStartDate(),a.getEndDate());o=new Date(n);if(l){o.setMilliseconds(a.getEndDate().getTime()-a.getStartDate().getTime())}this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");if(l&&a.getStartDate().getTime()===n.getTime()){return}this.fireAppointmentDrop({appointment:a,startDate:n,endDate:o,copy:s})}.bind(this)}))};w.prototype._configureAppointmentsDragAndDrop=function(){this.addDragDropConfig(new g({sourceAggregation:"appointments",targetAggregation:"_intervalPlaceholders",dragStart:function(t){if(!this.getEnableAppointmentsDragAndDrop()||this._isResizingPerformed()){t.preventDefault();return false}var e=function(){var t=C(".sapMSinglePCOverlay");setTimeout(function(){t.addClass("sapMSinglePCOverlayDragging")});C(document).one("dragend",function(){t.removeClass("sapMSinglePCOverlayDragging")})};e()}.bind(this),dragEnter:function(t){var e=t.getParameter("dragSession"),a=e.getDragControl(),i=e.getDropControl(),n=this.isAllDayAppointment(a.getStartDate(),a.getEndDate()),o=function(){var t=C(e.getIndicator()),o=a.$().outerHeight(),r=i.$().closest(".sapMSinglePCColumn").get(0).getBoundingClientRect(),s=e.getDropControl().getDomRef().getBoundingClientRect(),l=s.top+o-(r.top+r.height);if(n){t.css("min-height",2*e.getDropControl().$().outerHeight())}else{t.css("min-height",Math.min(o,o-l))}};if(!e.getIndicator()){setTimeout(o,0)}else{o()}}.bind(this),drop:function(t){var e=t.getParameter("dragSession"),a=e.getDragControl(),i=e.getDropControl(),n=i.getDate().getJSDate(),o,r=t.getParameter("browserEvent"),s=r.metaKey||r.ctrlKey,l=this.isAllDayAppointment(a.getStartDate(),a.getEndDate());o=new Date(n);if(l){o.setHours(o.getHours()+1)}else{o.setMilliseconds(a.getEndDate().getTime()-a.getStartDate().getTime())}this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");if(!l&&a.getStartDate().getTime()===n.getTime()){return}this.fireAppointmentDrop({appointment:a,startDate:n,endDate:o,copy:s})}.bind(this)}))};w.prototype._configureAppointmentsResize=function(){var t=new g({sourceAggregation:"appointments",targetAggregation:"_intervalPlaceholders",dragStart:function(t){if(!this.getEnableAppointmentsResize()||!this._isResizingPerformed()){t.preventDefault();return}var e=t.getParameter("dragSession"),a=this.$().find(".sapMSinglePCOverlay"),i=C(e.getIndicator()),n=e.getDragControl().$();if(this._isResizeHandleBottomMouseDownTarget){e.setComplexData("bottomHandle","true")}if(this._isResizeHandleTopMouseDownTarget){e.setComplexData("topHandle","true")}i.addClass("sapUiDnDIndicatorHide");setTimeout(function(){a.addClass("sapMSinglePCOverlayDragging")},0);C(document).one("dragend",function(){var t=e.getComplexData("appointmentStartingBoundaries");a.removeClass("sapMSinglePCOverlayDragging");i.removeClass("sapUiDnDIndicatorHide");n.css({top:t.top,height:t.height,"z-index":"auto",opacity:1})});t.getParameter("browserEvent").dataTransfer.setDragImage(E(),0,0)}.bind(this),dragEnter:function(t){var e=t.getParameter("dragSession"),a=e.getDragControl().$().get(0),i=e.getDropControl().getDomRef(),n=e.getComplexData("appointmentStartingBoundaries"),o=function(){var t=C(e.getIndicator());t.addClass("sapUiDnDIndicatorHide")},r,s,l,g,p;if(!n){n={top:a.offsetTop,bottom:a.offsetTop+a.getBoundingClientRect().height,height:a.getBoundingClientRect().height};e.setComplexData("appointmentStartingBoundaries",n)}g=e.getData("bottomHandle")?n.top:n.bottom;r=Math.min(g,i.offsetTop);s=Math.max(g,i.offsetTop+i.getBoundingClientRect().height);l=s-r;p={top:r,height:l,"z-index":1,opacity:.8};e.getDragControl().$().css(p);if(!e.getIndicator()){setTimeout(o,0)}else{o()}},drop:function(t){var e=t.getParameter("dragSession"),a=e.getDragControl(),i=this.indexOfAggregation("_intervalPlaceholders",e.getDropControl()),n=e.getComplexData("appointmentStartingBoundaries"),o;o=this._calcResizeNewHoursAppPos(a.getStartDate(),a.getEndDate(),i,e.getComplexData("bottomHandle"));this.$().find(".sapMSinglePCOverlay").removeClass("sapMSinglePCOverlayDragging");C(e.getIndicator()).removeClass("sapUiDnDIndicatorHide");a.$().css({top:n.top,height:n.height,"z-index":"auto",opacity:1});if(a.getEndDate().getTime()===o.endDate.getTime()&&a.getStartDate().getTime()===o.startDate.getTime()){return}this.fireAppointmentResize({appointment:a,startDate:o.startDate,endDate:o.endDate})}.bind(this)});this.addDragDropConfig(t)};w.prototype._configureAppointmentsCreate=function(){this.addDragDropConfig(new g({targetAggregation:"_intervalPlaceholders",dragStart:function(t){if(!this.getEnableAppointmentsCreate()){t.preventDefault();return}var e=t.getParameter("browserEvent");var a=this.$().find(".sapMSinglePCOverlay");setTimeout(function(){a.addClass("sapMSinglePCOverlayDragging")});C(document).one("dragend",function(){a.removeClass("sapMSinglePCOverlayDragging");C(".sapUiAppCreate").remove();C(".sapUiDnDDragging").removeClass("sapUiDnDDragging")});e.dataTransfer.setDragImage(E(),0,0);var i=t.getParameter("target"),n=i.getAggregation("_intervalPlaceholders"),o=n[0].getDomRef().getBoundingClientRect(),r=o.height,s=Math.floor((o.top-i.getDomRef().getBoundingClientRect().top)/r),l=t.getParameter("dragSession"),g=Math.floor(e.offsetY/r)-s,p,d;if(this._iColumns===1){p=g}else{var u=64,c=2,h=Math.floor(n[0].getDomRef().getBoundingClientRect().width)-c,m=Math.floor(Math.floor(e.offsetX-u)/h),f=n.length/this._iColumns;p=g+m*f}if(p<0){p=0}d=n[p].getDomRef().getBoundingClientRect();l.setComplexData("startingRectsDropArea",{top:Math.ceil(g*r),left:d.left});l.setComplexData("startingDropDate",n[p].getDate())}.bind(this),dragEnter:function(t){var e=t.getParameter("dragSession"),a=e.getDropControl(),i=a.getDomRef(),n=i.offsetHeight,o=i.offsetTop,r=o,s=i.getBoundingClientRect().left,l=s,g=a.$().parents(".sapMSinglePCColumn").get(0),p=C(".sapUiAppCreate");if(!p.get(0)){p=C("<div></div>").addClass("sapUiCalendarApp sapUiCalendarAppType01 sapUiAppCreate");p.appendTo(g)}C(".sapUiDnDDragging").removeClass("sapUiDnDDragging");if(!e.getComplexData("startingRectsDropArea")){e.setComplexData("startingRectsDropArea",{top:o,left:s});e.setComplexData("startingDropDate",a.getDate())}else{r=e.getComplexData("startingRectsDropArea").top;l=e.getComplexData("startingRectsDropArea").left}if(s!==l){t.preventDefault();return false}a.$().closest(".sapMSinglePCColumn").find(".sapMSinglePCAppointments").addClass("sapUiDnDDragging");p.css({top:Math.min(r,o)+2,height:Math.abs(r-o)+n-4,left:3,right:3,"z-index":2});e.setIndicatorConfig({display:"none"})},drop:function(t){var e=t.getParameter("dragSession"),a=e.getDropControl(),i=30*60*1e3,n=e.getComplexData("startingDropDate").getTime(),o=a.getDate().getJSDate().getTime(),r=Math.min(n,o),s=Math.max(n,o)+i;this.fireAppointmentCreate({startDate:new Date(r),endDate:new Date(s)});C(".sapUiAppCreate").remove();C(".sapUiDnDDragging").removeClass("sapUiDnDDragging")}.bind(this)}))};w.prototype._calcResizeNewHoursAppPos=function(t,e,a,i){var n=30*60*1e3,o=this.getAggregation("_intervalPlaceholders")[a].getDate().getTime(),r=o+n,s=i?t.getTime():e.getTime(),l=Math.min(s,o),g=Math.max(s,r);return{startDate:new Date(l),endDate:new Date(g)}};w.prototype._adjustAppointmentsHeightforCompact=function(t,e,a){var i,n,o,r,s,l,g,p,d=this._getRowHeight(),u=this;if(this._oAppointmentsToRender[t]){this._oAppointmentsToRender[t].oAppointmentsList.getIterator().forEach(function(c){i=c.getData();n=C("div[data-sap-day='"+t+"'].sapMSinglePCColumn #"+i.getId());o=i.getStartDate();r=i.getEndDate();g=e.getTime()>o.getTime();p=a.getTime()<r.getTime();s=g?0:u._calculateTopPosition(o);l=p?0:u._calculateBottomPosition(r);n.css("top",s);n.css("bottom",l);n.find(".sapUiCalendarApp").css("min-height",d/2-3)})}};w.prototype._adjustBlockersHeightforCompact=function(){var t=this._getBlockersToRender().iMaxlevel,e=(t+1)*this._getBlockerRowHeight(),a=this._getColumns()===1?e+P:e,i=this._getBlockerRowHeight();if(t>0){a=a+3}this.$().find(".sapMSinglePCBlockersColumns").css("height",a);this._oBlockersToRender.oBlockersList.getIterator().forEach(function(t){t.getData().$().css("top",i*t.level+1)})};w.prototype._adjustBlockersHeightforCozy=function(){var t=this._getBlockersToRender()&&this._getBlockersToRender().iMaxlevel,e;if(this._getColumns()===1){e=(t+1)*this._getBlockerRowHeight();this.$().find(".sapMSinglePCBlockersColumns").css("height",e+P)}};w.prototype.onAfterRendering=function(){var t=this._getColumns(),e=this.getStartDate(),a=this._getRowHeight();if(a===A){for(var i=0;i<t;i++){var n=new c(e.getFullYear(),e.getMonth(),e.getDate()+i),o=this._getDateFormatter().format(n.toLocalJSDate()),s=new r(n.getYear(),n.getMonth(),n.getDate(),this._getVisibleStartHour()),l=new r(n.getYear(),n.getMonth(),n.getDate(),this._getVisibleEndHour(),59,59);this._adjustAppointmentsHeightforCompact(o,s,l)}this._adjustBlockersHeightforCompact()}else{this._adjustBlockersHeightforCozy()}this._updateRowHeaderAndNowMarker();B.call(this)};w.prototype._appFocusHandler=function(t,e){var a=sap.ui.getCore().byId(t.target.id);if(a&&a.isA("sap.ui.unified.CalendarAppointment")){this.fireAppointmentSelect({appointment:undefined,appointments:this._toggleAppointmentSelection(undefined,true)});this._focusCellWithKeyboard(a,e);t.preventDefault()}};w.prototype._cellFocusHandler=function(t,e){var a=t.target,i=this._getDateFormatter(),n;if(a.classList.contains("sapMSinglePCRow")||a.classList.contains("sapMSinglePCBlockersColumn")){n=i.parse(a.getAttribute("data-sap-start-date"));if(this._isBorderReached(n,e)){this.fireEvent("borderReached",{startDate:n,next:e===f.ARROW_RIGHT,fullDay:a.classList.contains("sapMSinglePCBlockersColumn")})}}};w.prototype.onsapup=function(t){this._appFocusHandler(t,f.ARROW_UP)};w.prototype.onsapdown=function(t){this._appFocusHandler(t,f.ARROW_DOWN)};w.prototype.onsapright=function(t){this._appFocusHandler(t,f.ARROW_RIGHT);this._cellFocusHandler(t,f.ARROW_RIGHT)};w.prototype.onsapleft=function(t){this._appFocusHandler(t,f.ARROW_LEFT);this._cellFocusHandler(t,f.ARROW_LEFT)};w.prototype.setStartDate=function(t){this._oOldStartDate=this.getStartDate();this.getAggregation("_columnHeaders").setStartDate(t);return this.setProperty("startDate",t)};w.prototype.applyFocusInfo=function(t){var e=this._getVisibleBlockers(),a=this._getVisibleAppointments(),i=Object.keys(a),n,o,r;for(o=0;o<e.length;++o){if(e[o].getId()===t.id){e[o].focus();return this}}for(o=0;o<i.length;++o){n=a[i[o]];for(r=0;r<n.length;++r){if(n[r].getId()===t.id){n[r].focus();return this}}}return this};w.prototype.getSelectedAppointments=function(){return this.getAppointments().filter(function(t){return t.getSelected()})};w.prototype._toggleAppointmentSelection=function(t,e){var a=[],i,n,o;if(e){i=this.getAppointments();for(o=0,n=i.length;o<n;o++){if((!t||i[o].getId()!==t.getId())&&i[o].getSelected()){i[o].setProperty("selected",false);a.push(i[o])}}}if(t){t.setProperty("selected",!t.getSelected());a.push(t)}return a};w.prototype._isBorderReached=function(t,e){var a=c.fromLocalJSDate(this.getStartDate()),i=new c(a.getYear(),a.getMonth(),a.getDate()+this._getColumns()-1),n=c.fromLocalJSDate(t),o=e===f.ARROW_LEFT&&n.isSame(a),r=e===f.ARROW_RIGHT&&n.isSame(i);return o||r};w.prototype._focusCellWithKeyboard=function(t,e){var a=this.isAllDayAppointment(t.getStartDate(),t.getEndDate()),i=this._getDateFormatter(),n=new Date(t.getStartDate().getFullYear(),t.getStartDate().getMonth(),t.getStartDate().getDate(),t.getStartDate().getHours()),o=new Date(this.getStartDate().getFullYear(),this.getStartDate().getMonth(),this.getStartDate().getDate(),this.getStartDate().getHours());if(n<o){n=o}if(this._isBorderReached(n,e)){this.fireEvent("borderReached",{startDate:n,next:e===f.ARROW_RIGHT,fullDay:a});return}switch(e){case f.ARROW_UP:if(!a){n.setHours(n.getHours()-1)}break;case f.ARROW_DOWN:if(!a){n.setHours(n.getHours()+1)}break;case f.ARROW_LEFT:n.setDate(n.getDate()-1);break;case f.ARROW_RIGHT:n.setDate(n.getDate()+1);break;default:}if(a&&e!==f.ARROW_DOWN){C("[data-sap-start-date='"+i.format(n)+"'].sapMSinglePCBlockersColumn").trigger("focus")}else{C("[data-sap-start-date='"+i.format(n)+"'].sapMSinglePCRow").trigger("focus")}};w.prototype.ontap=function(t){this._fireSelectionEvent(t)};w.prototype.onkeydown=function(t){if(t.which===f.SPACE||t.which===f.ENTER){this._fireSelectionEvent(t);t.preventDefault()}};w.prototype._fireSelectionEvent=function(t){var e=t.srcControl,a=t.target;if(t.target.classList.contains("sapMSinglePCRow")||t.target.classList.contains("sapMSinglePCBlockersColumn")){this.fireEvent("cellPress",{startDate:this._getDateFormatter().parse(a.getAttribute("data-sap-start-date")),endDate:this._getDateFormatter().parse(a.getAttribute("data-sap-end-date"))});this.fireAppointmentSelect({appointment:undefined,appointments:this._toggleAppointmentSelection(undefined,true)})}else if(e&&e.isA("sap.ui.unified.CalendarAppointment")){this.fireAppointmentSelect({appointment:e,appointments:this._toggleAppointmentSelection(e,!(t.ctrlKey||t.metaKey))})}};w.prototype._getVisibleStartHour=function(){return this.getFullDay()||!this.getStartHour()?T:this.getStartHour()};w.prototype._getVisibleEndHour=function(){return(this.getFullDay()||!this.getEndHour()?b:this.getEndHour())-1};w.prototype._isVisibleHour=function(t){var e=this.getStartHour(),a=this.getEndHour();if(!this.getStartHour()){e=T}if(!this.getEndHour()){a=b}return e<=t&&t<a};w.prototype._shouldHideRowHeader=function(t){var e=(new Date).getHours(),a=h._areCurrentMinutesLessThan(15)&&e===t,i=h._areCurrentMinutesMoreThan(45)&&e===t-1;return a||i};w.prototype._parseDateStringAndHours=function(t,e){var a=this._getDateFormatter().parse(t);if(e){a.setHours(e)}return a};w.prototype._getDateFormatter=function(){if(!(this._oDateFormat instanceof o)){this._oDateFormat=o.getDateTimeInstance({pattern:"YYYYMMdd-HHmm"})}return this._oDateFormat};w.prototype._formatTimeAsString=function(t){var e=this._getHoursPattern()+":mm",a=o.getDateTimeInstance({pattern:e},new i(this._getCoreLocaleId()));return a.format(t)};w.prototype._addAMPM=function(t){var e=this._getAMPMFormat();return" "+e.format(t)};w.prototype._calculateTopPosition=function(t){var e=t.getHours()-this._getVisibleStartHour(),a=t.getMinutes(),i=this._getRowHeight();return Math.floor(i*e+i/60*a)};w.prototype._calculateBottomPosition=function(t){var e=this._getVisibleEndHour()+1-t.getHours(),a=t.getMinutes(),i=this._getRowHeight();return Math.floor(i*e-i/60*a)};w.prototype._updateRowHeaderAndNowMarker=function(){var t=new Date;this._updateNowMarker(t);this._updateRowHeaders(t);setTimeout(this._updateRowHeaderAndNowMarker.bind(this),H)};w.prototype._updateNowMarker=function(t){var e=this.$("nowMarker"),a=this.$("nowMarkerText"),i=this.$("nowMarkerAMPM"),n=!this._isVisibleHour(t.getHours());e.toggleClass("sapMSinglePCNowMarkerHidden",n);e.css("top",this._calculateTopPosition(t)+"px");a.text(this._formatTimeAsString(t));i.text(this._addAMPM(t));a.append(i)};w.prototype._updateRowHeaders=function(t){var e=this.$(),a=t.getHours(),i=a+1;e.find(".sapMSinglePCRowHeader").removeClass("sapMSinglePCRowHeaderHidden");if(this._shouldHideRowHeader(a)){e.find(".sapMSinglePCRowHeader"+a).addClass("sapMSinglePCRowHeaderHidden")}else if(this._shouldHideRowHeader(i)){e.find(".sapMSinglePCRowHeader"+i).addClass("sapMSinglePCRowHeaderHidden")}};w.prototype._createAppointmentsMap=function(t){var e=this;return t.reduce(function(t,a){var i=a.getStartDate(),n=a.getEndDate(),o,r,s;if(!i||!n){return t}if(!e.isAllDayAppointment(i,n)){o=c.fromLocalJSDate(i);r=c.fromLocalJSDate(n);while(o.isSameOrBefore(r)){s=e._getDateFormatter().format(o.toLocalJSDate());if(!t.appointments[s]){t.appointments[s]=[]}t.appointments[s].push(a);o.setDate(o.getDate()+1)}}else{t.blockers.push(a)}return t},{appointments:{},blockers:[]})};w.prototype._calculateVisibleAppointments=function(t,e,a){var i={},n,o,r;for(var s=0;s<a;s++){n=new c(e.getFullYear(),e.getMonth(),e.getDate()+s);o=this._getDateFormatter().format(n.toLocalJSDate());r=this._isAppointmentFitInVisibleHours(n);if(t[o]){i[o]=t[o].filter(r,this).sort(this._sortAppointmentsByStartHourCallBack)}}return i};w.prototype._isAppointmentFitInVisibleHours=function(t){return function(e){var a=e.getStartDate().getTime(),i=e.getEndDate().getTime(),n=new r(t.getYear(),t.getMonth(),t.getDate(),this._getVisibleStartHour()).getTime(),o=new r(t.getYear(),t.getMonth(),t.getDate(),this._getVisibleEndHour(),59,59).getTime();var s=a<n&&i>o,l=a>=n&&a<o,g=i>n&&i<=o;return s||l||g}};w.prototype._calculateAppointmentsLevelsAndWidth=function(e){var a=this;return Object.keys(e).reduce(function(i,n){var o=0,r=new t.list,s=e[n];s.forEach(function(e){var a=new t.node(e),i=e.getStartDate().getTime();if(r.getSize()===0){r.add(a);return}r.getIterator().forEach(function(t){var e=true,n=t.getData(),r=n.getStartDate().getTime(),s=n.getEndDate().getTime(),l=s-r;if(l<M){s=s+(M-l)}if(i>=r&&i<s){a.level++;o=Math.max(o,a.level)}if(t.next&&t.next.level===a.level){e=false}if(i>=s&&e){this.interrupt()}});r.insertAfterLevel(a.level,a)});i[n]={oAppointmentsList:a._calculateAppointmentsWidth(r),iMaxLevel:o};return i},{})};w.prototype._calculateAppointmentsWidth=function(e){e.getIterator().forEach(function(a){var i=a.getData(),n=a.level,o=a.level,r=i.getStartDate().getTime(),s=i.getEndDate().getTime(),l=s-r;if(l<M){s=s+(M-l)}new t.iterator(e).forEach(function(t){var e=t.getData(),i=t.level,l=e.getStartDate().getTime(),g=e.getEndDate().getTime(),p=g-l;if(p<M){g=g+(M-p)}if(o>=i){return}if(r>=l&&r<g||s>l&&s<g||r<=l&&s>=g){a.width=i-o;this.interrupt();return}if(n<i){n=i;a.width++}})});return e};w.prototype._calculateVisibleBlockers=function(t,e,a){var i=new c(e.getYear(),e.getMonth(),e.getDate()+a-1),n=this._isBlockerVisible(e,i);return t.filter(n).sort(this._sortAppointmentsByStartHourCallBack)};w.prototype._isBlockerVisible=function(t,e){return function(a){var i=c.fromLocalJSDate(a.getStartDate()),n=c.fromLocalJSDate(a.getEndDate());var o=i.isBefore(t)&&n.isAfter(e),r=h._isBetween(i,t,e,true),s=h._isBetween(n,t,e,true);return o||r||s}};w.prototype._calculateBlockersLevelsAndWidth=function(e){var a=0,i=new t.list;e.forEach(function(e){var n=new t.node(e),o=c.fromLocalJSDate(e.getStartDate()),r=c.fromLocalJSDate(e.getEndDate());n.width=h._daysBetween(r,o);if(i.getSize()===0){i.add(n);return}i.getIterator().forEach(function(t){var e=true,i=t.getData(),r=c.fromLocalJSDate(i.getStartDate()),s=c.fromLocalJSDate(i.getEndDate());if(o.isSameOrAfter(r)&&o.isSameOrBefore(s)){n.level++;a=Math.max(a,n.level)}if(t.next&&t.next.level===n.level){e=false}if(o.isSameOrAfter(s)&&e){this.interrupt()}});i.insertAfterLevel(n.level,n)},this);return{oBlockersList:i,iMaxlevel:a}};w.prototype._sortAppointmentsByStartHourCallBack=function(t,e){return t.getStartDate().getTime()-e.getStartDate().getTime()||e.getEndDate().getTime()-t.getEndDate().getTime()};w.prototype._getVisibleAppointments=function(){return this._oVisibleAppointments};w.prototype._getAppointmentsToRender=function(){return this._oAppointmentsToRender};w.prototype._getVisibleBlockers=function(){return this._aVisibleBlockers};w.prototype._getBlockersToRender=function(){return this._oBlockersToRender};w.prototype._setColumns=function(t){this._iOldColumns=this._iColumns;this._iColumns=t;this.getAggregation("_columnHeaders").setDays(t);this.invalidate();return this};w.prototype._getColumns=function(){return this._iColumns};w.prototype._getRowHeight=function(){return this._isCompact()?A:y};w.prototype._getBlockerRowHeight=function(){return this._isCompact()?R:S};w.prototype._isCompact=function(){var t=this.getDomRef();while(t&&t.classList){if(t.classList.contains("sapUiSizeCompact")){return true}t=t.parentNode}return false};w.prototype._getCoreLocaleId=function(){if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString()}return this._sLocale};w.prototype._getCoreLocaleData=function(){var t,e;if(!this._oLocaleData){t=this._getCoreLocaleId();e=new i(t);this._oLocaleData=a.getInstance(e)}return this._oLocaleData};w.prototype._hasAMPM=function(){var t=this._getCoreLocaleData();return t.getTimePattern("short").search("a")>=0};w.prototype._getHoursFormat=function(){var t=this._getCoreLocaleId();if(!this._oHoursFormat||this._oHoursFormat.oLocale.toString()!==t){var e=new i(t),a=this._getHoursPattern();this._oHoursFormat=o.getTimeInstance({pattern:a},e)}return this._oHoursFormat};w.prototype._getHoursPattern=function(){return this._hasAMPM()?"h":"H"};w.prototype._getAMPMFormat=function(){var t=this._getCoreLocaleId(),e=new i(t);if(!this._oAMPMFormat||this._oAMPMFormat.oLocale.toString()!==t){this._oAMPMFormat=o.getTimeInstance({pattern:"a"},e)}return this._oAMPMFormat};w.prototype._getColumnHeaders=function(){return this.getAggregation("_columnHeaders")};w.prototype._getAppointmentAnnouncementInfo=function(t){var e=this._oUnifiedRB.getText("CALENDAR_START_TIME"),a=this._oUnifiedRB.getText("CALENDAR_END_TIME"),i=this._oFormatStartEndInfoAria.format(t.getStartDate()),n=this._oFormatStartEndInfoAria.format(t.getEndDate()),o=e+": "+i+"; "+a+": "+n;return o+"; "+v.findLegendItemForItem(sap.ui.getCore().byId(this._sLegendId),t)};w.prototype.enhanceAccessibilityState=function(t,e){if(t.getId()===this._getColumnHeaders().getId()){e.labelledby=n.getStaticId("sap.m","PLANNINGCALENDAR_DAYS")}};w.prototype._getCellStartEndInfo=function(t,e){var a=this._oUnifiedRB.getText("CALENDAR_START_TIME"),i=this._oUnifiedRB.getText("CALENDAR_END_TIME"),n=!e;if(n){return a+": "+this._oFormatAriaFullDayCell.format(t)+"; "}return a+": "+this._oFormatStartEndInfoAria.format(t)+"; "+i+": "+this._oFormatStartEndInfoAria.format(e)};w.prototype.isAllDayAppointment=function(t,e){return h._isMidnight(t)&&h._isMidnight(e)};w.prototype._createBlockersDndPlaceholders=function(t,e){this.destroyAggregation("_blockersPlaceholders");for(var a=0;a<e;a++){var i=new r(t.getFullYear(),t.getMonth(),t.getDate()+a);var n=new I({date:i});this.addAggregation("_blockersPlaceholders",n,true)}};w.prototype._createAppointmentsDndPlaceholders=function(t,e){var a=this._getVisibleStartHour(),i=this._getVisibleEndHour();this._dndPlaceholdersMap={};this.destroyAggregation("_intervalPlaceholders");for(var n=0;n<e;n++){var o=new c(t.getFullYear(),t.getMonth(),t.getDate()+n);if(!this._dndPlaceholdersMap[o]){this._dndPlaceholdersMap[o]=[]}for(var s=a;s<=i;s++){var l=this._dndPlaceholdersMap[o],g=o.getYear(),p=o.getMonth(),d=o.getDate();l.push(this._createAppointmentsDndPlaceHolder(new r(g,p,d,s)));l.push(this._createAppointmentsDndPlaceHolder(new r(g,p,d,s,30)))}}};w.prototype._createAppointmentsDndPlaceHolder=function(t){var e=new I({date:t});this.addAggregation("_intervalPlaceholders",e,true);return e};w.prototype._getSpecialDates=function(){var t=this.getSpecialDates();for(var e=0;e<t.length;e++){var a=t[e].getSecondaryType()===p.CalendarDayType.NonWorking&&t[e].getType()!==p.CalendarDayType.NonWorking;if(a){var i=new m;i.setType(p.CalendarDayType.NonWorking);i.setStartDate(t[e].getStartDate());if(t[e].getEndDate()){i.setEndDate(t[e].getEndDate())}t.push(i)}}return t};function E(){var t=C("<span></span>").addClass("sapUiCalAppResizeGhost");t.appendTo(document.body);setTimeout(function(){t.remove()},0);return t.get(0)}var I=e.extend("sap.m.SinglePlanningCalendarGrid._internal.IntervalPlaceholder",{metadata:{library:"sap.m",properties:{date:{type:"object",group:"Data"}}},renderer:{apiVersion:2,render:function(t,e){t.openStart("div",e).class("sapMSinglePCPlaceholder").openEnd().close("div")}}});function B(){var t=this.getDomRef(),e=this.$().find(".sapMSinglePCBlockersColumn").toArray();this._aGridCells=Array.prototype.concat(e);for(var a=0;a<=this._getVisibleEndHour();++a){e=this.$().find("div[data-sap-hour='"+a+"']").toArray();this._aGridCells=this._aGridCells.concat(e)}if(!this._oItemNavigation){this._oItemNavigation=new _;this.addDelegate(this._oItemNavigation)}this._oItemNavigation.setRootDomRef(t);this._oItemNavigation.setItemDomRefs(this._aGridCells);this._oItemNavigation.setCycling(false);this._oItemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"],saphome:["alt","meta"],sapend:["meta"]});this._oItemNavigation.setTableMode(true,true).setColumns(this._getColumns());this._oItemNavigation.setPageSize(this._aGridCells.length)}return w});
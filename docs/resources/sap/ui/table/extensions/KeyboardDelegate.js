/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../utils/TableUtils","../library","sap/ui/base/Object","sap/ui/Device","sap/ui/events/KeyCodes","sap/ui/thirdparty/jquery"],function(e,t,i,o,n,s){"use strict";var r=e.CELLTYPE;var l=t.SelectionMode;var a={CTRL:1,SHIFT:2,ALT:4};var f=5;var u="1rem";function g(e,t){e.setMarked("sapUiTableSkipItemNavigation",t!==false)}var c=i.extend("sap.ui.table.extensions.KeyboardDelegate",{constructor:function(e){i.call(this)},destroy:function(){i.prototype.destroy.apply(this,arguments)},getInterface:function(){return this}});function v(t,i){if(!h(t,i)){return}var o=e.getCellInfo(e.getCell(t,i.target));if(o.isOfType(r.ANYCOLUMNHEADER)){d(t,o,i)}else if(o.isOfType(r.ANYCONTENTCELL)){C(t,o,i)}}function d(t,i,o){var n=e.getHeaderRowCount(t);if(e.isNoDataVisible(t)){var s=e.getFocusedItemInfo(t);if(s.row-n<=1){g(o)}}else if(i.isOfType(r.COLUMNROWHEADER)&&n>1){g(o);e.focusItem(t,n*(e.getVisibleColumnCount(t)+1),o)}}function C(t,i,o){var n=t._getKeyboardExtension();var s=n.isInActionMode();var r=c._isKeyCombination(o,null,a.CTRL);var l=r||s;var f=e.getParentCell(t,o.target);if(!l&&f){f.trigger("focus");return}g(o);if(e.isLastScrollableRow(t,i.cell)){var u=I(t,o);if(u){o.preventDefault();return}}if(i.rowIndex===t.getRows().length-1){if(!s&&f){f.trigger("focus")}else{var v=t.getCreationRow();if(!v||!v._takeOverKeyboardHandling(o)){n.setActionMode(false)}}return}S(t,i.type,i.rowIndex+1,i.columnIndex,l);o.preventDefault()}function p(t,i){var o=e.getCellInfo(e.getCell(t,i.target));if(!o.isOfType(r.ANYCONTENTCELL)||!h(t,i)){return}var n=c._isKeyCombination(i,null,a.CTRL);var s=t._getKeyboardExtension();var l=s.isInActionMode();var f=n||l;var u=e.getParentCell(t,i.target);if(!f&&u){u.trigger("focus");return}g(i);if(e.isFirstScrollableRow(t,o.cell)){var v=E(t,i);if(v){i.preventDefault();return}}if(o.rowIndex===0){g(i,o.isOfType(r.ROWACTION)||f);if(!l&&u){u.trigger("focus")}else{s.setActionMode(false)}return}S(t,o.type,o.rowIndex-1,o.columnIndex,f);i.preventDefault()}function h(e,t){var i=c._isKeyCombination(t,null,a.CTRL);return!t.isMarked()&&(i||!(t.target instanceof window.HTMLInputElement)&&!(t.target instanceof window.HTMLTextAreaElement))}function m(t,i){if(i.isMarked()){return}var o=e.getCellInfo(e.getCell(t,i.target));var n=sap.ui.getCore().getConfiguration().getRTL();if(!o.isOfType(r.COLUMNHEADER)||!n){return}var s=e.getFocusedItemInfo(t);var l=s.cellInRow-(e.hasRowHeader(t)?1:0);var a=e.getVisibleColumnCount(t);if(e.hasRowActions(t)&&l===a-1){g(i)}}function I(e,t,i,o){var n=e._getFirstRenderedRowIndex()===e._getMaxFirstRenderedRowIndex();if(n){return null}T(e,t,true,i,o);return true}function E(e,t,i,o){var n=e._getFirstRenderedRowIndex()===0;if(n){return false}T(e,t,false,i,o);return true}function T(t,i,o,n,s){var l=e.getCellInfo(e.getCell(t,i.target));var f=t._getKeyboardExtension().isInActionMode();var u=c._isKeyCombination(i,null,a.CTRL);var g=u||f;var v=f&&l.isOfType(r.DATACELL);if(v){t._getKeyboardExtension()._setSilentFocus(t.getDomRef("focusDummy"));setTimeout(function(){t._getScrollExtension().scrollVertically(o===true,n)},0)}else{t._getScrollExtension().scrollVertically(o===true,n)}if(g||s){t.attachEventOnce("rowsUpdated",function(){if(s){s()}else{S(t,l.type,l.rowIndex,l.columnIndex,true)}})}}function R(e,t){var i=e._getRowCounts();var o=I(e,t,false,function(){y(e,i.fixedTop+i.scrollable-1)});if(o){return}if(i.fixedBottom>0){y(e,i.fixedTop+i.scrollable)}else{e._getKeyboardExtension().setActionMode(false)}}function y(t,i){var o=t.getRows()[i];var n=o.isGroupHeader()||e.isRowSelectorSelectionAllowed(t);if(n){S(t,r.ROWHEADER,i)}else{var s=c._getFirstInteractiveElement(o);if(s){c._focusElement(t,s[0])}else{S(t,r.DATACELL,i,0,false,true);if(o.getIndex()===t._getTotalRowCount()-1){t._getKeyboardExtension().setActionMode(false)}}}}function A(e,t){var i=e._getRowCounts();var o=E(e,t,false,function(){O(e,i.fixedTop)});if(o){return}if(i.fixedTop>0){O(e,i.fixedTop-1)}else{e._getKeyboardExtension().setActionMode(false)}}function O(t,i){var o=t.getRows()[i];var n=o.isGroupHeader()||e.isRowSelectorSelectionAllowed(t);var s=c._getLastInteractiveElement(o);if(s){c._focusElement(t,s[0])}else if(n){S(t,r.ROWHEADER,i)}else{S(t,r.DATACELL,i,0,false,true);if(o.getIndex()===0){t._getKeyboardExtension().setActionMode(false)}}}function _(t,i){var o=e.getFocusedItemInfo(t);var n=t._getKeyboardExtension()._getLastFocusedCellInfo();e.focusItem(t,o.cellInRow+o.columnCount*n.row,i)}function x(t,i){var o=e.getFocusedItemInfo(t);e.focusItem(t,o.cellInRow,i)}function w(e,t){e._getKeyboardExtension()._setSilentFocus(e.$().find("."+t))}c._isKeyCombination=function(e,t,i){if(i==null){i=0}var s=typeof t==="string"?String.fromCharCode(e.charCode):e.keyCode;var r=0;r|=(o.os.macintosh?e.metaKey:e.ctrlKey)&&t!==n.CONTROL?a.CTRL:0;r|=e.shiftKey&&t!==n.SHIFT?a.SHIFT:0;r|=e.altKey&&t!==n.ALT?a.ALT:0;var l=t==null||s===t;var f=i===r;return l&&f};function L(t,i){var o=e.getCell(t,i);var n=e.getCellInfo(o);return t.getRows()[n.rowIndex]}function b(t,i){var o=e.getCellInfo(i.target);if(o.isOfType(r.COLUMNROWHEADER)){t._getSelectionPlugin().onHeaderSelectorPress()}else if(c._isElementGroupToggler(t,i.target)){L(t,i.target).toggleExpandedState()}else if(o.isOfType(r.ROWHEADER)){l()}else if(o.isOfType(r.DATACELL|r.ROWACTION)){var n=!t.hasListeners("cellClick");if(!t._findAndfireCellEvent(t.fireCellClick,i)){if(e.isRowSelectionAllowed(t)){l();n=false}}if(n){var s=e.getInteractiveElements(i.target);if(s){t._getKeyboardExtension().setActionMode(true)}}}function l(){var o=null;if(t._legacyMultiSelection){o=function(e){t._legacyMultiSelection(e,i);return true}}e.toggleRowSelection(t,i.target,null,o)}}function N(t,i){var o=t.getParent();var n=o._getVisibleColumns();var s=n.indexOf(t);var r;if(i&&s<n.length-1){r=o.indexOfColumn(n[s+1])+1}else if(!i&&s>0){r=o.indexOfColumn(n[s-1])}if(r!=null){e.Column.moveColumnTo(t,r)}}function D(e,t){var i=e.getColumns().filter(function(e){return e.getVisible()||e.getGrouped()});for(var o=0;o<i.length;o++){var n=i[o];if(n===t){return o}}return-1}c._focusElement=function(t,i,o){if(!t||!i){return}if(o==null){o=false}e.deselectElementText(document.activeElement);if(o){t._getKeyboardExtension()._setSilentFocus(i)}else{i.focus()}e.selectElementText(i)};function S(t,i,o,n,s,l){if(!t||i==null||o==null||o<0||o>=t.getRows().length){return}var a=t.getRows()[o];var f;if(i===r.ROWHEADER){t._getKeyboardExtension()._setFocus(t.getDomRef("rowsel"+o));return}else if(i===r.ROWACTION){f=t.getDomRef("rowact"+o)}else if(i===r.DATACELL&&(n!=null&&n>=0)){var u=t.getColumns()[n];var g=D(t,u);if(g>=0){f=a.getDomRef("col"+g)}}if(!f){return}if(s){var v=e.getInteractiveElements(f);if(v){c._focusElement(t,v[0]);return}}if(l){t._getKeyboardExtension()._bStayInActionMode=true}f.focus()}c._isElementGroupToggler=function(t,i){return e.Grouping.isInGroupHeaderRow(i)||e.Grouping.isInTreeMode(t)&&i.classList.contains("sapUiTableCellFirst")&&(i.querySelector(".sapUiTableTreeIconNodeOpen")||i.querySelector(".sapUiTableTreeIconNodeClosed"))||i.classList.contains("sapUiTableTreeIconNodeOpen")||i.classList.contains("sapUiTableTreeIconNodeClosed")};c._isElementInteractive=function(t){if(!t){return false}return s(t).is(e.INTERACTIVE_ELEMENT_SELECTORS)};c._getFirstInteractiveElement=function(t){var i=e.getFirstInteractiveElement(t,true);if(!i){return null}return s(i)};c._getLastInteractiveElement=function(t){if(!t){return null}var i=t.getParent();var o=t.getCells();var n;var s;if(e.hasRowActions(i)){o.push(t.getRowAction())}for(var r=o.length-1;r>=0;r--){n=e.getParentCell(i,o[r].getDomRef());s=e.getInteractiveElements(n);if(s){return s.last()}}return null};c._getPreviousInteractiveElement=function(t,i){if(!t||!i){return null}var o=s(i);if(!this._isElementInteractive(o)){return null}var n=e.getParentCell(t,i);var l;var a;var f;var u;var g;var c;var v;l=e.getInteractiveElements(n);if(l[0]!==o[0]){return l.eq(l.index(i)-1)}a=e.getCellInfo(n);u=t.getRows()[a.rowIndex].getCells();if(a.isOfType(r.ROWACTION)){v=u.length-1}else{g=t.getColumns()[a.columnIndex];c=D(t,g);v=c-1}for(var d=v;d>=0;d--){f=u[d].getDomRef();n=e.getParentCell(t,f);l=e.getInteractiveElements(n);if(l){return l.last()}}return null};c._getNextInteractiveElement=function(t,i){if(!t||!i){return null}var o=s(i);if(!this._isElementInteractive(o)){return null}var n=e.getParentCell(t,i);var l;var a;var f;var u;var g;var c;var v;l=e.getInteractiveElements(n);if(l.get(-1)!==o[0]){return l.eq(l.index(i)+1)}a=e.getCellInfo(n);if(a.isOfType(r.ROWACTION)){return null}c=t.getRows()[a.rowIndex];u=c.getCells();g=t.getColumns()[a.columnIndex];v=D(t,g);for(var d=v+1;d<u.length;d++){f=u[d].getDomRef();n=e.getParentCell(t,f);l=e.getInteractiveElements(n);if(l){return l.first()}}if(e.hasRowActions(t)){n=e.getParentCell(t,c.getRowAction().getDomRef());l=e.getInteractiveElements(n);if(l.get(-1)!==o[0]){return l.eq(l.index(i)+1)}}return null};function M(t){var i=e.getRowIndexOfFocusedCell(t);var o=t.getRows()[i].getIndex();var n=t._getSelectionPlugin();t._oRangeSelection={startIndex:o,selected:n.isIndexSelected(o)}}c.prototype.enterActionMode=function(){var t=this._getKeyboardExtension();var i=document.activeElement;var o=e.getInteractiveElements(i);var n=e.getParentCell(this,i);var s=e.getCellInfo(n);if(s.isOfType(r.ANYCOLUMNHEADER)){return false}if(o){t._suspendItemNavigation();i.tabIndex=-1;c._focusElement(this,o[0],true);return true}else if(n){this._getKeyboardExtension()._suspendItemNavigation();return true}return false};c.prototype.leaveActionMode=function(t){t=t==null?true:t;var i=this._getKeyboardExtension();var o=document.activeElement;var n=e.getParentCell(this,o);i._resumeItemNavigation();if(t){if(n){c._focusElement(this,n[0],true)}else{var s=this._getItemNavigation();if(s){var r=s.aItemDomRefs;var l=r.indexOf(o);if(l>-1){s.setFocusedIndex(l)}}i._setSilentFocus(o)}}};c.prototype.onfocusin=function(t){if(t.isMarked("sapUiTableIgnoreFocusIn")){return}var i=s(t.target);if(i.hasClass("sapUiTableOuterBefore")||i.hasClass("sapUiTableOuterAfter")||t.target!=this.getDomRef("overlay")&&this.getShowOverlay()){this.$("overlay").trigger("focus")}else if(i.hasClass("sapUiTableCtrlBefore")){var o=e.isNoDataVisible(this);if(!o||o&&this.getColumnHeaderVisible()){x(this,t)}else{this._getKeyboardExtension()._setSilentFocus(this.$("noDataCnt"))}}else if(i.hasClass("sapUiTableCtrlAfter")){if(!e.isNoDataVisible(this)){_(this,t)}}var n=e.getCellInfo(t.target);var l=n.isOfType(r.ROWHEADER)&&e.Grouping.isInGroupHeaderRow(t.target);var a=n.isOfType(r.ROWHEADER)&&!l&&e.isRowSelectorSelectionAllowed(this);var f=n.isOfType(r.DATACELL)&&this._getKeyboardExtension()._bStayInActionMode;var u=e.getCellInfo(e.getParentCell(this,t.target)).isOfType(r.ANYCONTENTCELL);var g=c._isElementInteractive(t.target);var v=this._getKeyboardExtension().isInActionMode();var d=v&&(l||a||f)||g&&u;if(f){this._getKeyboardExtension()._bStayInActionMode=false}this._getKeyboardExtension().setActionMode(d,false)};c.prototype.onkeydown=function(t){var i=this._getKeyboardExtension();var o=e.getCellInfo(t.target);var s=this.getSelectionMode();var f=this._getSelectionPlugin();if(c._isKeyCombination(t,n.F2)){var u=i.isInActionMode();var g=e.getCell(this,t.target);var v=e.getParentCell(this,t.target)!=null;o=e.getCellInfo(g);if(!u&&v){g.trigger("focus")}else if(o.isOfType(r.ANYCOLUMNHEADER)){var d=e.getInteractiveElements(g);if(d){d[0].focus()}}else{i.setActionMode(!u)}return}else if(c._isKeyCombination(t,n.F4)&&c._isElementGroupToggler(this,t.target)){L(this,t.target).toggleExpandedState();return}if(this._getKeyboardExtension().isInActionMode()||!o.isOfType(r.ANY)){return}if(c._isKeyCombination(t,n.SPACE)){t.preventDefault()}if(c._isKeyCombination(t,n.SHIFT)&&s===l.MultiToggle&&(o.isOfType(r.ROWHEADER)&&e.isRowSelectorSelectionAllowed(this)||o.isOfType(r.DATACELL|r.ROWACTION))){M(this)}else if(c._isKeyCombination(t,n.A,a.CTRL)){t.preventDefault();if(o.isOfType(r.ANYCONTENTCELL|r.COLUMNROWHEADER)&&s===l.MultiToggle){f.onKeyboardShortcut("toggle")}}else if(c._isKeyCombination(t,n.A,a.CTRL+a.SHIFT)){if(o.isOfType(r.ANYCONTENTCELL|r.COLUMNROWHEADER)){f.onKeyboardShortcut("clear")}}else if(c._isKeyCombination(t,n.F4)){if(o.isOfType(r.DATACELL)){i.setActionMode(true)}}};c.prototype.onkeypress=function(t){var i=this._getKeyboardExtension();var o=e.getCellInfo(t.target);if(c._isKeyCombination(t,"+")){if(c._isElementGroupToggler(this,t.target)){L(this,t.target).expand()}else if(o.isOfType(r.DATACELL|r.ROWACTION)){i.setActionMode(true)}}else if(c._isKeyCombination(t,"-")){if(c._isElementGroupToggler(this,t.target)){L(this,t.target).collapse()}else if(o.isOfType(r.DATACELL|r.ROWACTION)){i.setActionMode(true)}}};c.prototype.oncontextmenu=function(t){if(t.isMarked("handledByPointerExtension")){return}var i=e.getCellInfo(document.activeElement);if(i.isOfType(r.ANY)){t.preventDefault();e.Menu.openContextMenu(this,t.target,t)}};c.prototype.onkeyup=function(t){var i=e.getCellInfo(t.target);if(c._isKeyCombination(t,n.SHIFT)){delete this._oRangeSelection}if(i.isOfType(r.COLUMNHEADER)){if(c._isKeyCombination(t,n.SPACE)||c._isKeyCombination(t,n.ENTER)){e.Menu.openContextMenu(this,t.target)}}else if(c._isKeyCombination(t,n.SPACE)){b(this,t)}else if(c._isKeyCombination(t,n.SPACE,a.SHIFT)){e.toggleRowSelection(this,this.getRows()[i.rowIndex].getIndex());M(this)}else if(this._legacyMultiSelection&&!i.isOfType(r.COLUMNROWHEADER)&&(c._isKeyCombination(t,n.SPACE,a.CTRL)||c._isKeyCombination(t,n.ENTER,a.CTRL))){b(this,t)}};c.prototype.onsaptabnext=function(t){var i=this._getKeyboardExtension();var o=e.getCellInfo(t.target);var n;if(i.isInActionMode()){var s;n=e.getCell(this,t.target);o=e.getCellInfo(n);if(!o.isOfType(r.ANYCONTENTCELL)){return}var l=this.getRows()[o.rowIndex];var a=c._getLastInteractiveElement(l);var f=a===null||a[0]===t.target;if(f){var u=l.getIndex();var g=e.isLastScrollableRow(this,n);var v=this._getTotalRowCount()-1===u;var d=e.isRowSelectorSelectionAllowed(this);t.preventDefault();if(v){i.setActionMode(false)}else if(g){R(this,t)}else{var C=o.rowIndex;if(d){S(this,r.ROWHEADER,C+1)}else{var p=this.getRows().length;var h=false;for(var m=o.rowIndex+1;m<p;m++){C=m;l=this.getRows()[C];s=c._getFirstInteractiveElement(l);h=l.isGroupHeader();if(s||h){break}}if(s){c._focusElement(this,s[0])}else if(h){S(this,r.ROWHEADER,C)}else{R(this,t)}}}}else if(o.isOfType(r.ROWHEADER)){t.preventDefault();s=c._getFirstInteractiveElement(l);c._focusElement(this,s[0])}else{t.preventDefault();s=c._getNextInteractiveElement(this,t.target);c._focusElement(this,s[0])}}else if(o.isOfType(r.ANYCOLUMNHEADER)){if(e.isNoDataVisible(this)){this.$("noDataCnt").trigger("focus");t.preventDefault()}else if(this.getRows().length>0){_(this,t);t.preventDefault()}}else if(o.isOfType(r.ANYCONTENTCELL)){w(this,"sapUiTableCtrlAfter")}else if(t.target===this.getDomRef("overlay")){i._setSilentFocus(this.$().find(".sapUiTableOuterAfter"))}else if(!o.isOfType(r.ANY)){n=e.getParentCell(this,t.target);if(n){t.preventDefault();n.trigger("focus")}}};c.prototype.onsaptabprevious=function(t){var i=this._getKeyboardExtension();var o=e.getCellInfo(t.target);var n;if(i.isInActionMode()){var s;n=e.getCell(this,t.target);o=e.getCellInfo(n);if(!o.isOfType(r.ANYCONTENTCELL)){return}var l=this.getRows()[o.rowIndex];var a=l.getIndex();var f=c._getFirstInteractiveElement(l);var u=f!==null&&f[0]===t.target;var g=e.isRowSelectorSelectionAllowed(this);var v=g||l.isGroupHeader();if(u&&v){t.preventDefault();S(this,r.ROWHEADER,o.rowIndex)}else if(u&&!v||o.isOfType(r.ROWHEADER)||f===null){var d=e.isFirstScrollableRow(this,n);var C=a===0;t.preventDefault();if(C){i.setActionMode(false)}else if(d){A(this,t)}else{var p=o.rowIndex;var h=false;for(var m=o.rowIndex-1;m>=0;m--){p=m;l=this.getRows()[p];s=c._getLastInteractiveElement(l);h=l.isGroupHeader();if(s||v||h){break}}if(s){c._focusElement(this,s[0])}else if(h||v){S(this,r.ROWHEADER,p)}else{A(this,t)}}}else{t.preventDefault();s=c._getPreviousInteractiveElement(this,t.target);c._focusElement(this,s[0])}}else if(o.isOfType(r.ANYCONTENTCELL)||t.target===this.getDomRef("noDataCnt")){if(this.getColumnHeaderVisible()&&!o.isOfType(r.ROWACTION)){x(this,t);t.preventDefault()}else{w(this,"sapUiTableCtrlBefore")}}else if(t.target===this.getDomRef("overlay")){this._getKeyboardExtension()._setSilentFocus(this.$().find(".sapUiTableOuterBefore"))}else if(!o.isOfType(r.ANY)){n=e.getParentCell(this,t.target);if(n){t.preventDefault();n.trigger("focus")}}};c.prototype.onsapdown=function(e){v(this,e)};c.prototype.onsapdownmodifiers=function(t){if(c._isKeyCombination(t,null,a.CTRL)){v(this,t);return}var i=this._getKeyboardExtension();if(c._isKeyCombination(t,null,a.ALT)&&c._isElementGroupToggler(this,t.target)){g(t);L(this,t.target).expand();return}if(i.isInActionMode()){return}var o=e.getCellInfo(t.target);if(c._isKeyCombination(t,null,a.SHIFT)){t.preventDefault();if(o.isOfType(r.ANYCONTENTCELL)){if(!this._oRangeSelection){g(t);return}var n=e.getRowIndexOfFocusedCell(this);var s=this.getRows()[n].getIndex();if(s===this._getTotalRowCount()-1){return}if(e.isLastScrollableRow(this,t.target)){var l=I(this,t);if(l){g(t)}}if(this._oRangeSelection.startIndex<=s){s++;if(this._oRangeSelection.selected){e.toggleRowSelection(this,s,true)}else{e.toggleRowSelection(this,s,false)}}else{e.toggleRowSelection(this,s,false)}}else{g(t)}}if(c._isKeyCombination(t,null,a.ALT)){if(o.isOfType(r.DATACELL)){i.setActionMode(true)}g(t)}};c.prototype.onsapup=function(e){p(this,e)};c.prototype.onsapupmodifiers=function(t){if(c._isKeyCombination(t,null,a.CTRL)){p(this,t);return}if(c._isKeyCombination(t,null,a.ALT)&&c._isElementGroupToggler(this,t.target)){g(t);L(this,t.target).collapse();return}var i=this._getKeyboardExtension();if(i.isInActionMode()){return}var o=e.getCellInfo(t.target);if(c._isKeyCombination(t,null,a.SHIFT)){t.preventDefault();if(o.isOfType(r.ANYCONTENTCELL)){if(!this._oRangeSelection){g(t);return}var n=e.getRowIndexOfFocusedCell(this);var s=this.getRows()[n].getIndex();if(s===0){g(t);return}if(e.isFirstScrollableRow(this,t.target)){var l=E(this,t);if(l){g(t)}}if(this._oRangeSelection.startIndex>=s){s--;if(this._oRangeSelection.selected){e.toggleRowSelection(this,s,true)}else{e.toggleRowSelection(this,s,false)}}else{e.toggleRowSelection(this,s,false)}}else{g(t)}}if(c._isKeyCombination(t,null,a.ALT)){if(o.isOfType(r.DATACELL)){i.setActionMode(true)}g(t)}};c.prototype.onsapleft=function(e){m(this,e)};c.prototype.onsapleftmodifiers=function(t){if(this._getKeyboardExtension().isInActionMode()){return}var i=e.getCellInfo(t.target);var o=sap.ui.getCore().getConfiguration().getRTL();if(c._isKeyCombination(t,null,a.SHIFT)){t.preventDefault();if(i.isOfType(r.DATACELL)){if(!this._oRangeSelection){g(t);return}var n=e.getFocusedItemInfo(this);var s=e.hasRowHeader(this)&&n.cellInRow===1;if(s&&!e.isRowSelectorSelectionAllowed(this)){g(t)}}else if(i.isOfType(r.ROWACTION)){if(!this._oRangeSelection){g(t)}}else if(i.isOfType(r.ROWHEADER)&&o){if(!e.isRowSelectionAllowed(this)){g(t)}}else if(i.isOfType(r.COLUMNROWHEADER)&&o){g(t)}else if(i.isOfType(r.COLUMNHEADER)){var l=-e.convertCSSSizeToPixel(u);var f=0;if(o){l=l*-1}for(var v=i.columnIndex;v<i.columnIndex+i.columnSpan;v++){f+=e.Column.getColumnWidth(this,v)}e.Column.resizeColumn(this,i.columnIndex,f+l,true,i.columnSpan);g(t)}}else if(c._isKeyCombination(t,null,a.CTRL)){if(i.isOfType(r.COLUMNHEADER)){t.preventDefault();t.stopImmediatePropagation();var d=this.getColumns()[i.columnIndex];N(d,o)}}};c.prototype.onsaprightmodifiers=function(t){if(this._getKeyboardExtension().isInActionMode()){return}var i=e.getCellInfo(t.target);var o=sap.ui.getCore().getConfiguration().getRTL();if(c._isKeyCombination(t,null,a.SHIFT)){t.preventDefault();if(i.isOfType(r.DATACELL)){if(!this._oRangeSelection){g(t)}}else if(i.isOfType(r.ROWHEADER)){if(!e.isRowSelectionAllowed(this)){g(t)}}else if(i.isOfType(r.ROWACTION)&&o){if(!this._oRangeSelection){g(t)}}else if(i.isOfType(r.COLUMNHEADER)){var n=e.convertCSSSizeToPixel(u);var s=0;if(o){n=n*-1}for(var l=i.columnIndex;l<i.columnIndex+i.columnSpan;l++){s+=e.Column.getColumnWidth(this,l)}e.Column.resizeColumn(this,i.columnIndex,s+n,true,i.columnSpan);g(t)}else if(i.isOfType(r.COLUMNROWHEADER)){g(t)}}else if(c._isKeyCombination(t,null,a.CTRL)){if(i.isOfType(r.COLUMNHEADER)){t.preventDefault();t.stopImmediatePropagation();var f=this.getColumns()[i.columnIndex];N(f,!o)}}};c.prototype.onsaphome=function(t){if(this._getKeyboardExtension().isInActionMode()){return}if(e.Grouping.isInGroupHeaderRow(t.target)){g(t);t.preventDefault();return}var i=e.getCellInfo(t.target);if(i.isOfType(r.ANY)){t.preventDefault()}if(i.isOfType(r.DATACELL|r.ROWACTION|r.COLUMNHEADER)){var o=e.getFocusedItemInfo(this);var n=o.cell;var s=o.cellInRow;var l=this.getComputedFixedColumnCount();var a=e.hasRowHeader(this);var f=a?1:0;if(e.hasFixedColumns(this)&&s>l+f){g(t);e.focusItem(this,n-s+l+f,null)}else if(a&&s>1){g(t);e.focusItem(this,n-s+f,null)}}};c.prototype.onsapend=function(t){if(this._getKeyboardExtension().isInActionMode()){return}if(e.Grouping.isInGroupHeaderRow(t.target)){t.preventDefault();g(t);return}var i=e.getCellInfo(t.target);if(i.isOfType(r.ANY)){t.preventDefault();var o=e.getFocusedItemInfo(this);var n=o.cell;var s=o.columnCount;var l=this.getComputedFixedColumnCount();var a=o.cellInRow;var f=e.hasRowHeader(this);var u=f?1:0;var c=false;if(i.isOfType(r.COLUMNHEADER)&&e.hasFixedColumns(this)){var v=parseInt(i.cell.attr("colspan")||1);if(v>1&&a+v-u===l){c=true}}if(f&&a===0){g(t);e.focusItem(this,n+1,null)}else if(e.hasFixedColumns(this)&&a<l-1+u&&!c){g(t);e.focusItem(this,n+l-a,null)}else if(e.hasRowActions(this)&&i.isOfType(r.DATACELL)&&a<s-2){g(t);e.focusItem(this,n-a+s-2,null)}}};c.prototype.onsaphomemodifiers=function(t){if(this._getKeyboardExtension().isInActionMode()){return}if(c._isKeyCombination(t,null,a.CTRL)){t.preventDefault();var i=e.getCellInfo(t.target);if(i.isOfType(r.ANYCONTENTCELL|r.COLUMNHEADER)){g(t);var o=e.getFocusedItemInfo(this);var n=o.row;if(n>0){var s=o.cell;var l=o.columnCount;var f=e.getHeaderRowCount(this);var u=this._getRowCounts();if(n<f+u.fixedTop){if(i.isOfType(r.ROWACTION)){e.focusItem(this,s-l*(n-f),t)}else{e.focusItem(this,s-l*n,t)}}else if(n>=f+u.fixedTop&&n<f+e.getNonEmptyRowCount(this)-u.fixedBottom){this._getScrollExtension().scrollVerticallyMax(false);if(u.fixedTop>0||i.isOfType(r.ROWACTION)){e.focusItem(this,s-l*(n-f),t)}else{e.focusItem(this,s-l*n,t)}}else{this._getScrollExtension().scrollVerticallyMax(false);e.focusItem(this,s-l*(n-f-u.fixedTop),t)}}}}};c.prototype.onsapendmodifiers=function(t){if(this._getKeyboardExtension().isInActionMode()){return}if(c._isKeyCombination(t,null,a.CTRL)){t.preventDefault();var i=e.getCellInfo(t.target);if(i.isOfType(r.ANY)){var o=e.getFocusedItemInfo(this);var n=o.row;var s=e.getHeaderRowCount(this);var l=e.getNonEmptyRowCount(this);var f=this._getRowCounts();g(t);if(f.fixedBottom===0||n<s+l-1||e.isNoDataVisible(this)&&n<s-1){var u=o.cell;var v=o.columnCount;if(e.isNoDataVisible(this)){e.focusItem(this,u+v*(s-n-1),t)}else if(n<s){if(f.fixedTop>0){e.focusItem(this,u+v*(s+f.fixedTop-n-1),t)}else{this._getScrollExtension().scrollVerticallyMax(true);e.focusItem(this,u+v*(s+l-f.fixedBottom-n-1),t)}}else if(n>=s&&n<s+f.fixedTop){this._getScrollExtension().scrollVerticallyMax(true);e.focusItem(this,u+v*(s+l-f.fixedBottom-n-1),t)}else if(n>=s+f.fixedTop&&n<s+l-f.fixedBottom){this._getScrollExtension().scrollVerticallyMax(true);e.focusItem(this,u+v*(s+l-n-1),t)}else{e.focusItem(this,u+v*(s+l-n-1),t)}}}}};c.prototype.onsappageup=function(t){if(this._getKeyboardExtension().isInActionMode()){return}t.preventDefault();var i=e.getCellInfo(t.target);if(i.isOfType(r.ANYCONTENTCELL|r.COLUMNHEADER)){var o=e.getFocusedItemInfo(this);var n=o.row;var s=e.getHeaderRowCount(this);var l=this._getRowCounts();if(l.fixedTop===0&&n>=s||l.fixedTop>0&&n>s){g(t);var a=o.cell;var f=o.columnCount;if(n<s+l.fixedTop){e.focusItem(this,a-f*(n-s),t)}else if(n===s+l.fixedTop){var u=e.getNonEmptyRowCount(this)-l.fixedTop-l.fixedBottom;var c=this.getFirstVisibleRow();E(this,t,true);if(c<u){if(l.fixedTop>0||i.isOfType(r.ROWACTION)){e.focusItem(this,a-f*(n-s),t)}else{e.focusItem(this,a-f*s,t)}}}else if(n>s+l.fixedTop&&n<s+e.getNonEmptyRowCount(this)){e.focusItem(this,a-f*(n-s-l.fixedTop),t)}else{e.focusItem(this,a-f*(n-s-e.getNonEmptyRowCount(this)+1),t)}}if(i.isOfType(r.ROWACTION)&&n===s&&l.fixedTop>0){g(t)}}};c.prototype.onsappagedown=function(t){if(this._getKeyboardExtension().isInActionMode()){return}t.preventDefault();var i=e.getCellInfo(t.target);if(i.isOfType(r.ANY)){var o=e.getFocusedItemInfo(this);var n=o.row;var s=e.getHeaderRowCount(this);var l=e.getNonEmptyRowCount(this);var a=this._getRowCounts();g(t);if(e.isNoDataVisible(this)&&n<s-1||a.fixedBottom===0||n<s+l-1){var f=o.cell;var u=o.columnCount;if(n<s-1&&!i.isOfType(r.COLUMNROWHEADER)){e.focusItem(this,f+u*(s-n-1),t)}else if(n<s){if(!e.isNoDataVisible(this)){e.focusItem(this,f+u*(s-n),t)}}else if(n>=s&&n<s+l-a.fixedBottom-1){e.focusItem(this,f+u*(s+l-a.fixedBottom-n-1),t)}else if(n===s+l-a.fixedBottom-1){var c=e.getNonEmptyRowCount(this)-a.fixedTop-a.fixedBottom;var v=this._getTotalRowCount()-a.fixedBottom-this.getFirstVisibleRow()-c*2;I(this,t,true);if(v<c&&a.fixedBottom>0){e.focusItem(this,f+u*(s+l-n-1),t)}}else{e.focusItem(this,f+u*(s+l-n-1),t)}}}};c.prototype.onsappageupmodifiers=function(t){if(this._getKeyboardExtension().isInActionMode()){return}if(c._isKeyCombination(t,null,a.ALT)){var i=e.getCellInfo(t.target);var o=e.getFocusedItemInfo(this);if(i.isOfType(r.DATACELL|r.COLUMNHEADER)){var n=o.cell;var s=o.cellInRow;var l=e.hasRowHeader(this);var u=l?1:0;var v=f;g(t);if(l&&(e.Grouping.isInGroupHeaderRow(t.target)||s===1)){e.focusItem(this,n-s,null)}else if(s-u<v){e.focusItem(this,n-s+u,null)}else{e.focusItem(this,n-v,null)}}else if(i.isOfType(r.ROWACTION)){e.focusItem(this,o.cell-1,null)}}};c.prototype.onsappagedownmodifiers=function(t){if(this._getKeyboardExtension().isInActionMode()){return}if(c._isKeyCombination(t,null,a.ALT)){var i=e.getCellInfo(t.target);if(i.isOfType(r.DATACELL|r.ROWHEADER|r.ANYCOLUMNHEADER)){var o=e.getFocusedItemInfo(this);var n=o.cellInRow;var s=e.hasRowHeader(this);var l=s?1:0;var u=e.getVisibleColumnCount(this);var v=parseInt(i.cell.attr("colspan")||1);g(t);if(n+v-l<u){var d=o.cell;var C=f;if(s&&n===0){e.focusItem(this,d+1,null)}else if(v>C){e.focusItem(this,d+v,null)}else if(n+v-l+C>u){e.focusItem(this,d+u-n-1+l,null)}else if(!e.Grouping.isInGroupHeaderRow(t.target)){e.focusItem(this,d+C,null)}}else if(i.isOfType(r.DATACELL)&&e.hasRowActions(this)&&n===o.columnCount-2){e.focusItem(this,o.cell+1,null)}}}};c.prototype.onsapenter=function(e){b(this,e)};return c});
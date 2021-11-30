/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/assert","sap/base/Log","sap/base/security/encodeURL","sap/base/util/each","sap/ui/core/CalendarType","sap/ui/core/format/DateFormat","sap/ui/model/FilterProcessor","sap/ui/model/Sorter"],function(e,t,r,n,i,a,s,u){"use strict";var f,o,l,c=/^([-+]?)0*(\d+)(\.\d+|)$/,d,g=/\.$/,m=/0+$/;function p(){if(!f){f=a.getDateInstance({pattern:"'datetime'''yyyy-MM-dd'T'HH:mm:ss''",calendarType:i.Gregorian});o=a.getDateInstance({pattern:"'datetime'''yyyy-MM-dd'T'HH:mm:ss.SSS''",calendarType:i.Gregorian});l=a.getDateInstance({pattern:"'datetimeoffset'''yyyy-MM-dd'T'HH:mm:ss'Z'''",calendarType:i.Gregorian});d=a.getTimeInstance({pattern:"'time''PT'HH'H'mm'M'ss'S'''",calendarType:i.Gregorian})}}var h=function(){};h.createSortParams=function(e){var r;if(!e||e.length==0){return}r="$orderby=";for(var n=0;n<e.length;n++){var i=e[n];if(i instanceof u){r+=i.sPath;r+=i.bDescending?"%20desc":"%20asc";r+=","}else{t.error("Trying to use "+i+" as a Sorter, but it is a "+typeof i)}}r=r.slice(0,-1);return r};function y(e){if(e&&typeof e.convert==="function"){e=e.convert()}return e}h.createFilterParams=function(e,t,r){var n;if(Array.isArray(e)){e=e.map(y);n=s.groupFilters(e)}else{n=y(e)}if(!n){return}return"$filter="+this._createFilterParams(n,t,r)};h._createFilterParams=function(e,t,r){var n=this,i=Array.isArray(e)?s.groupFilters(e):e;function a(e,i){e=y(e);if(e.aFilters){return u(e,i)}return n._createFilterSegment(e.sPath,t,r,e.sOperator,e.oValue1,e.oValue2,e.bCaseSensitive)}function u(e,t){var r=e.aFilters,n=!!e.bAnd,i="";if(r.length===0){return n?"true":"false"}if(r.length===1){if(r[0]._bMultiFilter){return a(r[0])}return a(r[0],true)}if(!t){i+="("}i+=a(r[0]);for(var s=1;s<r.length;s++){i+=n?"%20and%20":"%20or%20";i+=a(r[s])}if(!t){i+=")"}return i}if(!i){return}return a(i,true)};h._createUrlParamsArray=function(e){var t,r=typeof e,n;if(Array.isArray(e)){return e}t=[];if(r==="string"||e instanceof String){if(e){t.push(e)}}else if(r==="object"){n=this._encodeURLParameters(e);if(n){t.push(n)}}return t};h._encodeURLParameters=function(e){if(!e){return""}var t=[];n(e,function(e,r){if(typeof r==="string"||r instanceof String){r=encodeURIComponent(r)}e=e.startsWith("$")?e:encodeURIComponent(e);t.push(e+"="+r)});return t.join("&")};h.setOrigin=function(e,r){var n,i,a;if(!e||!r||e.indexOf(";mo")>0){return e}if(typeof r=="string"){n=r}else{n=r.alias;if(!n){i=r.system;a=r.client;if(!i||!a){t.warning("ODataUtils.setOrigin: No Client or System ID given for Origin");return e}n="sid("+i+"."+a+")"}}var s=e.split("?");var u=s[0];var f=s[1]?"?"+s[1]:"";var o="";if(u[u.length-1]==="/"){u=u.substring(0,u.length-1);o="/"}var l=/(\/[^\/]+)$/g;var c=/(;o=[^\/;]+)/g;var d=u.match(l)[0];var g=d.match(c);var m=g?g[0]:null;if(m){if(r.force){var p=d.replace(m,";o="+n);u=u.replace(d,p);return u+o+f}return e}u=u+";o="+n+o;return u+f};h.setAnnotationOrigin=function(e,r){var n;var i=e.indexOf("/Annotations(");var a=r&&r.preOriginBaseUri?r.preOriginBaseUri.indexOf(".xsodata"):-1;if(i===-1){i=e.indexOf("/Annotations%28")}if(i>=0){if(e.indexOf("/$value",i)===-1){t.warning("ODataUtils.setAnnotationOrigin: Annotation url is missing $value segment.");n=e}else{var s=e.substring(0,i);var u=e.substring(i,e.length);var f=h.setOrigin(s,r);n=f+u}}else if(a>=0){n=h.setOrigin(e,r)}else{n=e.replace(r.preOriginBaseUri,r.postOriginBaseUri)}return n};h._resolveMultiFilter=function(e,t,r){var i=this,a=e.aFilters,s="";if(a){s+="(";n(a,function(n,u){if(u._bMultiFilter){s+=i._resolveMultiFilter(u,t,r)}else if(u.sPath){s+=i._createFilterSegment(u.sPath,t,r,u.sOperator,u.oValue1,u.oValue2,"",u.bCaseSensitive)}if(n<a.length-1){if(e.bAnd){s+="%20and%20"}else{s+="%20or%20"}}});s+=")"}return s};h._createFilterSegment=function(n,i,a,s,u,f,o){var l,c;if(o===undefined){o=true}if(a){l=i._getPropertyMetadata(a,n);c=l&&l.type;e(l,"PropertyType for property "+n+" of EntityType "+a.name+" not found!")}if(c){u=this.formatValue(u,c,o);f=f!=null?this.formatValue(f,c,o):null}else{e(null,"Type for filter property could not be found in metadata!")}if(u){u=r(String(u))}if(f){f=r(String(f))}if(!o&&c==="Edm.String"){n="toupper("+n+")"}switch(s){case"EQ":case"NE":case"GT":case"GE":case"LT":case"LE":return n+"%20"+s.toLowerCase()+"%20"+u;case"BT":return"("+n+"%20ge%20"+u+"%20and%20"+n+"%20le%20"+f+")";case"NB":return"not%20("+n+"%20ge%20"+u+"%20and%20"+n+"%20le%20"+f+")";case"Contains":return"substringof("+u+","+n+")";case"NotContains":return"not%20substringof("+u+","+n+")";case"StartsWith":return"startswith("+n+","+u+")";case"NotStartsWith":return"not%20startswith("+n+","+u+")";case"EndsWith":return"endswith("+n+","+u+")";case"NotEndsWith":return"not%20endswith("+n+","+u+")";default:t.error("ODataUtils :: Unknown filter operator "+s);return"true"}};h.formatValue=function(e,t,r){var n,i;if(r===undefined){r=true}if(e===null||e===undefined){return"null"}p();switch(t){case"Edm.String":e=r?e:e.toUpperCase();i="'"+String(e).replace(/'/g,"''")+"'";break;case"Edm.Time":if(typeof e==="object"){i=d.format(new Date(e.ms),true)}else{i="time'"+e+"'"}break;case"Edm.DateTime":n=e instanceof Date?e:new Date(e);if(n.getMilliseconds()>0){i=o.format(n,true)}else{i=f.format(n,true)}break;case"Edm.DateTimeOffset":n=e instanceof Date?e:new Date(e);i=l.format(n,true);break;case"Edm.Guid":i="guid'"+e+"'";break;case"Edm.Decimal":i=e+"m";break;case"Edm.Int64":i=e+"l";break;case"Edm.Double":i=e+"d";break;case"Edm.Float":case"Edm.Single":i=e+"f";break;case"Edm.Binary":i="binary'"+e+"'";break;default:i=String(e);break}return i};h.parseValue=function(e){var t=e[0],r=e[e.length-1];p();if(t==="'"){return e.slice(1,-1).replace(/''/g,"'")}else if(e.startsWith("time'")){return{__edmType:"Edm.Time",ms:d.parse(e,true).getTime()}}else if(e.startsWith("datetime'")){if(e.indexOf(".")===-1){return f.parse(e,true)}else{return o.parse(e,true)}}else if(e.startsWith("datetimeoffset'")){return l.parse(e,true)}else if(e.startsWith("guid'")){return e.slice(5,-1)}else if(e==="null"){return null}else if(r==="m"||r==="l"||r==="d"||r==="f"){return e.slice(0,-1)}else if(!isNaN(t)||t==="-"){return parseInt(e)}else if(e==="true"||e==="false"){return e==="true"}else if(e.startsWith("binary'")){return e.slice(7,-1)}throw new Error("Cannot parse value '"+e+"', no Edm type found")};function v(e,t){if(e===t){return 0}if(e===null||t===null||e===undefined||t===undefined){return NaN}return e>t?1:-1}function b(e){var t;if(typeof e!=="string"){return undefined}t=c.exec(e);if(!t){return undefined}return{sign:t[1]==="-"?-1:1,integerLength:t[2].length,abs:t[2]+t[3].replace(m,"").replace(g,"")}}function E(e,t){var r,n,i;if(e===t){return 0}r=b(e);n=b(t);if(!r||!n){return NaN}if(r.sign!==n.sign){return r.sign>n.sign?1:-1}i=v(r.integerLength,n.integerLength)||v(r.abs,n.abs);return r.sign*i}var T=/^PT(\d\d)H(\d\d)M(\d\d)S$/;function S(e){if(typeof e==="string"&&T.test(e)){e=parseInt(RegExp.$1)*36e5+parseInt(RegExp.$2)*6e4+parseInt(RegExp.$3)*1e3}if(e instanceof Date){return e.getTime()}if(e&&e.__edmType==="Edm.Time"){return e.ms}return e}h.compare=function(e,t,r){return r?E(e,t):v(S(e),S(t))};h.getComparator=function(e){switch(e){case"Edm.Date":case"Edm.DateTime":case"Edm.DateTimeOffset":case"Edm.Time":return h.compare;case"Edm.Decimal":case"Edm.Int64":return E;default:return v}};var D=/([(=,])('.*?')([,)])/g,O=/[MLDF](?=[,)](?:[^']*'[^']*')*[^']*$)/g,_=/([(=,])(X')/g,F=function(e,t,r,n){return t+encodeURIComponent(decodeURIComponent(r))+n},M=function(e){return e.toLowerCase()},I=function(e,t){return t+"binary'"};h._normalizeKey=function(e){return e.replace(D,F).replace(O,M).replace(_,I)};h._getReadIntervals=function(e,t,r,n,i){var a,s,u,f=-1,o=[],l=h._getReadRange(e,t,r,n);if(i===undefined){i=Infinity}s=Math.min(l.start+l.length,i);u=Math.min(s,Math.max(l.start,e.length)+1);for(a=l.start;a<u;a+=1){if(e[a]!==undefined){if(f>=0){o.push({start:f,end:a});f=-1}}else if(f<0){f=a}}if(f>=0){o.push({start:f,end:s})}return o};h._getReadRange=function(e,t,r,n){function i(t,r){var n;for(n=t;n<r;n+=1){if(e[n]===undefined){return true}}return false}if(i(t+r,t+r+n/2)){r+=n}if(i(Math.max(t-n/2,0),t)){r+=n;t-=n;if(t<0){r+=t;if(isNaN(r)){r=Infinity}t=0}}return{length:r,start:t}};return h},true);
/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/util/deepEqual","sap/base/util/isEmptyObject","sap/base/util/merge","sap/base/util/uid","sap/ui/thirdparty/URI"],function(e,t,r,n,i,a){"use strict";var u=/&/g,o="sap.ui.model.odata.v4.lib._Helper",f=/\=/g,s=/%29/g,c=/%28/g,l=/%27/g,d=/#/g,p=/\([^/]*|\/-?\d+/g,g=/\+/g,h=/'/g,y=/''/g,m=/\s+/g,$;$={addByPath:function(e,t,r){if(r){if(!e[t]){e[t]=[r]}else if(e[t].indexOf(r)<0){e[t].push(r)}}},addChildrenWithAncestor:function(e,t,r){if(t.length){e.forEach(function(e){var n;if(t.indexOf(e)>=0){r[e]=true;return}n=e.split("/");n.pop();while(n.length){if(t.indexOf(n.join("/"))>=0){r[e]=true;break}n.pop()}})}},addToSelect:function(e,t){e.$select=e.$select||[];t.forEach(function(t){if(e.$select.indexOf(t)<0){e.$select.push(t)}})},adjustTargets:function(e,t,r,n){var i=$.getAnnotationKey(e,".additionalTargets"),a;a=[e.target].concat(e[i]).map(function(e){return e&&$.getAdjustedTarget(e,t,r,n)}).filter(function(e){return e});e.target=a[0];if(i){e[i]=a.slice(1)}},adjustTargetsInError:function(e,t,r,n){if(!e.error){return}$.adjustTargets(e.error,t,r,n);if(e.error.details){e.error.details.forEach(function(e){$.adjustTargets(e,t,r,n)})}},aggregateExpandSelect:function(e,t){if(t.$select){$.addToSelect(e,t.$select)}if(t.$expand){e.$expand=e.$expand||{};Object.keys(t.$expand).forEach(function(r){if(e.$expand[r]){$.aggregateExpandSelect(e.$expand[r],t.$expand[r])}else{e.$expand[r]=t.$expand[r]}})}},buildPath:function(){var e="",t,r;for(r=0;r<arguments.length;r+=1){t=arguments[r];if(t||t===0){if(e&&e!=="/"&&t[0]!=="("){e+="/"}e+=t}}return e},buildQuery:function(e){var t,r;if(!e){return""}t=Object.keys(e);if(t.length===0){return""}r=[];t.forEach(function(t){var n=e[t];if(Array.isArray(n)){n.forEach(function(e){r.push($.encodePair(t,e))})}else{r.push($.encodePair(t,n))}});return"?"+r.join("&")},clone:function e(t,r){return t===undefined||t===Infinity||t===-Infinity||t!==t?t:JSON.parse(JSON.stringify(t,r))},createError:function(t,r,n,i){var a=t.responseText,u=t.getResponseHeader("Content-Type"),f,s=new Error(r+": "+t.status+" "+t.statusText);s.status=t.status;s.statusText=t.statusText;s.requestUrl=n;s.resourcePath=i;if(t.status===0){s.message="Network error";return s}if(u){u=u.split(";")[0]}if(t.status===412){f=t.getResponseHeader("Preference-Applied");if(f&&f.replace(m,"")==="handling=strict"){s.strictHandlingFailed=true}else{s.isConcurrentModification=true}}if(u==="application/json"){try{s.error=JSON.parse(a).error;s.message=s.error.message;if(typeof s.message==="object"){s.message=s.error.message.value}}catch(t){e.warning(t.toString(),a,o)}}else if(u==="text/plain"){s.message=a}return s},createGetMethod:function(e,t){return function(){var r=this[e].apply(this,arguments);if(r.isFulfilled()){return r.getResult()}else if(t){if(r.isRejected()){r.caught();throw r.getResult()}else{throw new Error("Result pending")}}}},createMissing:function(e,t){t.reduce(function(e,r,n){if(!(r in e)){e[r]=n+1<t.length?{}:null}return e[r]},e)},createRequestMethod:function(e){return function(){return Promise.resolve(this[e].apply(this,arguments))}},createTechnicalDetails:function(e){var t,r=e["@$ui5.error"],n=e["@$ui5.originalMessage"]||e,i={};if(r&&(r.status||r.cause)){r=r.cause||r;i.httpStatus=r.status;if(r.isConcurrentModification){i.isConcurrentModification=true}}if(!(n instanceof Error)){Object.defineProperty(i,"originalMessage",{enumerable:true,get:function(){if(!t){t=$.publicClone(n)}return t}})}return i},decomposeError:function(e,t,r){var n=e.error.details&&e.error.details.map(function(e){return $.getContentID(e)}),i=$.getContentID(e.error);return t.map(function(t,a){var u=new Error(e.message);function o(e,r){if(a===0&&!r){if(e.target){e.message=e.target+": "+e.message}delete e.target;return true}return r===t.$ContentID}u.error=$.clone(e.error);u.requestUrl=r+t.url;u.resourcePath=t.$resourcePath;u.status=e.status;u.statusText=e.statusText;if(!o(u.error,i)){u.error.$ignoreTopLevel=true}if(u.error.details){u.error.details=u.error.details.filter(function(e,t){return o(e,n[t])})}return u})},deepEqual:t,deletePrivateAnnotation:function(e,t){var r=e["@$ui5._"];if(r){delete r[t]}},drillDown:function(e,t){return t.reduce(function(e,t){return e&&t in e?e[t]:undefined},e)},encode:function(e,t){var r=encodeURI(e).replace(u,"%26").replace(d,"%23").replace(g,"%2B");if(t){r=r.replace(f,"%3D")}return r},encodePair:function(e,t){return $.encode(e,true)+"="+$.encode(t,false)},extractMessages:function(e){var t=[],r=[];function n(n,i,a){var u={additionalTargets:$.getAdditionalTargets(n),code:n.code,message:n.message,numericSeverity:i,technical:a||n.technical,"@$ui5.error":e,"@$ui5.originalMessage":n};Object.keys(n).forEach(function(t){if(t[0]==="@"){if(t.endsWith(".numericSeverity")){u.numericSeverity=n[t]}else if(t.endsWith(".longtextUrl")&&e.requestUrl&&n[t]){u.longtextUrl=$.makeAbsolute(n[t],e.requestUrl)}}});if(typeof n.target!=="string"){r.push(u)}else if(n.target[0]==="$"||!e.resourcePath){u.message=n.target+": "+n.message;r.push(u)}else{u.target=n.target;u.transition=true;t.push(u)}}if(e.error){if(!e.error.$ignoreTopLevel){n(e.error,4,true)}if(e.error.details){e.error.details.forEach(function(e){n(e)})}}else{n(e,4,true)}return{bound:t,unbound:r}},extractMergeableQueryOptions:function(e){var t={};if("$expand"in e){t.$expand=e.$expand;e.$expand="~"}if("$select"in e){t.$select=e.$select;e.$select="~"}return t},fetchPropertyAndType:function(e,t){return e(t).then(function(r){if(r&&r.$kind==="NavigationProperty"){return e(t+"/").then(function(){return r})}return r})},filterPaths:function(e,t){return t.filter(function(t){var r=$.getMetaPath(t);return e.every(function(e){return!$.hasPathPrefix(r,e)})})},fireChange:function(e,t,r){var n=e[t],i;if(n){for(i=0;i<n.length;i+=1){n[i].onChange(r)}}},fireChanges:function(e,t,r,n){Object.keys(r).forEach(function(i){var a=$.buildPath(t,i),u=r[i];if(u&&typeof u==="object"){$.fireChanges(e,a,u,n)}else{$.fireChange(e,a,n?undefined:u)}});$.fireChange(e,t,n?undefined:r)},formatLiteral:function(e,t){if(e===undefined){throw new Error("Illegal value: undefined")}if(e===null){return"null"}switch(t){case"Edm.Binary":return"binary'"+e+"'";case"Edm.Boolean":case"Edm.Byte":case"Edm.Double":case"Edm.Int16":case"Edm.Int32":case"Edm.SByte":case"Edm.Single":return String(e);case"Edm.Date":case"Edm.DateTimeOffset":case"Edm.Decimal":case"Edm.Guid":case"Edm.Int64":case"Edm.TimeOfDay":return e;case"Edm.Duration":return"duration'"+e+"'";case"Edm.String":return"'"+e.replace(h,"''")+"'";default:throw new Error("Unsupported type: "+t)}},getAdditionalTargets:function(e){return $.getAnnotation(e,".additionalTargets")},getAdjustedTarget:function(e,t,r,n){var i,a,u;u=e.split("/");a=u.shift();if(a==="$Parameter"){e=u.join("/");a=u.shift()}if(t.$IsBound&&a===t.$Parameter[0].$Name){e=$.buildPath(n,u.join("/"));return e}i=t.$Parameter.some(function(e){return a===e.$Name});if(i){e=r+"/"+e;return e}},getAnnotation:function(e,t){var r=$.getAnnotationKey(e,t);return r&&e[r]},getAnnotationKey:function(t,r){var n,i;Object.keys(t).forEach(function(t){if(t[0]==="@"&&t.endsWith(r)){if(n){e.warning("Cannot distinguish "+n+" from "+t,undefined,o);i=true}n=t}});return i?undefined:n},getContentID:function(e){return $.getAnnotation(e,".ContentID")},getKeyFilter:function(e,t,r,n){var i=[],a,u=$.getKeyProperties(e,t,r,n);if(!u){return undefined}for(a in u){i.push(a+" eq "+u[a])}return i.join(" and ")},getKeyPredicate:function(e,t,r,n,i){var a=$.getKeyProperties(e,t,r,n,true);if(!a){return undefined}n=Object.keys(a).map(function(e,t,r){var n=encodeURIComponent(a[e]);return i||r.length>1?encodeURIComponent(e)+"="+n:n});return"("+n.join(",")+")"},getKeyProperties:function(e,t,r,n,i){var a,u={};n=n||r[t].$Key;a=n.some(function(n){var a,o,f,s,c,l;if(typeof n==="string"){a=o=n}else{a=Object.keys(n)[0];o=n[a];if(!i){a=o}}s=o.split("/");l=$.drillDown(e,s);if(l===undefined){return true}f=s.pop();c=r[$.buildPath(t,s.join("/"))];l=$.formatLiteral(l,c[f].$Type);u[a]=l});return a?undefined:u},getMetaPath:function(e){if(e[0]==="/"){return e.replace(p,"")}if(e[0]!=="("){e="/"+e}return e.replace(p,"").slice(1)},getPrivateAnnotation:function(e,t){var r=e["@$ui5._"];return r&&r[t]},getQueryOptionsForPath:function(e,t){t=$.getMetaPath(t);if(t){t.split("/").some(function(t){e=e&&e.$expand&&e.$expand[t];if(!e||e===true){e={};return true}})}return e||{}},getRelativePath:function(e,t){if(t.length){if(!e.startsWith(t)){return undefined}e=e.slice(t.length);if(e){if(e[0]==="/"){return e.slice(1)}if(e[0]!=="("){return undefined}}}return e},hasPrivateAnnotation:function(e,t){var r=e["@$ui5._"];return r?t in r:false},informAll:function(e,t,r,n){if(n===r){return}if(n&&typeof n==="object"){Object.keys(n).forEach(function(i){$.informAll(e,$.buildPath(t,i),r&&r[i],n[i])})}else{$.fireChange(e,t,n===undefined?null:n);n={}}if(r&&typeof r==="object"){Object.keys(r).forEach(function(i){if(!n.hasOwnProperty(i)){$.informAll(e,$.buildPath(t,i),r[i],undefined)}})}},inheritPathValue:function(e,t,r){e.forEach(function(n,i){var a=!(n in r);if(i+1<e.length){if(a){r[n]={}}t=t[n];r=r[n]}else if(a){r[n]=t[n]}})},intersectQueryOptions:function(e,t,n,i,a,u,o){var f=[],s={},c,l,d,p={};function g(e,t){var r=t.split("/");return r.every(function(t,a){return a===0&&e||t==="$count"||n(i+"/"+r.slice(0,a+1).join("/")).getResult().$kind==="Property"})}if(t.indexOf("")>=0){throw new Error("Unsupported empty navigation property path")}if(t.indexOf("*")>=0){d=e&&e.$select||[]}else if(e&&e.$select&&e.$select.indexOf("*")<0){$.addChildrenWithAncestor(t,e.$select,p);$.addChildrenWithAncestor(e.$select,t,p);d=Object.keys(p).filter(g.bind(null,true))}else{d=t.filter(g.bind(null,false))}if(e&&e.$expand){f=Object.keys(e.$expand);f.forEach(function(o){var f,c=i+"/"+o,l=$.buildPath(u,o),d={},p;$.addChildrenWithAncestor([o],t,d);if(!r(d)){if(n(c).getResult().$isCollection){a[l]=true}s[o]=e.$expand[o];return}p=$.stripPathPrefix(o,t);if(p.length){if(n(c).getResult().$isCollection){throw new Error("Unsupported collection-valued navigation property "+c)}f=$.intersectQueryOptions(e.$expand[o]||{},p,n,c,a,l);if(f){s[o]=f}}})}if(!d.length&&r(s)){return null}c=Object.assign({},e,{$select:d});l=n(i).getResult();if(l.$kind==="NavigationProperty"&&!l.$isCollection){$.selectKeyProperties(c,n(i+"/").getResult())}else if(!d.length&&!o){c.$select=Object.keys(s).slice(0,1)}if(r(s)){delete c.$expand}else{c.$expand=s}return c},hasPathPrefix:function(e,t){return $.getRelativePath(e,t)!==undefined},isSafeInteger:function(e){if(typeof e!=="number"||!isFinite(e)){return false}e=Math.abs(e);return e<=9007199254740991&&Math.floor(e)===e},makeAbsolute:function(e,t){return new a(e).absoluteTo(t).toString().replace(l,"'").replace(c,"(").replace(s,")")},merge:n,mergeQueryOptions:function(e,t,r){var n;function i(t,r){if(r&&(!e||e[t]!==r)){if(!n){n=e?$.clone(e):{}}n[t]=r}}i("$orderby",t);if(r){i("$filter",r[0]);i("$$filterBeforeAggregate",r[1])}return n||e},namespace:function(e){var t;e=e.split("/")[0].split("(")[0];t=e.lastIndexOf(".");return t<0?"":e.slice(0,t)},parseLiteral:function(e,t,r){function n(n){if(!isFinite(n)){throw new Error(r+": Not a valid "+t+" literal: "+e)}return n}if(e==="null"){return null}switch(t){case"Edm.Boolean":return e==="true";case"Edm.Byte":case"Edm.Int16":case"Edm.Int32":case"Edm.SByte":return n(parseInt(e));case"Edm.Date":case"Edm.DateTimeOffset":case"Edm.Decimal":case"Edm.Guid":case"Edm.Int64":case"Edm.TimeOfDay":return e;case"Edm.Double":case"Edm.Single":return e==="INF"||e==="-INF"||e==="NaN"?e:n(parseFloat(e));case"Edm.String":return e.slice(1,-1).replace(y,"'");default:throw new Error(r+": Unsupported type: "+t)}},publicClone:function(e,t){return $.clone(e,function(e,r){if(t?!e.startsWith("@$ui5."):e!=="@$ui5._"){return r}})},removeByPath:function(e,t,r){var n=e[t],i;if(n){i=n.indexOf(r);if(i>=0){if(n.length===1){delete e[t]}else{n.splice(i,1)}}}},resolveIfMatchHeader:function(e){var t=e&&e["If-Match"];if(t&&typeof t==="object"){t=t["@odata.etag"];e=Object.assign({},e);if(t===undefined){delete e["If-Match"]}else{e["If-Match"]=t}}return e},selectKeyProperties:function(e,t){if(t&&t.$Key){$.addToSelect(e,t.$Key.map(function(e){if(typeof e==="object"){return e[Object.keys(e)[0]]}return e}))}},setPrivateAnnotation:function(e,t,r){var n=e["@$ui5._"];if(!n){n=e["@$ui5._"]={}}n[t]=r},stripPathPrefix:function(e,t){var r=e+"/";if(e===""){return t}return t.filter(function(t){return t===e||t.startsWith(r)}).map(function(e){return e.slice(r.length)})},toArray:function(e){if(e===undefined||e===null){return[]}if(Array.isArray(e)){return e}return[e]},uid:i,updateAll:function(e,t,r,n,i){Object.keys(n).forEach(function(a){var u=$.buildPath(t,a),o,f=n[a],s,c=r[a];if(a==="@$ui5._"){o=$.getPrivateAnnotation(n,"predicate");if(i&&i(t)){s=$.getPrivateAnnotation(r,"predicate");if(o!==s){throw new Error("Key predicate of '"+t+"' changed from "+s+" to "+o)}}else{$.setPrivateAnnotation(r,"predicate",o)}}else if(Array.isArray(f)){r[a]=f}else if(f&&typeof f==="object"){r[a]=$.updateAll(e,u,c||{},f,i)}else if(c!==f){r[a]=f;if(c&&typeof c==="object"){$.fireChanges(e,u,c,true)}else{$.fireChange(e,u,f)}}});return r},updateExisting:function(e,t,r,n){if(!n){return}Object.keys(r).forEach(function(i){var a=$.buildPath(t,i),u=r[i],o=n[i];if(i in n||i[0]==="#"){if(Array.isArray(o)){r[i]=o}else if(o&&typeof o==="object"){if(u){$.updateExisting(e,a,u,o)}else{r[i]=o;$.fireChanges(e,a,o,false)}}else if(u!==o){r[i]=o;if(u&&typeof u==="object"){$.fireChanges(e,a,u,true)}else{$.fireChange(e,a,o)}}}});Object.keys(n).filter(function(e){return e[0]==="#"}).filter(function(e){return!(e in r)}).forEach(function(i){var a=n[i],u=$.buildPath(t,i);r[i]=a;$.fireChanges(e,u,a,false)})},updateSelected:function(e,t,r,n,i){function a(r,n,i){var a=r.split("/");a.every(function(u,o){var f=n[u],s=i[u];if(Array.isArray(f)){i[u]=f}else if(f&&typeof f==="object"){i=i[u]=s||{};n=f;return true}else if(s!==f){i[u]=f;if(s&&typeof s==="object"){$.fireChanges(e,$.buildPath(t,a.slice(0,o+1).join("/")),s,true)}else if(o===a.length-1){$.fireChange(e,$.buildPath(t,r),f)}}return false})}if(!i||i.indexOf("*")>=0){$.updateAll(e,t,r,n);return}i.forEach(function(e){a(e,n,r)})},updateTransientPaths:function(e,t,r){var n;for(n in e){if(n.includes(t)){e[n.replace(t,r)]=e[n];delete e[n]}}},wrapChildQueryOptions:function(t,r,n,i){var a="",u=r.split("/"),f,s=t,c={},l=c,d;if(r===""){return n}for(d=0;d<u.length;d+=1){s=$.buildPath(s,u[d]);a=$.buildPath(a,u[d]);f=i(s).getResult();if(f.$kind==="NavigationProperty"){l.$expand={};l=l.$expand[a]=d===u.length-1?n:{};$.selectKeyProperties(l,i(s+"/").getResult());a=""}else if(f.$kind!=="Property"){return undefined}}if(f.$kind==="Property"){if(Object.keys(n).length>0){e.error("Failed to enhance query options for auto-$expand/$select as the"+" child binding has query options, but its path '"+r+"' points to a structural property",JSON.stringify(n),o);return undefined}$.addToSelect(l,[a])}if("$apply"in n){e.debug("Cannot wrap $apply into $expand: "+r,JSON.stringify(n),o);return undefined}return c}};return $},false);
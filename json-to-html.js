(function ($) {
    'use strict';
    $.fn.jsonToHtml = function (obj) {
        if (!obj) return;
        var _style = '.json-object-tree-view { font-family : monospace !important; font-size: 1.25em !important; list-style: none  !important; }\
                      .json-object-tree-view { margin:0; padding:0; }\
                      .json-object-tree-view .seperator { margin:0 5px;font-weight:bold; }\
                      .json-object-tree-view .property, .json-object-tree-view .j-caret { font-weight:bold; color:#d46860; }\
                      .json-object-tree-view .no-j-caret { margin-left:15px; }\
                      .json-object-tree-view .value { color:#2d2b2c; font-weight:bold; border-bottom:1px dotted #ccc; }\
                      .json-object-tree-view .j-caret { cursor:pointer; -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none; }\
                      .json-object-tree-view .j-caret::before { content:"►"; color:black; display:inline-block; margin-right:6px; }\
                      .json-object-tree-view .j-caret-down::before { -ms-transform:rotate(90deg);-webkit-transform:rotate(90deg); }\
                      .json-object-tree-view .nested { display:none; padding-left:30px; }\
                      .json-object-tree-view .active { display:block; }\
                      .json-object-tree-view  ul li { list-style:none !important; }\
                      .json-object-tree-view .value[empty] { color:#e8e8e8 !important; border: none !important; }\
                      .json-object-tree-view .j-caret[empty], .json-object-tree-view .property[empty] { color:#d468603d !important; }';
        if ($("style#json-object-tree-css").length == 0) $('<style/>', { id: "json-object-tree-css" }).html(_style).appendTo('head');
        var treeHtml = $("<div/>").append($("<ul/>", { ref: "root", class: "json-object-tree-view" }));
        var rootRef = "root";
        if (typeof (obj) == "object") {
            var getUniqueID = function () {
                var s4 = function () { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); };
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            };
            var getUlWithRef = function (_ref, _class) { return $("<ul/>", { "ref": _ref, "class": _class }); };
            var getLiWithRef = function (_ref, _class) { return $("<li/>", { "ref": _ref, "class": _class }); };
            var getLiHtml = function (_prop, _value, isEmpty) { return "<span class='property'>" + _prop + "</span><span class='seperator'>:</span>" + "<span class='value' " + ((isEmpty) ? ' empty' : '') + ">" + _value + "</span>"; }
            var getCaretSpanHtml = function (_value, isEmpty, isOpen) { return "<span class='j-caret " + (isOpen ? "j-caret-down" : "") + "'  " + ((isEmpty) ? ' empty' : '') + ">" + _value + "</span>" }
            var recursiveFunc = function (_prop, _object, _parentRef) {
                if (_object[_prop] && typeof (_object[_prop]) == "object") {
                    var uniqueID = getUniqueID();
                    var element = treeHtml.find("ul[ref='" + _parentRef + "']");
                    if (element.length == 0) treeHtml.append(getUlWithRef(uniqueID));
                    if (Array.isArray(_object[_prop])) {
                        uniqueID = getUniqueID();
                        var $li = getLiWithRef(uniqueID);
                        element.append($li);
                        if (_object[_prop].length == 0) {
                            $li.html(getLiHtml(_prop, "[]", true));
                            return;
                        }
                        $li.html(getCaretSpanHtml(_prop));
                        var $ul = getUlWithRef(uniqueID, "nested");
                        $ul.appendTo($li);
                        _object[_prop].forEach(function (innerObj, index) {
                            if (typeof (innerObj) == "object") {
                                uniqueID = getUniqueID();
                                var $inner_li = getLiWithRef(uniqueID).html(getCaretSpanHtml(index));
                                $inner_li.appendTo($ul);
                                getUlWithRef(uniqueID, "nested").appendTo($inner_li);
                                for (var prop in innerObj) recursiveFunc(prop, innerObj, uniqueID);
                            } else $("<li/>").html(getLiHtml(index, innerObj)).appendTo($ul);
                        });
                    } else {
                        var uniqueID = getUniqueID();
                        var $li = getLiWithRef(uniqueID);
                        element.append($li);
                        if (Object.keys(_object[_prop]).length == 0) {
                            $li.html(getLiHtml(_prop, "{}", true)).appendTo($ul);
                            return;
                        }
                        $li.html(getCaretSpanHtml(_prop));
                        var $ul = getUlWithRef(uniqueID, "nested");
                        $ul.appendTo($li);
                        for (var prop in _object[_prop]) recursiveFunc(prop, _object[_prop], uniqueID);
                    }
                } else {
                    var uniqueID = getUniqueID();
                    var element = treeHtml.find("ul[ref='" + _parentRef + "']");
                    if (element.length > 0) {
                        element.append(getLiWithRef(uniqueID, (_parentRef == "root") ? "no-j-caret" : "").html(getLiHtml(_prop, _object[_prop])));
                    }
                }
            }
            var element = treeHtml.find("ul[ref='root']");
            var uniqueID = getUniqueID();
            var $li = getLiWithRef(uniqueID);
            element.append($li);
            $li.html(getCaretSpanHtml(Array.isArray(obj) ? "Array" : "Object", true, true));
            var $ul = getUlWithRef(uniqueID, "nested active");
            $ul.appendTo($li);
            rootRef = uniqueID;
            for (var prop in obj) recursiveFunc(prop, obj, rootRef);
        } else treeHtml.find('ul').append($("<li/>").html("<span class='property' empty>" + typeof (obj) + "</span><span class='seperator'>:</span><span class='value'>" + obj + "</span>"))
        $(this).html(treeHtml[0].innerHTML);
        $(this).find(".json-object-tree-view .j-caret").click(function () {
            $(this).toggleClass('j-caret-down').parent().find('>.nested').toggleClass('active');
        });
    }
})(jQuery)

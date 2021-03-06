/*! *****************************************************************************
Copyright (c) 2015 Tangra Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************** */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var textField = require("ui/text-field");
var listPicker = require("ui/list-picker");
var observable = require("data/observable");
var common = require("./drop-down-common");
var style = require("ui/styling/style");
var utils = require("utils/utils");
global.moduleMerge(common, exports);
var TOOLBAR_HEIGHT = 44;
var DropDown = (function (_super) {
    __extends(DropDown, _super);
    function DropDown() {
        _super.call(this);
        var applicationFrame = UIScreen.mainScreen().applicationFrame;
        this._textField = new textField.TextField();
        this._listPicker = new listPicker.ListPicker();
        this._flexToolbarSpace = UIBarButtonItem.alloc().initWithBarButtonSystemItemTargetAction(UIBarButtonSystemItem.UIBarButtonSystemItemFlexibleSpace, null, null);
        this._doneTapDelegate = TapHandler.initWithOwner(new WeakRef(this));
        this._doneButton = UIBarButtonItem.alloc().initWithBarButtonSystemItemTargetAction(UIBarButtonSystemItem.UIBarButtonSystemItemDone, this._doneTapDelegate, "tap");
        this._accessoryViewVisible = true;
        this._toolbar = UIToolbar.alloc().initWithFrame(CGRectMake(0, 0, applicationFrame.size.width, TOOLBAR_HEIGHT));
        this._toolbar.autoresizingMask = UIViewAutoresizing.UIViewAutoresizingFlexibleWidth;
        var nsArray = NSMutableArray.alloc().init();
        nsArray.addObject(this._flexToolbarSpace);
        nsArray.addObject(this._doneButton);
        this._toolbar.setItemsAnimated(nsArray, false);
    }
    Object.defineProperty(DropDown.prototype, "ios", {
        get: function () {
            return this._textField.ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DropDown.prototype, "accessoryViewVisible", {
        get: function () {
            return this._accessoryViewVisible;
        },
        set: function (value) {
            this._accessoryViewVisible = value;
            this._showHideAccessoryView();
        },
        enumerable: true,
        configurable: true
    });
    DropDown.prototype._showHideAccessoryView = function () {
        this.ios.inputAccessoryView = (this._accessoryViewVisible ? this._toolbar : null);
    };
    DropDown.prototype.onLoaded = function () {
        var _this = this;
        _super.prototype.onLoaded.call(this);
        this._textField.onLoaded();
        this._listPicker.onLoaded();
        this._listPicker.on(observable.Observable.propertyChangeEvent, function (data) {
            if (data.propertyName === "selectedIndex") {
                _this.selectedIndex = data.value;
            }
        });
        this.ios.inputView = this._listPicker.ios;
        this._showHideAccessoryView();
    };
    DropDown.prototype.onUnloaded = function () {
        this.ios.inputView = null;
        this.ios.inputAccessoryView = null;
        this._listPicker.off(observable.Observable.propertyChangeEvent);
        this._textField.onUnloaded();
        this._listPicker.onUnloaded();
        _super.prototype.onUnloaded.call(this);
    };
    DropDown.prototype._onItemsPropertyChanged = function (data) {
        this._listPicker.items = data.newValue;
    };
    DropDown.prototype._onSelectedIndexPropertyChanged = function (data) {
        _super.prototype._onSelectedIndexPropertyChanged.call(this, data);
        this._listPicker.selectedIndex = data.newValue;
        if(typeof (this.items && this.items.getItem ? this.items.getItem(data.newValue) : this.items[data.newValue]) === "object") {
            this._textField.text = (this.items && this.items.getItem ? this.items.getItem(data.newValue).DisplayValue : this.items[data.newValue].DisplayValue);
        }
        else {
            this._textField.text = (this.items && this.items.getItem ? this.items.getItem(data.newValue) : this.items[data.newValue]);
        }
    };
    return DropDown;
})(common.DropDown);
exports.DropDown = DropDown;
var TapHandler = (function (_super) {
    __extends(TapHandler, _super);
    function TapHandler() {
        _super.apply(this, arguments);
    }
    TapHandler.initWithOwner = function (owner) {
        var tapHandler = TapHandler.new();
        tapHandler._owner = owner;
        return tapHandler;
    };
    TapHandler.prototype.tap = function () {
        this._owner.get().ios.resignFirstResponder();
    };
    TapHandler.ObjCExposedMethods = {
        "tap": { returns: interop.types.void, params: [] }
    };
    return TapHandler;
})(NSObject);
var DropDownStyler = (function () {
    function DropDownStyler() {
    }
    DropDownStyler.setTextAlignmentProperty = function (dropDown, newValue) {
        utils.ios.setTextAlignment(dropDown._nativeView, newValue);
    };
    DropDownStyler.resetTextAlignmentProperty = function (dropDown, nativeValue) {
        var ios = dropDown._nativeView;
        ios.textAlignment = nativeValue;
    };
    DropDownStyler.getNativeTextAlignmentValue = function (dropDown) {
        var ios = dropDown._nativeView;
        return ios.textAlignment;
    };
    DropDownStyler.registerHandlers = function () {
        style.registerHandler(style.textAlignmentProperty, new style.StylePropertyChangedHandler(DropDownStyler.setTextAlignmentProperty, DropDownStyler.resetTextAlignmentProperty, DropDownStyler.getNativeTextAlignmentValue), "DropDown");
    };
    return DropDownStyler;
})();
exports.DropDownStyler = DropDownStyler;
DropDownStyler.registerHandlers();

/*
 * =============================================================
 * revstack v0.9.0
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./constructor'),require('./functions'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./constructor','./functions'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.Revstack,root.Revstack.methods);
    }
}(this, function (Revstack,methods) {

    Revstack.prototype.app = {

        get: function (params,callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var endpoint,id;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                if(typeof params["@rid"] !== 'undefined'){
                    id = encodeURIComponent(params["@rid"]);
                    endpoint = '/app/' + id;
                    methods.send(token,endpoint,'GET',null,callback);
                }else{
                    endpoint = '/app/list';
                    methods.send(token,endpoint,'GET',null,callback);
                }
            }
        },

        post:function(params,callback){
            var appId = Revstack.appId;
            var token=this.token;
            var endpoint;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                endpoint = '/app';
                methods.send(token,endpoint,'POST',params,callback);
            }
        },

        put: function (params, callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var id,endpoint1,endpoint2;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                var obj = methods.validateId(params);
                if (typeof obj.error !== 'undefined') {
                    obj.error.message='PUT requires an app id and/or app data to update';
                    if(callback){
                        callback(obj.error,null);
                    }
                }else{
                    id = encodeURIComponent(params["@rid"]);
                    endpoint1='/app/' + id;
                    endpoint2 = '/app';
                    methods.merge(token,endpoint1,endpoint2,'PUT',params,callback);
                }
            }
        },

        delete: function (params, callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var id,endpoint;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                var obj = methods.validateId(params);
                if (typeof obj.error !== 'undefined') {
                    obj.error.message='DELETE requires an app id to remove';
                    if(callback){
                        callback(obj.error, null);
                    }
                }else{
                    id = encodeURIComponent(params["@rid"]);
                    endpoint = '/app/' + id;
                    methods.send(token,endpoint,'DELETE',null,callback);
                }
            }
        }

    };

    return Revstack;

}));










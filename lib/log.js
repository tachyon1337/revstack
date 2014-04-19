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

    Revstack.prototype.log = {

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
                    endpoint = '/log/' + id;
                    methods.send(token,endpoint,'GET',null,callback);
                }else{
                    //error
                    var error={};
                    error.statusCode = 400;
                    error.message = 'log get requires a log id';
                    if(callback){
                        callback(error, null);
                    }
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
                endpoint = '/log';
                methods.send(token,endpoint,'POST',params,callback);
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
                    obj.error.message='DELETE requires a log id to remove';
                    if(callback){
                        callback(obj.error, null);
                    }
                }else{
                    id = encodeURIComponent(params["@rid"]);
                    endpoint = '/log/' + id;
                    methods.send(token,endpoint,'DELETE',null,callback);
                }
            }
        },

        query: function (params,callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var endpoint;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                var query = params.query;
                //urlencode string query
                query = encodeURIComponent(query);
                endpoint = '/log/query/command/' + query + '/-1';
                methods.send(token,endpoint,'GET',null,callback);
            }
        }

    };

    return Revstack;

}));









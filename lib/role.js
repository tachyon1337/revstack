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

    Revstack.prototype.role = {

        get: function (params,callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var endpoint,role;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                if(typeof params.role !== 'undefined'){
                    role = encodeURIComponent(params.role);
                    endpoint = '/role/' + role;
                    methods.send(token,endpoint,'GET',null,callback);
                }else{
                    endpoint = '/role';
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
                endpoint = '/role';
                methods.send(token,endpoint,'POST',params,callback);
            }
        },

        put: function (params,callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var role,endpoint1,endpoint2;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                if (typeof params.role === 'undefined') {
                    var error={};
                    error.statusCode=400;
                    error.message='PUT requires a role to update';
                    if(callback){
                        callback(error, null);
                    }
                }else{
                    role = encodeURIComponent(params.role);
                    endpoint1 = '/role/' + role;
                    endpoint2 = '/role';
                    methods.merge(token,endpoint1,endpoint2,'PUT',params,callback);
                }
            }
        },

        delete: function (params, callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var role,endpoint;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{

                if (typeof params.role === 'undefined') {
                    var error={};
                    error.statusCode=400;
                    error.message='DELETE requires a role to remove';
                    if(callback){
                        callback(error, null);
                    }
                }else{
                    role = encodeURIComponent(params.role);
                    endpoint = '/role/' + role;
                    methods.send(token,endpoint,'DELETE',null,callback);
                }
            }
        },

        users:{
            get: function (params,callback) {
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint,role;
                var validateError = methods.validate(appId, params);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    if(typeof params.role !== 'undefined'){
                        role = encodeURIComponent(params.role);
                        endpoint = '/role/users/' + role;
                        methods.send(token,endpoint,'GET',null,callback);
                    }else{
                        var error={};
                        error.statusCode=400;
                        error.message='Users for role requires a role';
                        if(callback){
                            callback(error, null);
                        }
                    }
                }
            }
        }

    };

    return Revstack;

}));










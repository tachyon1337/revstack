
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

    Revstack.prototype.membership = {

        get: function (params,callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var endpoint,username;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                if(typeof params.name !== 'undefined'){
                    username = encodeURIComponent(params.name);
                    endpoint = '/membership/' + username;
                    methods.send(token,endpoint,'GET',null,callback);
                }else{
                    endpoint = '/membership';
                    methods.send(token,endpoint,'GET',null,callback);
                }
            }
        },

        post:function(params,callback){
            var appId = Revstack.appId;
            var token=this.token;
            var endpoint1,endpoint2;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{

                endpoint1 = '/role';
                endpoint2 = '/membership';
                methods.userRolesMerge(token,endpoint1,endpoint2,'POST',params,callback);
            }
        },

        put: function (params, callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var username,endpoint1,endpoint2;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                if (typeof params.name === 'undefined') {
                    var error={};
                    error.statusCode=400;
                    error.message='PUT requires a username and/or user data to update';
                    if(callback){
                        callback(error,null);
                    }
                }else{
                    username = encodeURIComponent(params.name);
                    endpoint1='/membership/' + username;
                    endpoint2 = '/membership';
                    methods.merge(token,endpoint1,endpoint2,'PUT',params,callback);
                }
            }
        },

        patch: function (params, callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var username,endpoint1,endpoint2;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                if (typeof params.name === 'undefined') {
                    var error={};
                    error.statusCode=400;
                    error.message='PUT requires a username and/or user data to update';
                    if(callback){
                        callback(error,null);
                    }
                }else{
                    username = encodeURIComponent(params.name);
                    endpoint1='/membership/' + username;
                    endpoint2 = '/membership';
                    methods.merge(token,endpoint1,endpoint2,'PUT',params,callback);
                }
            }
        },

        delete: function (params, callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var username,endpoint;

            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                if (typeof params.name === 'undefined') {
                    var error={};
                    error.statusCode=400;
                    error.message='DELETE requires a username';
                    if(callback){
                        callback(error,null);
                    }
                }else{
                    username = encodeURIComponent(params.name);
                    endpoint = '/membership/' + username;
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
                endpoint = '/datastore/lookup/' + query + '/-1';
                methods.send(token,endpoint,'GET',null,callback);
            }
        },


        pagination:{
            get: function(params,callback){
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint1,endpoint2;
                var validateError = methods.validate(appId, params);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    if (typeof params.query !== 'undefined') {
                        var query=params.query;
                        query = encodeURIComponent(query);
                        endpoint1='/datastore/_class/OUser';
                        endpoint2 = '/datastore/lookup/' + query + '/-1';
                        methods.pagination(token,endpoint1,endpoint2,'GET',null,callback);
                    }else{
                        //error
                        var error = {};
                        error.statusCode = 400;
                        error.message = 'membership pagination requires a query param';
                        if(callback){
                            callback(error, null);
                        }
                    }
                }
            },

            query: function (params,Class, callback) {
                if(typeof Class==='function'){
                    callback=Class;
                }
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint1,endpoint2;
                var validateError = methods.validate(appId, params);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    if (params.query1 && params.query2) {
                        var query1=params.query1;
                        query1 = encodeURIComponent(query1);
                        var query2=params.query2;
                        query2 = encodeURIComponent(query2);
                        endpoint1='/datastore/lookup/' + query1 + '/-1';
                        endpoint2 = '/datastore/lookup/' + query2 + '/-1';
                        methods.pagination(token,endpoint1,endpoint2,'GET',null,callback);
                    }else{
                        //error
                        var error = {};
                        error.statusCode = 400;
                        error.message = 'membership pagination requires query params';
                        if(callback){
                            callback(error, null);
                        }
                    }
                }
            }
        },

        role:{
            put: function (params,callback) {
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint;
                var validateError = methods.validateAppId(appId);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                     endpoint='/membership/add-user-to-role';
                     methods.send(token,endpoint,'PUT',params,callback);
                }
            },

            delete:function(params,callback){
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint;
                var validateError = methods.validateAppId(appId);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    endpoint='/membership/remove-user-from-role';
                    methods.send(token,endpoint,'DELETE',params,callback);
                }
            }
        },


        password:{

            reset:{
                get: function (params,callback) {
                    var appId = Revstack.appId;
                    var token=this.token;
                    var endpoint,error,username;
                    var validateError = methods.validateAppId(appId);
                    if (validateError) {
                        if(callback){
                            callback(validateError, null);
                        }
                    }else{
                        if(typeof params.name === 'undefined'){
                            //error
                            error={};
                            error.statusCode = 400;
                            error.message = 'username required';
                            if (callback) {
                                callback(error, null);
                            }
                        }else{
                            username = encodeURIComponent(params.name);
                            endpoint = '/membership/reset-password/' + username;
                            methods.send(token,endpoint,'GET',null,callback);
                        }
                    }
                }
            }
        }

    };

    return Revstack;

}));










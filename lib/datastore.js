/*
 * =============================================================
 * ellipse.module v0.9
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


    Revstack.prototype.datastore = {

        /* document -------------------------------------------------------------- **/
        get: function (params,Class, callback) {
            if(typeof Class==='function'){
                callback=Class;
                Class=undefined;
            }
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
                    endpoint = '/datastore/' + id;
                    methods.send(endpoint,'GET',null,callback);
                }else if(typeof Class !== 'undefined'){
                    Class = encodeURIComponent(Class);
                    endpoint = '/datastore/_class/' + Class;
                    methods.send(token,endpoint,'GET',null,callback);
                }else{
                    //error
                    var error={};
                    error.statusCode = 400;
                    error.message = 'datastore get requires a document class or a document id';
                    if(callback){
                        callback(error, null);
                    }
                }
            }
        },

        post: function (params,callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var endpoint;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                endpoint = '/datastore';
                methods.send(token,endpoint,'POST',params,callback);
            }
        },

        put: function (params, callback) {
            var appId = Revstack.appId;
            var token=this.token;
            console.log(this.token);
            var id,endpoint1,endpoint2;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                var obj = methods.validateId(params);
                if (typeof obj.error !== 'undefined') {
                    obj.error.message='PUT requires a model id and/or model data to update';
                    if(callback){
                        callback(obj.error,null);
                    }
                }else{
                    id = encodeURIComponent(params["@rid"]);
                    endpoint1='/datastore/' + id;
                    endpoint2 = '/datastore';
                    methods.merge(token,endpoint1,endpoint2,'PUT',params,callback);

                }
            }
        },

        patch: function (params, callback) {
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
                    obj.error.message='PATCH requires a model id and/or model data to update';
                    if(callback){
                        callback(obj.error,null);
                    }
                }else{
                    id = encodeURIComponent(params["@rid"]);
                    endpoint1='/datastore/' + id;
                    endpoint2 = '/datastore';
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
                    obj.error.message='DELETE requires a model id to remove';
                    if(callback){
                        callback(obj.error, null);
                    }
                }else{
                    id = encodeURIComponent(params["@rid"]);
                    endpoint = '/datastore/' + id;
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

        command: function (params,callback) {
            var appId = Revstack.appId;
            var token=this.token;
            var endpoint;
            var validateError = methods.validate(appId, params);
            if (validateError) {
                if(callback){
                    callback(validateError, null);
                }
            }else{
                var sql = params.sql;
                //urlencode string sql command
                sql = encodeURIComponent(sql);
                endpoint = '/datastore/command/' + sql + '/-1';
                methods.send(token,endpoint,'GET',null,callback);
            }
        },

        count:{
            get: function (params,Class, callback) {
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint,id;
                var validateError = methods.validate(appId, params);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    if(typeof Class !== 'undefined'){
                        Class = encodeURIComponent(Class);
                        endpoint = '/datastore/_class/' + Class;
                        methods.count(token,endpoint,'GET',null,callback);
                    }else{
                        //error
                        var error={};
                        error.statusCode = 400;
                        error.message = 'datastore count requires a document class';
                        if(callback){
                            callback(error, null);
                        }
                    }
                }
            }
        },

        pagination:{
            get: function (params,Class, callback) {
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint1,endpoint2;
                var validateError = methods.validate(appId, params);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{

                    if (typeof Class !== 'undefined' && params.query) {
                        Class = encodeURIComponent(Class);
                        var query=params.query;
                        query = encodeURIComponent(query);
                        endpoint1='/datastore/_class/' + Class;
                        endpoint2 = '/datastore/lookup/' + query + '/-1';
                        methods.pagination(token,endpoint1,endpoint2,'GET',null,callback);
                    }else{
                        //error
                        var error = {};
                        error.statusCode = 400;
                        error.message = 'datastore pagination requires a document class and/or query param';
                        if(callback){
                            callback(error, null);
                        }
                    }
                }
            },

            query: function (params,Class, callback) {
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
                        error.message = 'datastore pagination requires query params';
                        if(callback){
                            callback(error, null);
                        }
                    }
                }
            }
        },

        /* schema -------------------------------------------------------------- **/
        schema: {
            get: function (params,Class, callback) {
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint;
                var validateError = methods.validate(appId, params);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    if(typeof Class !== 'undefined'){
                        Class = encodeURIComponent(Class);
                        endpoint = '/datastore/schema/' + Class;
                        methods.send(token,endpoint,'GET',null,callback);
                    }else{
                        //error
                        var error = {};
                        error.statusCode = 400;
                        error.message = 'datastore schema requires a document class';
                        if(callback){
                            callback(error, null);
                        }
                    }
                }
            },

            post: function (params, callback) {
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint;
                var validateError = methods.validate(appId, params);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    endpoint = '/datastore/schema';
                    methods.send(token,endpoint,'POST',params,callback);
                }
            },

            put: function (params, Class,callback) {
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint1,endpoint2;
                var validateError = methods.validate(appId, params);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    Class = encodeURIComponent(Class);
                    endpoint1 = '/datastore/schema/' + Class;
                    endpoint2 = '/datastore/schema';
                    methods.merge(token,endpoint1,endpoint2,'PUT',params,callback);
                }
            },

            delete: function (Class, callback) {
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint;
                var validateError = methods.validateAppId(appId);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    if (typeof Class === 'undefined') {
                        var error={};
                        error.statusCode=400;
                        error.message='DELETE requires a schema class to remove';
                        if(callback){
                            callback(error, null);
                        }
                    }else{
                        Class = encodeURIComponent(Class);
                        endpoint = '/datastore/schema/' + Class;
                        methods.send(token,endpoint,'DELETE',null,callback);
                    }
                }
            }
        }


    };

    return Revstack;

}));






















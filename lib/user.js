
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

    Revstack.prototype.user = {

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
                    endpoint = '/user/' + id;
                    methods.send(token,endpoint,'GET',null,callback);
                }else{
                    endpoint = '/user';
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
                endpoint2 = '/user';
                methods.userRolesMerge(token,endpoint1,endpoint2,'POST',params,callback);
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
                endpoint1='/user';
                endpoint2 = '/user';
                methods.merge(token,endpoint1,endpoint2,'PUT',params,callback);
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
                endpoint = '/user';
                methods.send(token,endpoint,'DELETE',null,callback);
            }
        },

        role:{
            get: function (params,callback) {
                var appId = Revstack.appId;
                var token=this.token;
                var endpoint,role;
                var validateError = methods.validateAppId(appId);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    endpoint = '/user/role';
                    methods.send(token,endpoint,'GET',null,callback);
                }
            }
        },

        login:{
            get: function (params,callback) {
                var appId = Revstack.appId;
                var endpoint,error;
                var validateError = methods.validateAppId(appId);
                if (validateError) {
                    if(callback){
                        callback(validateError, null);
                    }
                }else{
                    if (typeof params.username === 'undefined') {
                        //error
                        error={};
                        error.statusCode = 400;
                        error.message = 'username required';
                        if (callback) {
                            callback(error, null);
                        }
                    }else if(typeof params.password === 'undefined'){
                        //error
                        error={};
                        error.statusCode = 400;
                        error.message = 'password required';
                        if (callback) {
                            callback(error, null);
                        }
                    }else{
                        endpoint = '/user/login';
                        methods.login(endpoint,params.username,params.password,'GET',callback);
                    }
                }
            }
        },

        password:{
            change:{
                get: function (params,callback) {
                    var appId = Revstack.appId;
                    var token=this.token;
                    var endpoint,error;
                    var validateError = methods.validateAppId(appId);
                    if (validateError) {
                        if(callback){
                            callback(validateError, null);
                        }
                    }else{
                        if (typeof params.oldPassword === 'undefined') {
                            //error
                            error={};
                            error.statusCode = 400;
                            error.message = 'old password required';
                            if (callback) {
                                callback(error, null);
                            }
                        }else if(typeof params.newPassword === 'undefined'){
                            //error
                            error={};
                            error.statusCode = 400;
                            error.message = 'new password required';
                            if (callback) {
                                callback(error, null);
                            }
                        }else{
                            var base64Value=methods.getEncodedCredentials(params.oldPassword,params.newPassword);
                            base64Value = encodeURIComponent(base64Value);
                            endpoint = '/user/change-password/' + base64Value;
                            methods.send(token,endpoint,'GET',null,callback);
                        }
                    }
                }

            },

            reset:{
                get: function (params,callback) {
                    var appId = Revstack.appId;
                    var token=this.token;
                    var endpoint;
                    var validateError = methods.validateAppId(appId);
                    if (validateError) {
                        if(callback){
                            callback(validateError, null);
                        }
                    }else{
                        endpoint = '/user/reset-password';
                        methods.send(token,endpoint,'GET',null,callback);
                    }
                }
            }
        }

    };

    return Revstack;

}));










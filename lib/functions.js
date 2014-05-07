
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
        module.exports = factory(require('async'),require('lodash'),require('./constructor'),require('./http/http'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['async','lodash','./constructor','./http/http'], factory);
    } else {
        // Browser globals (root is window)
        root.Revstack.methods=factory(root.async,root.lodash,root.Revstack,root.Revstack.http);
        root.returnExports = root.Revstack.methods;
    }
}(this, function (async,lodash,Revstack,http) {
    var _=lodash;
    if(typeof window !== 'undefined' && typeof module === 'undefined' && !module.exports){
        _=window._;
    }

    var methods={

        /**
         * validates appId,params & reformats id prop back to native format
         * @param appId {String}
         * @param params {Object}
         * @returns {Object}\null
         */
        validate:function(appId,params){
            var error={};
            //check for appId
            if(!appId){
                error.statusCode=400;
                error.message='appId required';
                return error;
                //validate params
            }else if (typeof params === 'undefined') {
                error.statusCode = 400;
                error.message = 'params required';
                return error;
                //recast id prop to native format, if applicable
            }else{
                this.cleanParams(params);
                return null;
            }
        },


        /**
         * validates appId
         * @param appId {String}
         * @returns {Object} |null
         */
        validateAppId:function(appId) {
            var error = {};
            //check for appId
            if (!appId) {
                error.statusCode = 400;
                error.message = 'appId required';
                return error;
            }else{
                return null;
            }
        },


        /**
         * validates id prop as "@rid"
         * @param params {Object}
         * @returns {Object}
         */
        validateId: function(params){
            var obj={};
            var rid=params["@rid"];
            if(typeof rid ==='undefined'){
                obj.error={
                    statusCode:400,
                    message:''
                };
            }
            obj.params=params;
            return obj;
        },


        /**
         * encodes old and new password
         * @param o {String}
         * @param n {String}
         * @returns {String}
         */
        getEncodedCredentials:function(o,n){
            return http.base64Encode(o,n);
        },


        /**
         * sends a method request to a http endpoint
         * @param token {String}
         * @param endpoint {String}
         * @param method {String}
         * @param data {Object}
         * @param callback {Function}
         */
        send:function(token,endpoint,method,data,callback){
            var self=this;
            if(typeof token==='undefined'){
                token=this.getToken();
            }

            var appId = Revstack.appId;
            var host = Revstack.host;
            var basePath = '/api/' + appId;
            var options = {
                host: host,
                path: basePath + endpoint,
                method: method
            };

            if(data){
                options.data=data;
            }

            if (typeof token != 'undefined') {
                options.authorization = http.encodeSessionToken(token);
            }

            http.send(options, function (err, data) {
                var filteredData;
                filteredData=(data) ? self.filterParams(data) : data;
                if(callback){
                    callback(err, filteredData);
                }
            });
        },

        /**
         * gets the object count of an http endpoint request
         * @param token {String}
         * @param endpoint {String}
         * @param method  {String}
         * @param data {Object}
         * @param callback {Function}
         */
        count:function(token,endpoint,method,data,callback){
            if(typeof token==='undefined'){
                token=this.getToken();
            }
            var appId = Revstack.appId;
            var host = Revstack.host;
            var basePath = '/api/' + appId;
            var options = {
                host: host,
                path: basePath + endpoint,
                method: method
            };

            if(data){
                options.data=data;
            }

            if (typeof token != 'undefined') {
                options.authorization = http.encodeSessionToken(token);
            }
            http.send(options, function (err, data) {
                var count=null;
                if(!err){
                    count=data.length;
                }
                if(callback){
                    callback(err, count);
                }
            });
        },

        /**
         * pagination query that returns a result in the format {count:count,data:data}
         * where count is the total number of objects for the query and data is the result set
         * for the passed index(or page)
         * @param token {String}
         * @param endpoint1 {String}  -->returns query count
         * @param endpoint2 {String}  -->returns query objects for the given index(page)
         * @param method {String}
         * @param data {Object}
         * @param fn {Function}
         */
        pagination:function(token,endpoint1,endpoint2,method,data,fn){
            var self=this;
            var appId = Revstack.appId;
            var host = Revstack.host;
            if(typeof token==='undefined'){
                token=this.getToken();
            }
            async.series([

                function(callback){
                    var basePath = '/api/' + appId;
                    var options = {
                        host: host,
                        path: basePath + endpoint1
                    };

                    if (typeof token != 'undefined') {
                        options.authorization = http.encodeSessionToken(token);
                    }
                    http.send(options, function (err, data) {
                        callback(err, data);
                    });
                },

                function(callback){
                    var basePath = '/api/' + appId;
                    var options = {
                        host: host,
                        path: basePath + endpoint2
                    };

                    if (typeof token != 'undefined') {
                        options.authorization = http.encodeSessionToken(token);
                    }
                    http.send(options, function (err, data) {
                        callback(err, data);
                    });
                }

            ],function(err,results){
                var filteredData=self.filterParams(results[1]);
                var err_=null,
                    result={};
                if(err){
                    err_=err;
                    result=null;
                }else{
                    result.count=results[0].length;
                    result.data=filteredData;
                }
                if(fn){
                    fn(err_,result);
                }

            });
        },

        /**
         * sends a method request to the login endpoint, returns the token in format {token:token}
         *
         * @param endpoint {String}
         * @param un {String}
         * @param pw {String}
         * @param method {String}
         * @param callback {Function}
         */
        login:function(endpoint,un,pw,method,callback){
            var appId = Revstack.appId;
            var host = Revstack.host;
            var basePath = '/api/' + appId;
            var options = {
                host: host,
                path: basePath + endpoint,
                method: method
            };

            options.authorization=http.base64Encrypt(un,pw);

            http.send(options, function (err, data) {
                if (!err) {
                    var token = data['access_token'];
                    data.token = token;
                    delete data['access_token'];
                }
                if(callback){
                    callback(err, data);
                }
            });
        },

        /**
         * merges a put/patch request wih the original object before saving
         * @param token {String}
         * @param endpoint1 {String} --> endpoint to 'GET' the original object
         * @param endpoint2 {String} --> save endpoint(PUT/PATCH)
         * @param method {String}
         * @param data {Object}
         * @param fn {Function}
         */
        merge:function(token,endpoint1,endpoint2,method,data,fn){
            var self=this;
            var appId = Revstack.appId;
            var host = Revstack.host;
            if(typeof token==='undefined'){
                token=this.getToken();
            }
            async.waterfall([

                function(callback){
                    var basePath = '/api/' + appId;
                    var options = {
                        host: host,
                        path: basePath + endpoint1
                    };

                    if (typeof token != 'undefined') {
                        options.authorization = http.encodeSessionToken(token);
                    }
                    http.send(options, function (err, data) {
                        callback(err, data);
                    });
                },

                function(oldModel,callback){
                    //do a merge
                    var newModel= _.merge(oldModel,data);
                    var basePath = '/api/' + appId;
                    var options = {
                        host: host,
                        path: basePath + endpoint2,
                        data: newModel,
                        method: method
                    };

                    if (typeof token != 'undefined') {
                        options.authorization = http.encodeSessionToken(token);
                    }

                    http.send(options, function (err, data) {
                        callback(err, data);
                    });
                }

            ],function(err,data){
                var filteredData=self.filterParams(data);
                var err_=null,
                    result=filteredData;
                if(err){
                    err_=err;
                    result=null;
                }
                if(fn){
                    fn(err_,result);
                }

            });
        },


        userRolesMerge:function(token,endpoint1,endpoint2,method,data,fn){
            var self=this;
            var appId = Revstack.appId;
            var host = Revstack.host;
            if(typeof token==='undefined'){
                token=this.getToken();
            }
            async.waterfall([

                function(callback){
                    var basePath = '/api/' + appId;
                    var options = {
                        host: host,
                        path: basePath + endpoint1
                    };

                    if (typeof token != 'undefined') {
                        options.authorization = http.encodeSessionToken(token);
                    }
                    http.send(options, function (err, data) {
                        callback(err, data);
                    });
                },

                function(appRoles,callback){
                    data.roles=_setRoles(appRoles,data.roles);
                    var basePath = '/api/' + appId;
                    var options = {
                        host: host,
                        path: basePath + endpoint2,
                        data: data,
                        method: method
                    };


                    if (typeof token != 'undefined') {
                        options.authorization = http.encodeSessionToken(token);
                    }

                    http.send(options, function (err, data) {
                        callback(err, data);
                    });
                }

            ],function(err,data){
                var filteredData=self.filterParams(data);
                var err_=null,
                    result=filteredData;
                if(err){
                    err_=err;
                    result=null;
                }
                if(fn){
                    fn(err_,result);
                }

            });


            function _setRoles(appRoles,userRoles){
                var roles=[];
                if(appRoles && appRoles.length){
                    appRoles.forEach(function(obj){
                        var o=_objInArray(obj,userRoles);
                        if(o){
                            roles.push(o);
                        }
                    });
                }

                return roles;
            }

            function _objInArray(obj,arr){
                var o_=null;
                arr.forEach(function(o){
                    if(o["@rid"]===obj["@rid"]){
                        o_=obj;
                    }
                });

                return o_;
            }
        },

        /**
         * replaces native "@rid" with custom id prop name in a result set
         * @param params {Object}\{Array}
         * @returns {Object}
         */
        filterParams:function(params){
            if(Revstack.id ==="@rid" || !params){
                return params;
            }else{
                return this._filter(params,filter);
            }

            function filter(o){
                if(o && o["@rid"]){
                    o[Revstack.id]=o["@rid"];
                    delete o["@rid"];
                }
                return o;
            }
        },

        /**
         * reverts data with custom id prop back to native "@rid"
         * @param params {Object}
         * @returns {Object}
         */
        cleanParams:function(params){
            if(Revstack.id ==="@rid"){
                return null;
            }else{
                return this._filter(params,filter);
            }

            function filter(o){
                if(o && o[Revstack.id]){
                    o["@rid"]=o[Revstack.id];
                    delete o[Revstack.id];
                }
                return o;
            }
        },

        /**
         * data(document) iterator that takes a custom function to apply a filter
         * @param document {Object}
         * @param filter {Function}
         * @returns {Object}
         * @private
         */
        _filter:function(document,filter){

            return __f(document);

            function __f(p){
                if(!_.isArray(p)){
                    for (var prop in p) {
                        if(p.hasOwnProperty(prop)){
                            (typeof p[prop] === 'object') ? __f(p[prop]) : filter(p);
                        }
                    }

                }else{
                    p.forEach(function(obj){
                        __f(obj);
                    });
                }

                return p;
            }
        },

        getToken:function(){
            if(typeof window !='undefined'){
                return $.cookie('apiToken');
            }
        }

    };

    return methods;

}));
























/*
 * =============================================================
 * revstack v0.9.0
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * async
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        if(typeof window !=='undefined'){
            module.exports = factory(require('../crypto/base64'));
        }else{

            module.exports = factory(require('../crypto/base64'));
        }

    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../crypto/base64'], factory);
    } else {
        // Browser globals (root is window)
        root.Revstack.http=factory(root.Revstack.crypto.Base64);
        root.returnExports = Revstack.http;
    }
}(this, function (Base64) {

    var http = {

        base64Encrypt: function(un,pw){
            var authorization;
            if(typeof window==='undefined'){
                /* server */
                authorization = 'Basic ' + new Buffer(un + ":" + pw).toString('base64');
            }else{
                /* browser */
                authorization = 'Basic ' + Base64.encode(un + ":" + pw);
            }

            return authorization;
        },

        base64Encode:function(o,n){
            var authorization;
            if(typeof window==='undefined'){
                /* server */
                authorization = new Buffer(o + ":" + n).toString('base64');
            }else{
                /* browser */
                authorization = Base64.encode(o + ":" + n);
            }

            return authorization;
        },

        encodeSessionToken: function(token){
            var authorization = 'Session ' + token;
            return authorization;
        },

        send: function (params, callback) {
            if (typeof window === 'undefined') { /* server-side.  */
                Node.send(params, function (err, data) {
                    if (callback) {
                        callback(err, data);
                    }
                });

            } else {
                Ajax.send(params, function (err, data) { /* browser */
                    if (callback) {
                        callback(err, data);
                    }
                });

            }
        }
    };

    var Ajax = {

        send: function (params,callback) {

            var settings = {
                type: params.method || 'GET',
                dataType: params.dataType || 'json',
                url: 'http://' + params.host + ':' + (params.port || 80) + params.path

            };

            if (params.data) {
                params.data = JSON.stringify(params.data);
                settings.data = params.data;
                settings.contentType = 'application/json';

            }
            if (params.authorization) {
                settings.beforeSend = function (req) {
                    req.setRequestHeader('Authorization', params.authorization);
                }
            }

            var ajax = $.ajax(settings).done(function (data, status) {
                try {
                    callback(null, data);

                } catch (ex) {

                    var _err = {
                        statusCode: 500,
                        message: ex
                    };
                    callback(_err, null);
                }

            }).fail(function (data, status, errThrown) {

                var err={};
                err.statusCode=data.status;
                err.message=errThrown;

                callback(err, null);
            });

        }

    };

    var Node = {

        send: function (params, callback) {


            var http;
            try{
                http = nodeRequire('http');
            }catch(ex){
                http=require('http');
            }


            /* http.request settings */
            var settings = {
                host: params.host,
                port: params.port || 80,
                path: params.path,
                headers: params.headers || {},
                method: params.method || 'GET'
            };

            if (params.data) {
                params.data = JSON.stringify(params.data);
                settings.headers['Content-Type'] = 'application/json';
                settings.headers['Content-Length'] = params.data.length;
            }
            if (params.authorization) {
                settings.headers['Authorization'] = params.authorization;
            }

            /* send the request */
            var req = http.request(settings);

            /* if data, write it to the request */
            if (params.data) {
                req.write(params.data);
            }

            /* when the response is received */
            req.on('response', function (res) {
                res.body = '';
                res.setEncoding('utf-8');

                /* concat the data chunks */
                res.on('data', function (chunk) {

                    res.body += chunk
                });

                /* when the response has finished */
                res.on('end', function () {

                    /* fire the callback */

                    try {

                        var len=res.body.length;
                        var data;
                        var err={};
                        if(len>0){

                            data = JSON.parse(res.body);
                            if(res.statusCode >=200 && res.statusCode <=206){
                                callback(null, data);
                            }else{
                                err.statusCode=res.statusCode;
                                err.message=data;
                                callback(err, null);
                            }
                        }else{
                            if(res.statusCode >=200 && res.statusCode <=206){
                                data={};
                                data.statusCode=res.statusCode;
                                callback(null, data);
                            }else{
                                err.statusCode=res.statusCode;
                                callback(err,null);
                            }

                        }


                    } catch (ex) {

                        err = {
                            statusCode: 500,
                            message: ex
                        };
                        callback(err, null);

                    }

                });

                req.on('error', function (e) {
                    var err = {};
                    err.status = 500 || e.statusCode;
                    err.message = e.message;

                    callback(err, null);

                });
            });


            /* end the request */
            req.end();


        }
    };


    return http;


}));




/*
 * =============================================================
 * revstack v0.9.0
 * =============================================================
 * Copyright (c) 2014 S.Francis, MIS Interactive
 * Licensed MIT
 *
 * Dependencies:
 * async,lodash
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.Revstack=factory();
        root.returnExports = Revstack;
    }
}(this, function () {
    //constructor--------------------------->
    function Revstack(opts){
        if(typeof opts==='undefined'){
            opts={};
        }
        __props(this);

        /* recursively assign the token to each object chained
            to the constructor prototype

            NOTE: if we were strictly confined to the browser, we could just
            set the token on the constructor. However, server-side on node, the constructor is shared
            across requests, so bad idea. We can set the appId and hostname on the constructor, but the
            token needs to be set on each "new instance." And since we are "namespacing the methods"(i.e, revstack.datastore.get()
            rather than,say, revstack.getFromDataStore()), the prototype context will not be available to the methods(i.e,
            "this" in revstack.datastore.get() refers to Revstack.prototype.datastore and not Revstack.prototype, we have to recursively
            iterate the object chain on the prototype and forego hasOwnProperty checking
         */

        function __props(obj){
            for (var prop in obj) {
                if (typeof obj[prop] === 'object') {
                    obj[prop]['token']=opts.token;
                    __props(obj[prop]);
                }
            }
        }
    }



    //developer assigned appId
    Revstack.appId=null;

    //remote host setting
    Revstack.host='baas2.r3vstack.com';

    //configurable id prop name
    Revstack.id="@rid";

    return Revstack;


}));























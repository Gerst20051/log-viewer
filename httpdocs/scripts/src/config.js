/* global requirejs: false */

requirejs.config({
    paths: {
        jquery: '/components/jquery/dist/jquery',
        moment: '/components/moment/moment',
        sockjs: '//cdnjs.cloudflare.com/ajax/libs/sockjs-client/0.3.4/sockjs.min',
        underscore: '/components/underscore/underscore'
    },
    shim: {
        sockjs: {
            exports: 'SockJS'
        }
    },
    urlArgs: (new Date()).getTime()
});

require.config({
    baseUrl: '/scripts/src'
});

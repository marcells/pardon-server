
var pardonApp = angular.module('pardonApp', ['luegg.directives']);

pardonApp.directive('pardonEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if(event.ctrlKey && event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.pardonEnter);
                });

                event.preventDefault();
            }
        });
    };
});

pardonApp.directive('elastic', [
    '$timeout',
    function($timeout) {
      return {
        restrict: 'A',
        link: function($scope, element) {
          var resize = function() {
            if (element[0].scrollHeight < 100) {
                element[0].style.height = '1px';
                element[0].style.height = '' + (element[0].scrollHeight + 4) + 'px';
                updatedFooterSize();
            }
          };

          element.on('blur keyup keydown change', resize);
          $timeout(resize, 0);
        }
      };
    }
  ]);

pardonApp.controller('ChatController', function ($scope) {
    var that = this;

    that.messages = [];

    var socket = io.connect();
    
    socket.on('received', function (data) {
        $scope.$apply(function () {
            that.messages.push({
                _id: data._id,
                date: data.date,
                user: data.user,
                message: data.message
            });
        });
    });

    socket.on('messagesLoaded', function (data) {
        $scope.$apply(function () {
            that.messages = data.messages;
        });
    });

    socket.on('notLoggedIn', function (data) {
        $scope.$apply(function () {
            that.messages.push({
                date: data.date,
                user: 'System',
                message: 'Message not sent! You are not logged in!'
            });
        });
    });

    socket.on('errorOccured', function (data) {
        $scope.$apply(function () {
            that.messages.push({
                date: data.date,
                user: 'System',
                message: 'Message not sent! Some error occured!'
            });
        });
    });

    $scope.send = function() {
        socket.emit('send', { message: that.message });
        that.message = '';
    };
});

function updatedFooterSize() {
    $('body').css('margin-bottom', $('.footer').height());
}

$(window).resize(function() {
    updatedFooterSize();
});

$(function () {
    FastClick.attach(document.body);
    $('textarea').focus();
});

var pardonApp = angular.module('pardonApp', []);

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

    var socket = io.connect('http://localhost:3000');
    
    socket.on('recieve', function (data) {
        $scope.$apply(function () {
            that.messages.push({ 
                user : 'foreign', 
                text : data.message
            });
        });
    });

    that.messages = [
        {'user': 'User 1', 'text': 'Lorem impsum...'},
        {'user': 'User 2', 'text': 'Lorem impsum dolor?'}
    ];

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
    $('textarea').focus();
});
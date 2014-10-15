
var pardonApp = angular.module('pardonApp', []);

pardonApp.directive('pardonEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.ctrlKey && event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.pardonEnter);
                });

                event.preventDefault();
            }
        });
    };
});

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
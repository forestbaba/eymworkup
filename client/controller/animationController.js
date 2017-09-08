ngular.module('myApp',['ngAnimate'])
    .run(function($rootScope, $timeout) {

        setBg();

        var nr = 1;
        function setBg() {
            $rootScope.image = 'http://lorempixel.com/200/200/people/'+nr;
            //$rootScope.image = '../public/img/backg/'+nr;


        //<img src="../public/img/risen.jpg" alt="" width="2"/>

                nr++;
            if(nr>3) { nr=1; }

            $timeout(setBg,4000);
        }
    })

    .animation('.myApp',function() {
        return {
            leave:function(ele,done) {
                ele[0].style.opacity = 0;
                setTimeout(done,1500);
            }
        }
    });

angular.bootstrap(document.body,['myApp']);
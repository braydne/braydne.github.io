(function(){

    "use strict";

    // Variables
    // =========================================================================================
    var $html = $('html'),
        $document = $(document),
        $window = $(window),
        i = 0;


    // Scripts initialize
    // ===================

    document.write('<script async defer src="//maps.googleapis.com/maps/api/js?key=AIzaSyAYjhWq7DvCwCiRKotPu9_IXQxupSQbhuo" type="text/javascript"></script>');

    $window.on('load', function () {

        // =================================================================================
        // Preloader
        // =================================================================================
        var $preloader = $('#page-preloader');
        $("body").delay(100).addClass("loaded");

        var yt_player = $(".player");
        if(yt_player.length){
            yt_player.mb_YTPlayer({
                mute: true,
                containment: '.video-wrapper',
                showControls:false,
                autoPlay:true,
                loop:true,
                startAt:0,
                quality:'default'
            });
            $(".btn-stop-video").on("click", function(){
                yt_player.YTPTogglePlay();
                $(this).toggleClass("paused");
            });
            $(".btn-mute-video").on("click", function(){
                yt_player.YTPToggleVolume();
                $(this).toggleClass("paused");
            });
        }

        // =================================================================================
        // Google Map
        // =================================================================================
        var map = $(".map");
        if(map.length){
            var mapWrapper = $('#google-map'),
                latlng = new google.maps.LatLng(mapWrapper.data("x-coord"), mapWrapper.data("y-coord")),
                myOptions = {
                    scrollwheel: false,
                    zoom: 10,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: false,
                },
                map = new google.maps.Map(mapWrapper[0], myOptions),
                marker = new google.maps.Marker({
                    position: {lat: mapWrapper.data("x-coord"), lng: mapWrapper.data("y-coord")},
                    draggable: false,
                    animation: false,
                    map: map,
                }),
                infowindow = new google.maps.InfoWindow({
                    content: mapWrapper.data("text")
                });

            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
        }
    });


    $document.ready(function () {

        // =================================================================================
        // Contact Form
        // =================================================================================
        var contactForm = $(".contact-form");
        if(contactForm.length){
            var contactResault = $("body").append("<span class='form-resault'></span>").find(".form-resault");
            contactForm.each(function(){
                var this_form = $(this);
                var contactFormInput = this_form.find(".form-control.required");

                contactFormInput.on("blur", function(){
                    if(!$.trim($(this).val())){
                        $(this).parent().addClass("input-error");
                    }
                });

                contactFormInput.on("focus", function(){
                    $(this).parent().removeClass("input-error");
                });

                this_form.on("submit", function() {
                    var form_data1 = $(this).serialize();
                    if(!contactFormInput.parent().hasClass("input-error") && contactFormInput.val()){
                        $.ajax({
                            type: "POST",
                            url: "php/contact.php",
                            data: form_data1,
                            success: function() {
                                contactResault.addClass("correct");
                                contactResault.html("Your data has been sent!");
                                setTimeout(function(){
                                    contactResault.removeClass("incorrect").removeClass("correct");
                                }, 4500);
                            }
                        });
                    } else{
                        if(contactFormInput.val() === ""){
                            var contactFormInputEmpty = contactFormInput.filter(function(){
                                return $(this).val() === "";
                            });
                            contactFormInputEmpty.parent().addClass("input-error");
                        }
                        contactResault.addClass("incorrect");
                        contactResault.html("You must fill in all required fields");
                        setTimeout(function(){
                            contactResault.removeClass("incorrect").removeClass("correct");
                        }, 4500);
                    }
                    return false;
                });
            });
        }

        // =======
        // Fancybox
        // =======
        var fancybox = $(".fancybox");
        if(fancybox.length){
            fancybox.fancybox({
                openEffect: 'elastic',
                closeEffect: 'elastic'
            });
        }
        var fancybox_media = $('.fancybox-media');
        if(fancybox_media.length){
            fancybox_media.fancybox({
                openEffect  : 'fade',
                closeEffect : 'fade',
                helpers : {
                    media : {}
                }
            });
        }

        // =================================================================================
        // Responsive Nav
        // =================================================================================
        var responsiveNav = new Navigation({
            init: true,
            stuck: true,
            responsive: true,
            breakpoint: 992, // don't forget to change in css as well
        });

        // =================================================================================
        // Video
        // =================================================================================
        var video = $('.video-wrap');
        if (video.length) {
            $(".overlay-image").on("click", function(){
                $(this).addClass("hid");
                $("#video")[0].src += "&autoplay=1";
            });
        }

        // =================================================================================
        // Parallax Blocks
        // =================================================================================
        var parallax_block = $(".js-parallax-block");
        var parallaxBlock = function() {
            parallax_block.each(function(){
                if($window.width() >= 1200){
                    var it = $(this);
                    var elem_parent = it.parent();
                    var elem_speed = it.attr("data-multiplier");
                    var elem_pos = it.attr("data-pos");

                    var ot = elem_parent.offset().top * elem_speed;
                    var st = $window.scrollTop() * elem_speed;

                    var a = elem_pos - (elem_pos - st) * 0.08;
                    var b = ot - a - 25;
                    it.css({
                        transform: "translate3d(0px, " + b + "px, 0px)"
                    });
                    it.attr("data-pos", a);
                } else {
                    $(this).css({
                        transform: "translate3d(0px, 0px, 0px)"
                    });
                }
            });
            window.requestAnimationFrame(parallaxBlock);
        };
        if(parallax_block.length){
            parallaxBlock();
        }

        // =================================================================================
        // UIToTop
        // =================================================================================
        $().UItoTop();

        // =================================================================================
        // Progress Bar
        // =================================================================================
        var progressBar = $(".progress-bar");
        if (progressBar.length) {
            $(document).on("scroll", function () {
                progressBar.not('.scrolled').each(function () {
                    var position = $(this).offset().top;
                    var item_offset = $window.scrollTop() + $window.height();
                    if (item_offset > position) {
                        var item = $(this);
                        var start = item.attr("data-valuemin");
                        var end = item.attr("data-valuenow");
                        item.css({width: end + '%'});
                        item.parent().find('.progress-bar-counter')
                            .removeClass("hide")
                            .counter({
                                start: start,
                                end: end,
                                time: 0.7,
                                step: 50
                            });
                        item.addClass('scrolled');
                    }
                });
            }).trigger("scroll");
        }

        // =================================================================================
        // ISOTOPE
        // =================================================================================
        var isotope = $('.iso');
        // debounce so filtering doesn't happen every millisecond
        function debounce( fn, threshold ) {
            if(isotope.length){
                var timeout;
                return function debounced() {
                    if ( timeout ) {
                        clearTimeout( timeout );
                    }
                    function delayed() {
                        fn();
                        timeout = null;
                    }
                    timeout = setTimeout( delayed, threshold || 100 );
                }
            }
        }
        if (isotope.length) {
            $( function() {
                var $grid = $('.grid').isotope({
                    itemSelector: 'article'
                });
                // filter buttons
                $('.filters-button-group').on( 'click', 'button', function() {
                    var filterValue = $( this ).attr('data-filter');
                    $grid.isotope({ filter: filterValue });
                    $window.trigger("resize");
                });
                $('.button-group').each( function( i, buttonGroup ) {
                    var $buttonGroup = $( buttonGroup );
                    $buttonGroup.on( 'click', 'button', function() {
                        $buttonGroup.find('.is-checked').removeClass('is-checked');
                        $( this ).addClass('is-checked');
                    });
                });
            });

            $window.on("load", function() {
                $('.iso .button-group button.is-checked').trigger("click");
            });
        }

        // =================================================================================
        // Owl carousel
        // =================================================================================
        var slider_1 = $('.slider_1');
        if (slider_1.length) {
            slider_1.owlCarousel({
                mouseDrag: false,
                nav: false,
                loop: true,
                animateIn: "fadeIn",
                animateOut: "fadeOut",
                autoplay: true,
                dots: false,
                items: 1,
            });
            $(".owl-custom-prev").on("click", function () {
                slider_1.trigger('prev.owl.carousel');
                return false;
            });

            $(".owl-custom-next").on("click", function () {
                slider_1.trigger('next.owl.carousel');
                return false;
            });
        }
        var slider_2 = $('.slider_2');
        if (slider_2.length) {
            slider_2.owlCarousel({
                mouseDrag: true,
                nav: false,
                loop: true,
                autoplay: true,
                autoplayTimeout: 3500,
                autoplaySpeed: 1500,
                dots: true,
                items: 3,
                margin: 30,
                responsive:{
                    0:{ items: 1, },
                    768:{ items: 2, },
                    992:{ items: 3, },
                }
            });
        }
        var slider_3 = $('.slider_3');
        if (slider_3.length) {
            slider_3.owlCarousel({
                mouseDrag: true,
                nav: false,
                loop: true,
                autoplay: true,
                autoplayTimeout: 3500,
                autoplaySpeed: 1500,
                dots: true,
                items: 4,
                margin: 30,
                responsive:{
                    0:{ items: 1, },
                    480:{ items: 2, },
                    768:{ items: 3, },
                    992:{ items: 4, },
                }
            });
        }

        // =======
        // Particles
        // =======
        var particles = $('#particles-js');
        if (particles.length) {
            if($("body").hasClass("dark")){
                particlesJS('particles-js',
                    {
                        "particles": {
                            "number": {
                                "value": 100,
                                "density": {
                                    "enable": true,
                                    "value_area": 800
                                }
                            },
                            "color": {
                                "value": "03a9f4"
                            },
                            "shape": {
                                "type": "circle",
                            },
                            "opacity": {
                                "value": 0.5,
                                "random": false,
                                "anim": {
                                    "enable": false,
                                    "speed": 1,
                                    "opacity_min": 0.1,
                                    "sync": false
                                }
                            },
                            "size": {
                                "value": 2,
                                "random": true,
                                "anim": {
                                    "enable": false,
                                    "speed": 40,
                                    "size_min": 0.1,
                                    "sync": false
                                }
                            },
                            "line_linked": {
                                "enable": true,
                                "distance": 150,
                                "color": "03a9f4",
                                "opacity": 0.4,
                                "width": 1
                            },
                            "move": {
                                "enable": true,
                                "speed": 2,
                                "direction": "none",
                                "random": false,
                                "straight": false,
                                "out_mode": "out",
                            }
                        },
                        "interactivity": {
                            "detect_on": "canvas",
                            "events": {
                                "onhover": {
                                    "enable": true,
                                    "mode": "grab"
                                },
                                "onclick": {
                                    "enable": true,
                                    "mode": "push"
                                },
                                "resize": true
                            },
                            "modes": {
                                "grab": {
                                    "distance": 200,
                                    "line_linked": {
                                        "opacity": 1
                                    }
                                },
                                "repulse": {
                                    "distance": 100
                                },
                                "push": {
                                    "particles_nb": 4
                                },
                            }
                        },
                        "retina_detect": true,
                    }
                )
            } else {
                particlesJS('particles-js',
                    {
                        "particles": {
                            "number": {
                                "value": 150,
                                "density": {
                                    "enable": true,
                                    "value_area": 800
                                }
                            },
                            "color": {
                                "value": "#ffffff"
                            },
                            "shape": {
                                "type": "circle",
                            },
                            "opacity": {
                                "value": 0.7,
                                "random": false,
                                "anim": {
                                    "enable": false,
                                    "speed": 1,
                                    "opacity_min": 0.1,
                                    "sync": false
                                }
                            },
                            "size": {
                                "value": 2,
                                "random": true,
                                "anim": {
                                    "enable": false,
                                    "speed": 80,
                                    "size_min": 0.1,
                                    "sync": false
                                }
                            },
                            "line_linked": {
                                "enable": true,
                                "distance": 150,
                                "color": "#72dfff",
                                "opacity": 0.5,
                                "width": 3 //line width
                            },
                            "move": {
                                "enable": true,
                                "speed": 2,
                                "direction": "none",
                                "random": false,
                                "straight": false,
                                "out_mode": "out",
                            }
                        },
                        "interactivity": {
                            "detect_on": "canvas",
                            "events": {
                                "onhover": {
                                    "enable": false,
                                    "mode": "grab"
                                },
                                "onclick": {
                                    "enable": true,
                                    "mode": "push"
                                },
                                "resize": true
                            },
                            "modes": {
                                "grab": {
                                    "distance": 200,
                                    "line_linked": {
                                        "opacity": 1
                                    }
                                },
                                "repulse": {
                                    "distance": 100
                                },
                                "push": {
                                    "particles_nb": 6
                                },
                            }
                        },
                        "retina_detect": true,
                    }
                )
            }
        };

    });

})();

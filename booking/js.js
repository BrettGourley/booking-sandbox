﻿$(document).ready(function(){
    var startIndex = 0,
		currentIndex = startIndex,
		itemsPerPage = 5,
		lastIndex = 0,
		nextIndex = itemsPerPage,
        hotelLrgImgArr = [],
        carouselCounter = 0,
        interval = '',
        carouselToggle = false,
        autoplay = "Start",
        autoplayTxt = " Slideshow",
        reverseArr = [],
        hotelLrgImg = "",
        hotelArr = [],
        slideShowTimer = 5000,
        map,
        bSort = true,
        reviewObjArr = [];

    //var jsonUrl = "hotels.json";
    function init(hotelJSON) {
        //$.ajax({
        //    url: jsonUrl,
        //    dataType: 'json',
        //    success: function (response) {
        //        getJson(response);
        //        console.log(response);
        //}
        //});
        getJson(hotelJSON);
    }
	

    function getJson(hotelJSON) {
        var hotelThumbImg = "",
            hotelName = "",
            hotelStars = "",
            hotelAddress = "",
            hotelDescription = "",
            hotelFacilities = "",
            hotelRooms = "";
        for (var i = 0; i < hotelJSON.length; i++) {
            var hotel = hotelJSON[i],
	        revImgArr = hotel.img.reverse()
            reverseArr = revImgArr;
            hotelName = hotel.hotelName;
            hotelStars = hotel.hotelStars;
            hotelAddress = hotel.hotelAddress;

            // load hotel name
            loadHotelImages(revImgArr, true);
            
            for (var img in hotel.img) {
                hotelThumbImg += "<li class='one_photo'><img src='" + hotel.img[img].imgThumb
                    + "'alt='" + hotel.img[img].imgDescription
	                + "'class='img-tab' /></li>";
                hotelLrgImgArr.push(hotel.img[img].imgLarge);
            }
            carouselCounter = hotelLrgImgArr.length+1;
            //load hotel description
            for (var desc = 0; desc < hotel.hotelDescription.length; desc++) {
                hotelDescription += "<p>"
                    + hotel.hotelDescription[desc]
                    + "</p>";
            }

            // load facilities
            for (var fac in hotel.facilities) {
                hotelFacilities += "<li>" + hotel.facilities[fac] + "</li>";
            }

            // load reviews
            for (var j = 0; j < hotel.review.length; j++) {
                var review = {
                    score: "<li class='one_review'><strong class='review_score'>" + hotel.review[j].reviewScore + "</strong>",
                    review: "<blockquote class='review_content'>" + hotel.review[j].reviewContent + "<cite>",
                    cite: hotel.review[j].cite + "</blockquote></li>",
                    sortNum: hotel.review[j].reviewScore
                }
                reviewObjArr.push(review);
            }   
        }

        // add hotel name and rating
        $(".hotel_name").html(hotelName + "<span class='stars'>" + hotelStars + "</span>");
        // add hotel address
        $(".hotel_address").html(hotelAddress);
        // add hotel description
        $('.description').append(hotelDescription);
        // add photos 
        //$(".large-img").html(hotelLrgImg);
        $(".thumb-img").html("<ul>" + hotelThumbImg + "</ul>");
        // add facilities
        $(".facilities").append("<ul>" + hotelFacilities + "</ul>");
        // call to load reviews
        loadReviews();
    }
    function loadHotelImages(reverseArr, firstLoad) {
        hotelLrgImg = [];
        for (var lrgImg in reverseArr) {        
            hotelLrgImg += "<img src='" + reverseArr[lrgImg].imgLarge + "' alt='" + reverseArr[lrgImg].imgDescription + "' />";
        }
        if (!firstLoad) {
            $(".large-img > img").remove();
        }
        hotelLrgImg = "<div class='autoplay'>" + autoplay + autoplayTxt + "</div>" + hotelLrgImg;
        $(".large-img").html(hotelLrgImg);
    };

    var ImageBinder = function () {
        if ($(".large-img > img").length <= 1) {
            loadHotelImages(reverseArr, false);
        }
        carouselToggle = carouselCounter <= 2 ? true : (carouselCounter > hotelLrgImgArr.length + 1 ? false : carouselToggle);
        carouselCounter = carouselCounter > hotelLrgImgArr.length + 1 ? carouselCounter-- : (carouselCounter < 3 ? carouselCounter++ : carouselCounter);
        if (!carouselToggle) {	        
            $(".large-img img:nth-child(" + carouselCounter + ")").addClass("img-top");
            carouselCounter--;
        } else {
            $(".large-img img:nth-child(" + carouselCounter + ")").removeClass("img-top");
            carouselCounter++;
        }
    }

    $('body').on('click', 'img', function () {
        if ($(this).hasClass("img-tab")) {
            hotelLrgImg = "<div class='autoplay'></div><img src='" + $(this).attr('src').replace('_thumb', '_large') + "' />";
            $(".large-img").html(hotelLrgImg);
            autoplay = "Start";
            clearInterval(interval);
            if (autoplay == "Start") {
                $(".autoplay").html(autoplay + autoplayTxt);
            } else {
                $(".autoplay").html(autoplay + autoplayTxt);
            }
        }
	    
    });
    $('body').on('click', 'div', function () {
        if ($(this).hasClass("autoplay")) {
            if (autoplay == "Start"){
                autoplay = "Stop";
                interval = setInterval(ImageBinder, slideShowTimer);
            }else{
                autoplay = "Start";	            
                clearInterval(interval);
            }
            $(this).html(autoplay + autoplayTxt);
        }
    });

    // review functions
    function loadReviews(){
        var reviews = "";
        startIndex = 0;
        for (var review = startIndex; review < itemsPerPage; review++) {
            reviews += reviewObjArr[review].score + reviewObjArr[review].review + reviewObjArr[review].cite;
        }
        $(".reviews_list").html(reviews);
    }
    function pageForward(){
        var reviews = "";	    
        if (startIndex > (reviewObjArr.length - itemsPerPage)) {
            return;
        }
        lastIndex = startIndex;
        startIndex = startIndex + nextIndex;	            
        for (var review = startIndex; review < startIndex + itemsPerPage; review++) {
            if (review >= reviewObjArr.length) {
                break;
            }
            reviews += reviewObjArr[review].score + reviewObjArr[review].review + reviewObjArr[review].cite;
        }
        $(".reviews_list").html(reviews);
    }
    function pageBack(){
        var reviews = "";
        startIndex = startIndex <= 0 ? startIndex : lastIndex;
        lastIndex = startIndex - itemsPerPage;
	        
        for (var review = startIndex; review < startIndex + itemsPerPage; review++) {
            if (review < 0) {
                break;
            }
            reviews += reviewObjArr[review].score + reviewObjArr[review].review + reviewObjArr[review].cite;
        }
        $(".reviews_list").html(reviews);
    }
    function sort() {
        if (bSort) {
            reviewObjArr.sort(function (a, b) { return (b.sortNum - a.sortNum) });
            bSort = false;
        } else {
            reviewObjArr.sort(function (a, b) { return (a.sortNum - b.sortNum) });
            bSort = true;
        }
        loadReviews();
    }
	

    $("#next-btn").click(function () {
        pageForward();    
    });

    $("#back-btn").click(function () {
        pageBack();
    });

    $("#sort-btn").click(function () {
        sort();
    });

    // Add google maps and nearby places
    function initialize() {
        var mapCanvas = document.getElementById("map-canvas");
        var latlng = new google.maps.LatLng(48.8302561, 2.318168300000025);
        var mapOptions = {
            center: latlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(mapCanvas, mapOptions)

        var request = {
            location: latlng,
            radius: '500',
            types: ['restaurant', 'shopping_mall', 'clothing_store', 'museum', 'bar']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);

        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Hotel Fantastique"
        });
    }
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            title: place.name,
            icon: place.icon,
            position: place.geometry.location
        });
    }
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                createMarker(results[i]);
            }
        }
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    

    // json scheme converted to js object due to requirements of no server.
    var hotelJSON =  [{
        hotelName: "Hotel Fantastique",
        hotelStars: "★★★★★",
        hotelAddress: "72b Rue de Awesome, 75001, Paris, France",
        img: [
            {
                imgLarge: "img/1_large.jpg",
                imgThumb: "img/1_thumb.jpg",
                imgDescription: "description of photo 1"
            },
            {
                imgLarge: "img/2_large.jpg",
                imgThumb: "img/2_thumb.jpg",
                imgDescription: "description of photo 2"
            },
            {
                imgLarge: "img/3_large.jpg",
                imgThumb: "img/3_thumb.jpg",
                imgDescription: "description of photo 3"
            },
            {
                imgLarge: "img/4_large.jpg",
                imgThumb: "img/4_thumb.jpg",
                imgDescription: "description of photo 4"
            },
            {
                imgLarge: "img/5_large.jpg",
                imgThumb: "img/5_thumb.jpg",
                imgDescription: "description of photo 5"
            },
            {
                imgLarge: "img/6_large.jpg",
                imgThumb: "img/6_thumb.jpg",
                imgDescription: "description of photo 6"
            },
            {
                imgLarge: "img/7_large.jpg",
                imgThumb: "img/7_thumb.jpg",
                imgDescription: "description of photo 7"
            },
            {
                imgLarge: "img/8_large.jpg",
                imgThumb: "img/8_thumb.jpg",
                imgDescription: "description of photo 8"
            },
            {
                imgLarge: "img/9_large.jpg",
                imgThumb: "img/9_thumb.jpg",
                imgDescription: "description of photo 9"
            },
            {
                imgLarge: "img/10_large.jpg",
                imgThumb: "img/10_thumb.jpg",
                imgDescription: "description of photo 10"
            },
            {
                imgLarge: "img/11_large.jpg",
                imgThumb: "img/11_thumb.jpg",
                imgDescription: "description of photo 11"
            },
            {
                imgLarge: "img/12_large.jpg",
                imgThumb: "img/12_thumb.jpg",
                imgDescription: "description of photo 12"
            },
            {
                imgLarge: "img/13_large.jpg",
                imgThumb: "img/13_thumb.jpg",
                imgDescription: "description of photo 13"
            },
            {
                imgLarge: "img/14_large.jpg",
                imgThumb: "img/14_thumb.jpg",
                imgDescription: "description of photo 14"
            }
        ],
        hotelDescription: [
                "Located in the heart of Paris, this 5-star hotel offers elegant guest rooms in a Hausmannian-style building. It features a fitness centre, a concierge and a tour desk with ticket service.",
                "Decorated in a unique style, the air-conditioned guest rooms at the Hotel du Louvre are equipped with satellite TV, a minibar and free Wi-Fi access. Some rooms feature a seating area. All rooms have a private bathroom, some include marble features.",
                "The hotel restaurant, Brasserie du Louvre, has a traditional Parisian decor and serves traditional French cuisine. A buffet breakfast is served every morning. Guests can also enjoy a cocktail and jazz evenings twice a week in the Defender Bar.",
                "The 4 facades and terrace of this hotel overlook the famous Louvre Museum, the Opéra Garnier and the Comédie Française theatre.",
                "Hotel du Louvre is situated 2 minutes from Palais Royal Metro Station, providing direct access to the Champs Elysees and the Place de la Bastille. Public parking is available nearby."
        ],
        facilities: {
            wifi: "Free Wifi",
            pool: "Pool",
            gym: "Gym",
            reception: "24/7 reception",
            concierge: "Concierge",
            restaurant: "Restaurant",
            parking: "Free Parking",
            shoe: "Show-Shine",
            tv: "Satellite TV",
            roomservice: "Room Service"
        },
        rooms: [
                {
                    roomName: "Basic 2 Bed",
                    roomOccupancy: "2",
                    roomPrice: "€88.99",
                    roomQuantity: "5"
                },
                {
                    roomName: "Basic Family Room",
                    roomOccupancy: "4",
                    roomPrice: "€98.99",
                    roomQuantity: "5"
                },
                {
                    roomName: "Deluxe 2 Bed",
                    roomOccupancy: "2",
                    roomPrice: "€109.99",
                    roomQuantity: "5"
                },
                {
                    roomName: "Deluxe Family Room",
                    roomOccupancy: "7",
                    roomPrice: "€112.99",
                    roomQuantity: "5"
                },
                {
                    roomName: "Bridal Suite",
                    roomOccupancy: "2",
                    roomPrice: "€167.99",
                    roomQuantity: "5"
                },
                {
                    roomName: "President Suite",
                    roomOccupancy: "2",
                    roomPrice: "€301.99",
                    roomQuantity: "5"
                },
                {
                    roomName: "One+One",
                    roomOccupancy: "2",
                    roomPrice: "€78.99",
                    roomQuantity: "5"
                },
                {
                    roomName: "Single Room",
                    roomOccupancy: "1",
                    roomPrice: "€28.99",
                    roomQuantity: "5"
                },
                {
                    roomName: "Queen Room",
                    roomOccupancy: "2",
                    roomPrice: "€99.99",
                    roomQuantity: "5"
                },
                {
                    roomName: "Basement 1 Bed",
                    roomOccupancy: "2",
                    roomPrice: "€9.99",
                    roomQuantity: "5"
                },
                {
                    roomName: "Mega XL Suite",
                    roomOccupancy: "9",
                    roomPrice: "€412.99",
                    roomQuantity: "5"
                }
        ],
        review: [
            {
                reviewScore: "5",
                reviewContent: "Pellentesque ligula nibh, lacinia eget pharetra ut, vulputate vitae odio. Donec non mattis nisi. Pellentesque elit leo, tincidunt nec felis vitae, aliquet imperdiet purus. In elit ante, vestibulum non accumsan at, volutpat eget dolor. Quisque ut tincidunt elit. Curabitur rutrum dignissim enim ac aliquet. Curabitur et aliquam nisl.",
                cite: "Malcolm Reynolds"
            },
            {
                reviewScore: "8",
                reviewContent: "Duis ac nisi id lorem rhoncus tempus eu sit amet nisi. Aenean ultrices congue ligula, ac molestie velit ultricies a. Nulla ac nunc et nisi placerat interdum sit amet ut erat. Integer vulputate nulla id orci cursus, eget ullamcorper justo ultricies. Nulla lorem dui, euismod non porttitor eu, sagittis in lacus. In suscipit lectus non viverra luctus. Pellentesque egestas, dolor at luctus eleifend, velit dui viverra risus, ac rutrum sapien ante at massa. Donec imperdiet consequat laoreet.",
                cite: "Zoe Washburne"
            },
            {
                reviewScore: "3",
                reviewContent: "Etiam posuere, magna sit amet ullamcorper auctor, odio urna tempor velit, sit amet tincidunt lorem diam a velit. Integer a dapibus nunc. In iaculis vel sem ut gravida.",
                cite: "Hoban Washburne"
            },
            {
                reviewScore: "10",
                reviewContent: "Etiam condimentum sodales dui in vestibulum. Vivamus euismod egestas porttitor. Proin dictum tempor euismod. Suspendisse elit nulla, elementum eu ornare in, tempus in massa. Proin elit sem, posuere nec tempor eget, suscipit sit amet dui. Aliquam in vehicula lorem. Praesent vitae vestibulum ante, nec vestibulum metus. Morbi commodo diam in leo semper ornare. Phasellus et diam magna.",
                cite: "Inara Serra"
            },
            {
                reviewScore: "9",
                reviewContent: "Maecenas cursus ut erat vitae vestibulum. Fusce feugiat dignissim augue consequat condimentum. Donec risus felis, ultricies a velit sed, varius ullamcorper enim. Suspendisse ultrices non tortor non lobortis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                cite: "Jayne Cobb"
            },
            {
                reviewScore: "4",
                reviewContent: "Donec adipiscing lacus sed neque cursus ullamcorper. Vestibulum tellus lectus, molestie vitae augue et, egestas convallis mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec porttitor mi vitae mauris aliquam, non accumsan odio tincidunt. Aliquam semper enim quam, ac cursus lectus dignissim vitae. Suspendisse nec rutrum ligula.",
                cite: "Kaylee Frye"
            },
            {
                reviewScore: "7",
                reviewContent: "Nullam et leo placerat lectus fringilla varius vel a lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nibh eros, blandit at aliquam eu, ullamcorper eu diam. Etiam id viverra lacus, rutrum suscipit nulla. Maecenas adipiscing, mi sit amet iaculis congue, urna massa vestibulum tortor, a tempus nibh tortor id dui.",
                cite: "Simon Tam"
            },
            {
                reviewScore: "2",
                reviewContent: "Maecenas semper, orci eget cursus aliquam, orci tellus sodales urna, nec varius nisi arcu gravida velit. Proin ultrices egestas nunc, eget dapibus erat sollicitudin in. Fusce fermentum dignissim ipsum sollicitudin tincidunt. Aliquam erat volutpat. Suspendisse in ornare ante.",
                cite: "River Tam"
            },
            {
                reviewScore: "10",
                reviewContent: "Nullam purus ante, rhoncus ac malesuada at, bibendum nec urna. Cras lobortis viverra feugiat. Praesent sapien elit, sagittis vel orci sed, congue consequat nulla.",
                cite: "Derrial Book"
            },
            {
                reviewScore: "9",
                reviewContent: "Donec malesuada semper lectus sed sagittis. Sed laoreet consectetur tortor, ac tempus ipsum malesuada non. Aenean dapibus leo sed sapien rhoncus, at dapibus ligula porta. Morbi tincidunt, urna eget ullamcorper aliquam, augue lectus placerat orci, tristique aliquet ipsum nisi id orci. Nulla vulputate lectus justo, eu dapibus lectus sodales ac. Donec volutpat nibh mi. Proin eu justo vitae dolor accumsan ultrices vel non ante.",
                cite: "Sheriff Bourne"
            },
            {
                reviewScore: "3",
                reviewContent: "Sed consectetur, lorem vitae laoreet tempus, neque elit fringilla nisl, nec tempus urna quam eu nulla. Nunc tempor nec magna vel viverra. In dapibus aliquam velit, ut malesuada nibh ornare eget. Suspendisse in risus posuere, hendrerit odio id, tincidunt lacus. Nunc fermentum metus sit amet mauris pellentesque, vitae sollicitudin dui facilisis. Etiam at velit id dolor rhoncus porttitor. Vestibulum quis blandit felis.",
                cite: "Lawrence Dobson"
            },
            {
                reviewScore: "7",
                reviewContent: "Suspendisse in risus posuere, hendrerit odio id, tincidunt lacus. Nunc fermentum metus sit amet mauris pellentesque, vitae sollicitudin dui facilisis. Etiam at velit id dolor rhoncus porttitor. Vestibulum quis blandit felis.",
                cite: "Jubal Early"
            },
            {
                reviewScore: "8",
                reviewContent: "Phasellus venenatis tortor ac lectus dapibus, sit amet pellentesque turpis mollis. Nam laoreet magna non leo facilisis auctor. Fusce neque augue, lobortis eget orci vel, lobortis porta lectus. Fusce venenatis, metus quis accumsan auctor, ipsum lectus volutpat tellus, viverra vulputate risus dolor porta lacus",
                cite: "Fanty and Mingo"
            }
        ]
    }];
    // initialize json call
    init(hotelJSON);
});
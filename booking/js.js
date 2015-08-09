$(document).ready(function(){
    var reviewArr = [],
		reviewId = 0,
		startItem = 0,
		currentIndex = startItem,
		itemsPerPage = 5,
		lastIndex = 0,
		nextIndex = itemsPerPage,
        isDirty = false,
        hotelLrgImgArr = [],
        carouselCounter = 0,
        counter = 0,
        counter2 = 0,
        interval = '',
        carouselToggle = false,
        autoplay = "Start",
        autoplayTxt = " Slideshow",
        reverseArr = [],
        hotelLrgImg = "",
        slideShowTimer = 5000;

	var xmlhttp = new XMLHttpRequest();
	var url = "hotels.txt";

	xmlhttp.onreadystatechange = function(){
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        var myArr = JSON.parse(xmlhttp.responseText);
	        getJson(myArr);
	    }
	}

	xmlhttp.open("GET", url, true);
	xmlhttp.send();

	function getJson(arr) {
	    var reviews = "",
            hotelThumbImg = "",
            hotelName = "",
            hotelStars = "",
            hotelAddress = "",
            hotelDescription = "",
            hotelFacilities = "";
	    for (var i = 0; i < arr.hotel.length; i++) {
	        var hotel = arr.hotel[i],
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
	        

		    /*for (var j = 0; j < hotel.review.length; j++) {
		        reviews += "<li class='one_review'><strong class='review_score'>"
                    + hotel.review[j].reviewScore + "</strong>"
                    + "<blockquote class='review_content'>"
                    + hotel.review[j].reviewContent + "<cite>"
                    + hotel.review[j].cite + "</cite" + "</blockquote></li>";
		    }*/
		    
	    }
        /*** DOM interaction ***/
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
        // add reviews
	    $(".reviews_list").html(reviews);
	    
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

	//$(".test").click(function () {
	//    $(this).hide();
	//});

	//if(isDirty == false){
	//	getListItems();
	//	setPagination(startItem);
	//	isDirty = true;
	//}



	//function Review(){
	//	this.reviewId = reviewId;
	//	this.reviewScore = 0;
	//	this.reviewContent = 0;
	//}

	//function getListItems(){
	//	$('.reviews_list li').each(function(index, value){
	//		var $score = $(this).children(".review_score").html(),
	//			$content = $(this).children(".review_content").html();
	//		var review = {
	//			reviewId: reviewId++,
	//			reviewScore: $score,
	//			reviewContent: $content
	//		}
	//		reviewArr.push($(this));
	//	});
	//	console.log(reviewArr);
	//}

	//function sortReviewScore(a,b){
	//	var score1 = a.context.firstElementChild.innerText,
	//		score2 = b.context.firstElementChild.innerText;
	//	return score1 - score2;
	//}

	//function setPagination(startItem){
	//	startItem = (startItem === 0) ? 0 : startItem;
	//	for(var i = startItem; i < itemsPerPage + startItem; i++){
	//		var $listItem = $('.reviews_list li').get(i);
	//		$($listItem).addClass("show-review");
	//	}
	//	currentIndex = startItem;
	//	nextIndex = currentIndex + itemsPerPage;
	//	lastIndex = (currentIndex - itemsPerPage < 0) ? 0 : (currentIndex - itemsPerPage);
	//}

	//$("#back-btn").click(function(){
	//	clearReviews();
	//	if(!(lastIndex < 0))
	//		setPagination(lastIndex);
	//});
	//$("#next-btn").click(function(){
	//	clearReviews();
	//	if(nextIndex > reviews.totalCount.length)
	//		nextIndex = nextIndex - itemsPerPage;
	//	setPagination(nextIndex);
	//});
	//$("#sort-btn").click(function(){
	//	reviewArr.sort(sortReviewScore);
	//	setPagination(0);
	//});
	

	//function clearReviews(){
	//	$(".reviews_list li").each(function(i){
	//		$(this).removeClass("show-review");
	//	});
	//};

	//function addReview(item){
	//	$('.reviews_list li').each(function(index, value){
			
	
	//		reviewArr.push($(this));
	//	});
	//	var add = $("#review_list").add("li").add("blockquote .review_content").html(item.context.firstElementChild.innerText);

	//};
});


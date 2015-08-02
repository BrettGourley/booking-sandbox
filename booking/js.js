$(document).ready(function(){
	var reviewArr = [],
		reviewId = 0,	
		startItem = 0, 
		currentIndex = startItem, 
		itemsPerPage = 5, 
		lastIndex = 0; 
		nextIndex = itemsPerPage;
		isDirty = false;

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
		var out = "";
		for (var i = 0; i < arr.review.length; i++) {
		    //console.log("score is: " + arr[i].score);
		    out += "<li class='one_review'><strong class='review_score'>" + arr.review[i].score + "</strong>" +
			"<blockquote class='review_content'>" + arr.review[i].content + "<cite>" +
			arr.review[i].cite + "</cite" + "</blockquote></li>";
		}
		//<ul class="reviews_list">
		//$("#review_list").append(out);
		document.getElementById('reviews_list').innerHTML = out;
	}

	if(isDirty == false){
		getListItems();
		setPagination(startItem);
		isDirty = true;
	}



	function Review(){
		this.reviewId = reviewId;
		this.reviewScore = 0;
		this.reviewContent = 0;
	}

	function getListItems(){
		$('.reviews_list li').each(function(index, value){
			var $score = $(this).children(".review_score").html(),
				$content = $(this).children(".review_content").html();
			var review = {
				reviewId: reviewId++,
				reviewScore: $score,
				reviewContent: $content
			}
			reviewArr.push($(this));
		});
		console.log(reviewArr);
	}

	function sortReviewScore(a,b){
		var score1 = a.context.firstElementChild.innerText,
			score2 = b.context.firstElementChild.innerText;
		return score1 - score2;
	}

	function setPagination(startItem){
		startItem = (startItem === 0) ? 0 : startItem;
		for(var i = startItem; i < itemsPerPage + startItem; i++){
			var $listItem = $('.reviews_list li').get(i);
			$($listItem).addClass("show-review");
		}
		currentIndex = startItem;
		nextIndex = currentIndex + itemsPerPage;
		lastIndex = (currentIndex - itemsPerPage < 0) ? 0 : (currentIndex - itemsPerPage);
	}

	$("#back-btn").click(function(){
		clearReviews();
		if(!(lastIndex < 0))
			setPagination(lastIndex);
	});
	$("#next-btn").click(function(){
		clearReviews();
		if(nextIndex > reviews.totalCount.length)
			nextIndex = nextIndex - itemsPerPage;
		setPagination(nextIndex);
	});
	$("#sort-btn").click(function(){
		reviewArr.sort(sortReviewScore);
		setPagination(0);
	});
	

	function clearReviews(){
		$(".reviews_list li").each(function(i){
			$(this).removeClass("show-review");
		});
	};

	function addReview(item){
		$('.reviews_list li').each(function(index, value){
			
	
			reviewArr.push($(this));
		});
		var add = $("#review_list").add("li").add("blockquote .review_content").html(item.context.firstElementChild.innerText);

	};
});

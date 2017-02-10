var baseUrl = "https://mockapi-unadjzzymg.now.sh"; 
var questions;
var userInfo;

var quizInfo = {
	whichQuestion : 0,
	passScore: 70
}

var questionsAjax = {
	url: baseUrl + '/questions?_limit=15',
	method: 'GET'
};
var userAjax = {
	url: baseUrl + '/users',
	method: 'GET'
};

$.when( $.ajax( userAjax ), $.ajax( questionsAjax ) )
.done(function(u, q){
	questions = q[0];
	userInfo = u[0][0];
	init();
})
.fail(function(err){
	console.log(err);
	console.log('Seems we have a ' + err.status + ' on one or more ajax requests');
});

function init(){
	correctAnswers = 0;
	quizInfo.whichQuestion = 0;
	$('#userName').text(userInfo.userName);
	displayQuestion();
	displayAnswers();
	updateScore();
	$('#finalAnswer').show();
	$('#questionTitle').html('Question');
	$('#messageArea').html('');
	selected();
}


function displayQuestion(){
	$('#questionDisplay').html(questions[quizInfo.whichQuestion].question);
}

function displayAnswers(){
	var answersString = '';
	for (var i = 0; i < questions[quizInfo.whichQuestion].possibleAnswers.length; i++) {	
	answersString += '<label class="col-xs-6">';
	answersString += '<input type="radio" name="answers" value="' + questions[quizInfo.whichQuestion].possibleAnswers[i] + '" />';
	answersString += '<span class="option">' + questions[quizInfo.whichQuestion].possibleAnswers[i] + '</span>';
	answersString += '</label>';
	}
	$('#possibleAnswersDisplay').html(answersString);
}
var correctAnswers = 0;
var playerScore;
function updateScore(){
	playerScore = (correctAnswers / questions.length) * 100;
	$('#userScore').html('<strong>' + Math.round(playerScore) + '%</strong>');
}

$('#finalAnswer').on('click', nextQuestion);

function nextQuestion(e){
 	e.preventDefault();

 	if($("input[type=radio]:checked").val() == questions[quizInfo.whichQuestion].correctAnswer){
 		transition();
 		quizInfo.whichQuestion++;
 		correctAnswers++;
		updateScore();
		$('#messageArea').html('');
		isNextQuestion();
 	}else{
 		alert('Sorry. Wrong Answer.')
 		transition();
 		quizInfo.whichQuestion++;
 		isNextQuestion();
		$('#finalAnswer').text('Final Answer');
 	}
}

function selected(){
	$('.option').click(function(){
    $('.highlight').removeClass('highlight');
	$(this).addClass('highlight');

	});
}

function transition(){
	$('#questionBlock').animate({
		height: "toggle"}, 200)
	$('#questionDisplay').hide();
	$('#possibleAnswersDisplay').hide();
	$('#questionBlock').animate({
		height: "toggle"}, 200)
	$('#questionDisplay').delay(500).show(800);
	$('#possibleAnswersDisplay').delay(150).show(800);
}

function isNextQuestion(){

	if(quizInfo.whichQuestion < questions.length){
	 	displayQuestion();
	 	displayAnswers();
	 	selected();
	 	
	}else{
		$('#questionDisplay').html('');
		$('#finalAnswer').hide();
		$('#questionTitle').html('Complete!');
		$('#possibleAnswersDisplay').html('<a href="#" id="score" class="btn btn-block btn-primary">Rank My Score</a><br/>'
			+'<a href="#" id="finish" class="btn btn-block btn-primary">Reset</a>')
		$('#score').one('click', rewardLogic);
		$('#finish').one('click', init);
	}
}

function rewardLogic(e){
	e.preventDefault();
	if(playerScore >= 90){
			$('#messageArea').html('<br/><h1>Gold Medal! Congrats.</h1>');
	}else if(playerScore >= 70){
			$('#messageArea').html('<br/><h2>Silver Medal! Nice Job.</h2>');
	}else if(playerScore >= 50){
			$('#messageArea').html('<br/><h3>Bronze Medal. You Pass.</h2>');
	}else{
			$('#messageArea').html('<br/><h4>You Fail.</h2>');
	}
}



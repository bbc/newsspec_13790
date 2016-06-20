define(['jquery', 'vocab'], function ($, vocab){

    var quizData =
        {
        'question1' : {
            'score'             : '',
            'result_noun'       : vocab.question_1_result_noun,
            'result_priority'   : '1'
        },
        'question2' : {
            'score'             : '',
            'result_noun'       : vocab.question_2_result_noun,
            'result_priority'   : '1'
        },
        'question3' : {
            'score'             : '',
            'result_noun'       : vocab.question_3_result_noun,
            'result_priority'   : '1'
        },
        'question4' : {
            'score'             : '',
            'result_noun'       : vocab.question_4_result_noun,
            'result_priority'   : '0'
        },
        'question5' : {
            'score'             : '',
            'result_noun'       : vocab.question_5_result_noun,
            'result_priority'   : '0'
        },
        'question6' : {
            'score'             : '',
            'result_noun'       : vocab.question_6_result_noun,
            'result_priority'   : '0'
        },
        'question7' : {
            'score'             : '',
            'result_noun'       : vocab.question_7_result_noun,
            'result_priority'   : '0'
        },
        'question8' : {
            'score'             : '',
            'result_noun'       : vocab.question_8_result_noun,
            'result_priority'   : '0'
        },
        'question9' : {
            'score'             : '',
            'result_noun'       : vocab.question_9_result_noun,
            'result_priority'   : '0'
        },
        'question10' : {
            'score'             : '',
            'result_noun'       : vocab.question_10_result_noun,
            'result_priority'   : '0'
        },
        'question11' : {
            'score'             : '',
            'result_noun'       : vocab.question_11_result_noun,
            'result_priority'   : '0'
        },
        'question12' : {
            'score'             : '',
            'result_noun'       : vocab.question_12_result_noun,
            'result_priority'   : '0'
        },
        'question13' : {
            'score'             : '',
            'result_noun'       : 'age', //not visible to user
            'result_priority'   : '0'
        },
        'question14' : {
            'score'             : '',
            'result_noun'       : 'fitness', // not visible to user
            'result_priority'   : '0'
        }
    };

    var Model = function (){
        this.init();
    };

    Model.prototype = {
        init: function(){
            this.age = 0;
            this.activityLevel = 0;
            this.scoresArray = [];
        },
        getQuizDataLength: function(){
            var length = Object.keys(quizData).length;
            return length;
        },
        convertObjectToArray: function (obj){
            var arr = Object.keys(obj).map(function (key) {
                return obj[key];
            });
            return arr;
        },
        setScore: function (questionNumber, scoreValue){
            quizData[questionNumber].score = scoreValue;
        },
        getScoresArray: function() {
            return this.scoresArray;
        },
        getAge: function() {
            return parseInt(this.age, 10);
        },
        setAge: function(age) {
            this.age = parseInt(age, 10);
        },
        setActivityLevel: function(activityLevel) {
            this.activityLevel = activityLevel;
        },
        userIsNotVeryActive: function () {
            if (this.activityLevel === '3'){
                return true;
            }
            return false;
        },
        userIsUnder18: function () {
            if (this.age === '1'){
                return true;
            }
            return false;
        },
        allScoresAreTheSame: function(){
            this.scoresArray.splice(-2, 2); // last 2 questions always score zero, so remove them from list
            var first = this.scoresArray[0];
            return this.scoresArray.every(function(element) {
                return element === first;
            });
        },
        calculateTotal: function(){
            var total = 0;
            this.scoresArray = [];
            for (var key in quizData) {
                if (quizData.hasOwnProperty(key)) {
                    for (var val in quizData[key]) {
                        if (quizData[key].hasOwnProperty(val)) {
                            if (val === 'score'){
                                total += parseInt(quizData[key][val], 10);
                                this.scoresArray.push( parseInt(quizData[key][val], 10));
                            }
                        }
                    }
                }
            }

            return total;
        },
        calculateCategory: function (total){
            var category = { 'title': '', 'text' : ''};

            var cat1_total = parseInt(vocab.results_category_1_total, 10),
                cat2_total = parseInt(vocab.results_category_2_total, 10),
                cat3_total = parseInt(vocab.results_category_3_total, 10),
                cat4_total = parseInt(vocab.results_category_4_total, 10),
                cat5_total = parseInt(vocab.results_category_5_total, 10);

            if (total <= cat5_total) {

                category.title = vocab.results_category_5;
                category.text  = vocab.results_category_5_text;

            } else if (total > cat5_total && total <= cat4_total) {

                category.title = vocab.results_category_4;
                category.text  = vocab.results_category_4_text;

            } else if (total > cat4_total && total <= cat3_total) {

                category.title = vocab.results_category_3;
                category.text  = vocab.results_category_3_text;

            } else if (total > cat3_total && total <= cat2_total) {

                category.title = vocab.results_category_2;
                category.text  = vocab.results_category_2_text;

            } else if (total >= cat1_total) {

                category.title = vocab.results_category_1;
                category.text  = vocab.results_category_1_text;

            } else {

                category.title = vocab.results_category_1;
                category.text  = vocab.results_category_1_text;
            }


            if (this.amendKidsResult(category, vocab) === true){
                category.title = vocab.results_category_4;
                category.text  = vocab.results_category_4_text;
            }

            return category;
        },
        amendKidsResult: function (category, vocab){
            if ( this.age < 17 && category.title === vocab.results_category_5 ) {
                return true;
            }
            return false;
        },
        calculateStrengths: function (){
            var strengths = this.convertObjectToArray(quizData);
            strengths.splice(-2, 2); // last 2 questions score differently, so we remove them

            strengths.sort(function(a, b) {
                // Sort by score (highest scores first)
                var currentItem = parseInt(b.score, 10) - parseInt(a.score, 10);
                if(currentItem) { return currentItem; }
                // If there is a tie, sort by result_priority (highest numbr is highest priority)
                var priority = parseInt(b.result_priority, 10) - parseInt(a.result_priority, 10);
                return priority;
            }).splice(3, 14);

            return [
                strengths[0].result_noun,
                strengths[1].result_noun,
                strengths[2].result_noun
            ];
        },
        calculateWeaknesses: function (){
            var weaknesses = this.convertObjectToArray(quizData);
            weaknesses.splice(-2, 2);

            //remove the strengths, they can't also be weaknesses
            weaknesses.sort(function(a, b) {
                var currentItem = parseInt(b.score, 10) - parseInt(a.score, 10);
                if(currentItem) { return currentItem; }
                var priority = parseInt(b.result_priority, 10) - parseInt(a.result_priority, 10);
                return priority;
            }).splice(0, 3);

            weaknesses.sort(function(a, b) {
                // Sort by score (lowest scores first)
                var currentItem = parseInt(a.score, 10) - parseInt(b.score, 10);
                if(currentItem) { return currentItem; }
                // If there is a tie, sort by result priority (highest numbr is highest priority)
                var priority = parseInt(b.result_priority, 10) - parseInt(a.result_priority, 10);
                return priority;
            }).splice(3, 14);

            return [
                weaknesses[0].result_noun,
                weaknesses[1].result_noun,
                weaknesses[2].result_noun
            ];
        },
        calculateResult: function(){
            var total            = this.calculateTotal(),
                category         = this.calculateCategory(total),
                strengths        = this.calculateStrengths(),
                weaknesses       = this.calculateWeaknesses(),
                activityText     = vocab.activity_1_text,
                activityUrl      = vocab.activity_1_url,
                activityUrlTitle = vocab.activity_1_url_title,
                categoryTitle    = category.title,
                categoryText     = category.text,
                quizResults      = {};

            if (this.userIsNotVeryActive() && this.userIsUnder18() === false){
                activityText     = vocab.activity_2_text;
                activityUrl      = vocab.activity_2_url;
                activityUrlTitle = vocab.activity_2_url_title;
            }

            if (this.allScoresAreTheSame(this.scoresArray)){
                strengths  = '';
                weaknesses = '';
            }

            quizResults = {
                'categoryTitle'   : categoryTitle,
                'categoryText'    : categoryText,
                'total'           : total,
                'age'             : this.age,
                'activityLevel'   : this.activityLevel,
                'activityText'    : activityText,
                'activityUrl'     : activityUrl,
                'activityUrlTitle': activityUrlTitle,
                'strengths'       : strengths,
                'weaknesses'      : weaknesses
            };
            console.log('quizData: ', quizData, 'quizResults', quizResults);
            return quizResults;
        }
    };

    return Model;
});
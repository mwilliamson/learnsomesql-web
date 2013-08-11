var knockout = require("knockout");
var ajax = require("ajax");
var deepEquals = require("equals");
var widgetsKnockout = require("widgets-knockout");
var lessonTemplate = require("./lesson-template.html");
var questionTemplate = require("./question-template.html");
var queryResultsTemplate = require("./query-results.html");

var queryResultsWidget = widgetsKnockout.widget({
    init: function(options) {
        return {
            viewModel: {results: options.queryResults},
            template: queryResultsTemplate
        };
    }
});

var questionWidget = function(queryExecutor) {
    return widgetsKnockout.widget({
        init: function(options) {
            return {
                viewModel: new QuestionViewModel(queryExecutor, options.questions, options.nextLesson),
                template: questionTemplate
            };
        },
        dependencies: {
            "query-results": queryResultsWidget
        }
    });
};

function lessonWidget(queryExecutor) {
    return widgetsKnockout.widget({
        init: function(options) {
            return {
                viewModel: new LessonViewModel(options.lesson, options.nextLesson),
                template: lessonTemplate
            };
        },
        dependencies: {
            "question": questionWidget(queryExecutor)
        }
    });
}

exports.createLessonWidget = lessonWidget;
exports.createQuestionWidget = questionWidget;

function LessonViewModel(lesson, nextLesson) {
    this.title = lesson.title;
    this.description = lesson.description;
    this.questions = lesson.questions;
    this.nextLesson = nextLesson;
}

function QuestionViewModel(queryExecutor, questions, nextLesson) {
    var self = this;
    this.nextLesson = nextLesson;
    var questionIndex = knockout.observable(0);
    
    var question = knockout.computed(function() {
        return questions[questionIndex()];
    });
    this.nextQuestion = function() {
        questionIndex(questionIndex() + 1);
    };
    this.isLastQuestion = knockout.computed(function() {
        return questionIndex() + 1 >= questions.length;
    });
    

    this.description = knockout.computed(function() {
        return knockout.unwrap(question).description;
    });
    this.expectedResults = knockout.computed(function() {
        return knockout.unwrap(question).expectedResults;
    });

    this.submittedQueryResults = knockout.observable();
    
    this.query = knockout.observable("");
    this.showMeTheAnswer = function() {
        self.query(knockout.unwrap(question).correctAnswer);
    };

    this.submitQuery = function() {
        var query = self.query();
        queryExecutor(query, function(results) {
            results.isCorrectAnswer = deepEquals(results.table, self.expectedResults());
            self.submittedQueryResults(results);
        });
    };
}

exports.ajaxQueryExecutor = function(url) {
    return function(query, callback) {
        ajax({
            type: "POST",
            url: url,
            data: {query: query},
            success: callback
        });
    };
};

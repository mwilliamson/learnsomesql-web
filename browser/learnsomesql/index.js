var knockout = require("knockout");
var widgetsKnockout = require("widgets-knockout");
var lessonTemplate = require("./lesson-template.html");
var questionTemplate = require("./question-template.html");
var queryResultsTemplate = require("./query-results.html");

var queryResultsWidget = widgetsKnockout.widget({
    init: function(options) {
        return {
            viewModel: options.queryResults,
            template: queryResultsTemplate
        };
    }
});

var questionWidget = widgetsKnockout.widget({
    init: function(options) {
        return {
            viewModel: new QuestionViewModel(options.question),
            template: questionTemplate
        };
    },
    dependencies: {
        "query-results": queryResultsWidget
    }
});

exports.renderLesson = widgetsKnockout.widget({
    init: function(options) {
        return {
            viewModel: new LessonViewModel(options.lesson),
            template: lessonTemplate
        };
    },
    dependencies: {
        "question": questionWidget
    }
});

function LessonViewModel(lesson) {
    this.title = lesson.title;
    this.description = lesson.description;
    this.question = knockout.observable(lesson.questions[0]);
}

function QuestionViewModel(question) {
    var self = this;
    
    this.description = knockout.computed(function() {
        return knockout.unwrap(question).description;
    });
    this.expectedResults = knockout.computed(function() {
        return knockout.unwrap(question).expectedResults;
    });
    
    this.query = knockout.observable("");
    this.showMeTheAnswer = function() {
        self.query(knockout.unwrap(question).correctAnswer);
    };
}

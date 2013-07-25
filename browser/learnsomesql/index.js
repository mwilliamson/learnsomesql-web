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

var questionWidget = function(queryExecutor) {
    return widgetsKnockout.widget({
        init: function(options) {
            return {
                viewModel: new QuestionViewModel(queryExecutor, options.question),
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
                viewModel: new LessonViewModel(options.lesson),
                template: lessonTemplate
            };
        },
        dependencies: {
            "question": questionWidget(queryExecutor)
        }
    });
}

exports.createLessonWidget = lessonWidget;

function LessonViewModel(lesson) {
    this.title = lesson.title;
    this.description = lesson.description;
    this.question = knockout.observable(lesson.questions[0]);
}

function QuestionViewModel(queryExecutor, question) {
    var self = this;

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
            self.submittedQueryResults(results);
        });
    };
}

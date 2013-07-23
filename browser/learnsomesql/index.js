var knockout = require("knockout");
var widgetsKnockout = require("widgets-knockout");
var lessonTemplate = require("./lesson-template.html");
var questionTemplate = require("./question-template.html");

var questionWidget = widgetsKnockout.widget({
    init: function(options) {
        return {
            viewModel: new QuestionViewModel(options.question),
            template: questionTemplate
        };
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
    this.description = knockout.computed(function() {
        return question().description;
    });
}

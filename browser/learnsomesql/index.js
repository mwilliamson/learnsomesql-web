var knockout = require("knockout");
var lessonTemplate = require("./lesson-template.html");


exports.renderLesson = function(options) {
    var element = options.element;
    var lesson = options.lesson;
    
    var viewModel = new LessonViewModel(lesson);
    
    element.innerHTML = lessonTemplate;
    
    knockout.applyBindings(viewModel, element);
};

function LessonViewModel(lesson) {
    this.title = lesson.title;
    this.description = lesson.description;
}

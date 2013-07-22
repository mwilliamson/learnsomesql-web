var knockout = require("knockout");
var lessonTemplate = require("./lesson-template.html");

exports.renderLesson = widget({
    init: function(options) {
        return {
            viewModel: new LessonViewModel(options.lesson),
            template: lessonTemplate
        };
    }
});

function widget(widgetOptions) {
    return function(instanceOptions) {
        var result = widgetOptions.init(instanceOptions);
        var viewModel = result.viewModel;
        var template = result.template;
        
        var element = instanceOptions.element;
        
        element.innerHTML = template;
        
        knockout.applyBindings(viewModel, element);
    };
}


function LessonViewModel(lesson) {
    this.title = lesson.title;
    this.description = lesson.description;
}

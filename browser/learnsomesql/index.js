var knockout = require("knockout");
var lessonTemplate = require("./lesson-template.html");
var questionTemplate = require("./question-template.html");

var questionWidget = widget({
    init: function(options) {
        return {
            viewModel: new QuestionViewModel(options.question),
            template: questionTemplate
        };
    }
});

var widgets = {
    "learnsomesql/question": questionWidget
};

knockout.bindingHandlers.widget = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var options = knockout.unwrap(valueAccessor());
        var name = options.name;
        // TODO: work out how to avoid ugly double-<div>ing
        
        var widgetElement = document.createElement("div"); 
        knockout.virtualElements.prepend(element, widgetElement)
        
        var optionsWithElement = Object.create(options);
        optionsWithElement.element = widgetElement;
        
        widgets[name](optionsWithElement);
        
        return {
            controlsDescendantBindings: true
        };
    }
};

knockout.virtualElements.allowedBindings.widget = true;


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
    this.question = knockout.observable(lesson.questions[0]);
}

function QuestionViewModel(question) {
    this.description = knockout.computed(function() {
        return question().description;
    });
}

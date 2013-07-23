var knockout = require("knockout");

exports.widget = widget;


knockout.bindingHandlers.widget = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var name = knockout.unwrap(valueAccessor());
        var options = knockout.unwrap(allBindingsAccessor().widgetOptions);
        // TODO: work out how to avoid ugly double-<div>ing
        
        var widgetElement = document.createElement("div"); 
        knockout.virtualElements.prepend(element, widgetElement)
        
        var optionsWithElement = Object.create(options);
        optionsWithElement.element = widgetElement;
        
        viewModel.__widgets[name](optionsWithElement);
        
        return {
            controlsDescendantBindings: true
        };
    }
};

knockout.virtualElements.allowedBindings.widget = true;

function widget(widgetOptions) {
    return function(instanceOptions) {
        var result = widgetOptions.init(instanceOptions);
        var viewModel = result.viewModel;
        viewModel.__widgets = widgetOptions.dependencies;
        var template = result.template;
        
        var element = instanceOptions.element;
        element.innerHTML = template;
        knockout.applyBindings(viewModel, element);
    };
}


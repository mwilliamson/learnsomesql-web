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
        
        var widgets = findWidgets(bindingContext);

        widgets[name](optionsWithElement);
        
        return {
            controlsDescendantBindings: true
        };
    }
};

function findWidgets(bindingContext) {
    if (bindingContext.$data.__widgets) {
        return bindingContext.$data.__widgets;
    }
    for (var i = 0; i < bindingContext.$parents.length; i++) {
        if (bindingContext.$parents[i].__widgets) {
            return bindingContext.$parents[i].__widgets;
        }
    }
    return {};
}

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


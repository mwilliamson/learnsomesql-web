var knockout = require("knockout");

exports.widget = widget;


knockout.bindingHandlers.widget = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var name = knockout.unwrap(valueAccessor());
        var options = knockout.unwrap(allBindingsAccessor().widgetOptions);
        
        var optionsWithElement = Object.create(options);
        optionsWithElement.element = element;
        
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

        var temporaryElement = document.createElement("div");
        temporaryElement.innerHTML = template;
        var nodes = Array.prototype.slice.call(temporaryElement.childNodes, 0);
        knockout.virtualElements.setDomNodeChildren(element, nodes);

        knockout.applyBindingsToDescendants(viewModel, element);
    };
}


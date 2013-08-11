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

knockout.bindingHandlers.__widgetBind = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var widgets = knockout.utils.domData.get(element, "__widgets");
        var innerBindingContext = bindingContext.extend({__widgets: widgets});
        knockout.applyBindingsToDescendants(innerBindingContext, element);
        return { controlsDescendantBindings: true };
    }
}

function findWidgets(bindingContext) {
    while (bindingContext) {
        if ("__widgets" in bindingContext) {
            return bindingContext.__widgets;
        }
        bindingContext = bindingContext.$parentContext;
    }
    throw new Error("Could not find widgets");
}

knockout.virtualElements.allowedBindings.widget = true;
knockout.virtualElements.allowedBindings.__widgetBind = true;

function widget(widgetOptions) {
    return function(instanceOptions) {
        var result = widgetOptions.init(instanceOptions);
        var template = "<!-- ko __widgetBind: $data -->" + result.template + "<!-- /ko -->";
        
        var element = instanceOptions.element;

        var temporaryElement = document.createElement("div");
        temporaryElement.innerHTML = template;
        var nodes = Array.prototype.slice.call(temporaryElement.childNodes, 0);
        knockout.virtualElements.setDomNodeChildren(element, nodes);

        knockout.utils.domData.set(knockout.virtualElements.firstChild(element), "__widgets", widgetOptions.dependencies);

        knockout.applyBindingsToDescendants(result.viewModel, element);
    };
}


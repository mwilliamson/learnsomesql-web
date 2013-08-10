(function() {
    var widgetsKnockout = require("widgets-knockout");

    test("knockout widget renders template with view model", function() {
        var applicationElement = createEmptyDiv();
        var widget = widgetsKnockout.widget({
            init: function(options) {
                return {
                    viewModel: {name: options.name},
                    template: 'Hello <span data-bind="text: name"></span>'
                }
            }
        });

        var element = createEmptyDiv();
        widget({element: element, name: "Bob"});
        strictEqual(element.innerHTML, 'Hello <span data-bind="text: name">Bob</span>');
    });

    test("dependencies of widget are renderable using widget binding", function() {
        var applicationElement = createEmptyDiv();

        var shoutingWidget = function(options) {
            options.element.innerHTML = options.name.toUpperCase();
        };

        var widget = widgetsKnockout.widget({
            init: function(options) {
                return {
                    viewModel: {name: options.name},
                    template: 'Hello <span data-bind="widget: \'shout\', widgetOptions: {name: name}"></span>'
                };
            },
            dependencies: {
                shout: shoutingWidget
            }
        });

        var element = createEmptyDiv();
        widget({element: element, name: "Bob"});
        strictEqual(element.innerHTML, 'Hello <span data-bind="widget: \'shout\', widgetOptions: {name: name}">BOB</span>');
    });


    test("dependencies of widget are renderable using widget binding within child binding context", function() {
        var applicationElement = createEmptyDiv();

        var shoutingWidget = function(options) {
            options.element.innerHTML = options.name.toUpperCase();
        };

        var widget = widgetsKnockout.widget({
            init: function(options) {
                return {
                    viewModel: {firstName: options.name},
                    template: '<span data-bind="with: {name: firstName}">Hello <span data-bind="widget: \'shout\', widgetOptions: {name: name}"></span></span>'
                };
            },
            dependencies: {
                shout: shoutingWidget
            }
        });

        var element = createEmptyDiv();
        widget({element: element, name: "Bob"});
        strictEqual(element.textContent, 'Hello BOB');
    });


    test("example", function() {
        var applicationElement = createEmptyDiv();

        var shoutingWidget = widgetsKnockout.widget({
            init: function(options) {
                var message = "message" in options ? options.message : element.textContent;
                var contents = message.toUpperCase();
                return {
                    viewModel: {contents: contents},
                    template: '<strong data-bind="text: contents"></strong>'
                }
            },
            replaceElement: true
        });

        var emphaticGreeterWidget = widgetsKnockout.widget({
            init: function(options) {
                var name = "name" in options ? options.name : element.textContent;
            
                return {
                    viewModel: {name: options.element.textContent},
                    template: 'Hello <span data-bind="widget: \'shout\', widgetOptions: {message: name}"></span>!'
                }
            },
            dependencies: {
                shout: shoutingWidget
            }
        });

        var element = createEmptyDiv();
        element.textContent = "Bob";
        emphaticGreeterWidget({element: element});
        strictEqual(element.innerHTML, 'Hello <strong>BOB</strong>!');
    });

    function createEmptyDiv() {
        var div = document.createElement("div");
        var fixture = document.getElementById("qunit-fixture");
        fixture.appendChild(div);
        return div;
    }

})();

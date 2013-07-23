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

    function createEmptyDiv() {
        var div = document.createElement("div");
        var fixture = document.getElementById("qunit-fixture");
        fixture.appendChild(div);
        return div;
    }

})();

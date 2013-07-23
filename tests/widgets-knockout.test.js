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
        strictEqual(element.textContent, 'Hello Bob');
    });



    function createEmptyDiv() {
        var div = document.createElement("div");
        var fixture = document.getElementById("qunit-fixture");
        fixture.appendChild(div);
        return div;
    }

})();

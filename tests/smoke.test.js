(function() {
    var learnsomesql = require("learnsomesql");

    var sampleLesson = {
        title: "Simple SELECTS",
        description: "<p>SELECTs are the simplest and most commonly used SQL statement.</p>"
    };

    test("rendering lesson adds title and description to element", function() {
        var applicationElement = createEmptyDiv();
        learnsomesql.renderLesson({
            lesson: sampleLesson,
            element: applicationElement
        });
        
        var lessonTitleElement = applicationElement.querySelector("h2");
        strictEqual(lessonTitleElement.textContent, "Simple SELECTS");
        
        var descriptionElement = applicationElement.querySelector("p.lesson-description");
        strictEqual(descriptionElement.textContent, "SELECTs are the simplest and most commonly used SQL statement.");
    });



    function createEmptyDiv() {
        var div = document.createElement("div");
        var fixture = document.getElementById("qunit-fixture");
        fixture.appendChild(div);
        return div;
    }

})();

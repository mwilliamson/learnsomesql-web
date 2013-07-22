(function() {
    var learnsomesql = require("learnsomesql");

    var sampleLesson = {
        title: "Simple SELECTS",
        description: "<p>SELECTs are the simplest and most commonly used SQL statement.</p>",
        questions: [
            {
                description: "<p>Get the model of every car in the <code>cars</code> table.</p>"
            },
            {
                description: "<p>Use a single <code>SELECT</code> to get the license plate and color of every car in the <code>cars</code> table.</p>"
            }
        ]
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
    
    test("first question is rendered by default", function() {
        var applicationElement = createEmptyDiv();
        learnsomesql.renderLesson({
            lesson: sampleLesson,
            element: applicationElement
        });
        
        var questionDescriptionElement = applicationElement.querySelector("p.question-description");
        strictEqual(questionDescriptionElement.textContent, "Get the model of every car in the cars table.");
    });



    function createEmptyDiv() {
        var div = document.createElement("div");
        var fixture = document.getElementById("qunit-fixture");
        fixture.appendChild(div);
        return div;
    }

})();

(function() {
    var learnsomesql = require("learnsomesql");

    var sampleLesson = {
        title: "Simple SELECTS",
        description: "<p>SELECTs are the simplest and most commonly used SQL statement.</p>",
        questions: [
            {
                description: "<p>Get the model of every car in the <code>cars</code> table.</p>",
                correctAnswer: "SELECT model FROM cars",
                expectedResults: {
                    columnNames: ["model"],
                    rows: [["Fabia"], ["Fox"]]
                }
            },
            {
                description: "<p>Use a single <code>SELECT</code> to get the license plate and color of every car in the <code>cars</code> table.</p>"
            }
        ]
    };

    test("rendering lesson adds title and description to element", function() {
        var applicationElement = renderSampleQuestion();
        
        var lessonTitleElement = applicationElement.querySelector("h2");
        strictEqual(lessonTitleElement.textContent, "Simple SELECTS");
        
        var descriptionElement = applicationElement.querySelector("p.lesson-description");
        strictEqual(descriptionElement.textContent, "SELECTs are the simplest and most commonly used SQL statement.");
    });
    
    test("first question is rendered by default", function() {
        var applicationElement = renderSampleQuestion();
        
        var questionDescriptionElement = applicationElement.querySelector("p.question-description");
        strictEqual(questionDescriptionElement.textContent, "Get the model of every car in the cars table.");
        var expectedResults = readTable(applicationElement.querySelector(".expected-results"));
        deepEqual(expectedResults, [["model"], ["Fabia"], ["Fox"]]);
    });
    
    function readTable(element) {
        return toList(element.querySelectorAll("tr")).map(function(row) {
            return toList(row.querySelectorAll("th, td")).map(function(cell) {
                return cell.textContent;
            });
        });
    }
    
    function toList(listLike) {
        return Array.prototype.slice.call(listLike, 0);
    }
    
    test("query input is initially empty", function() {
        var applicationElement = renderSampleQuestion();
        
        var queryInput = applicationElement.querySelector(".query-input");
        strictEqual(queryInput.value, "");
    });
    
    test("clicking show me the answer insert answer into query input", function() {
        var applicationElement = renderSampleQuestion();
        
        applicationElement.querySelector(".show-me-the-answer").click();
        var queryInput = applicationElement.querySelector(".query-input");
        strictEqual(queryInput.value, "SELECT model FROM cars");
    });

    test("submitting query displays results", function() {
        var queryExecutor = createQueryExecutor({
            "SELECT model FROM cars": {
                query: "SELECT model FROM cars",
                table: {
                    columnNames: ["model"],
                    rows: [["Fabia"], ["Fox"]]
                }
            }
        });
        var applicationElement = renderSampleQuestion(queryExecutor);

        var queryInput = applicationElement.querySelector(".query-input");
        queryInput.value = "SELECT model FROM cars";
        fireEvent(queryInput, "change");        

        applicationElement.querySelector(".submit-query").click();

        var renderedOriginalQuery = applicationElement.querySelector(".result .query").textContent;
        strictEqual(renderedOriginalQuery, "SELECT model FROM cars");

        var resultTable = applicationElement.querySelector(".result table");
        deepEqual(
            readTable(resultTable),
            [["model"], ["Fabia"], ["Fox"]]
        );
    });

    function fireEvent(element, eventName) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(eventName, false, true);
            element.dispatchEvent(evt);
    }

    function renderSampleQuestion(queryExecutor) {
        var applicationElement = createEmptyDiv();
        learnsomesql.createLessonWidget(queryExecutor)({
            lesson: sampleLesson,
            queryExecutor: queryExecutor,
            element: applicationElement
        });
        return applicationElement;
    }

    function createQueryExecutor(results) {
        return function(query, callback) {
            callback(results[query]);
        };
    }

    function createEmptyDiv() {
        var div = document.createElement("div");
        var fixture = document.getElementById("qunit-fixture");
        fixture.appendChild(div);
        return div;
    }

})();

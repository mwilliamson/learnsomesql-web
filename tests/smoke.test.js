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
                description: "<p>Get the color of every car.</p>",
                correctAnswer: "SELECT color FROM cars",
                expectedResults: {
                    columnNames: ["color"],
                    rows: [["Green"], ["Red"]]
                }
            }
        ]
    };

    test("rendering lesson adds title and description to element", function() {
        var application = renderSampleQuestion();
        
        var lesson = application.lesson();
        strictEqual(lesson.title, "Simple SELECTS");
        strictEqual(lesson.description, "SELECTs are the simplest and most commonly used SQL statement.");
    });
    
    test("first question is rendered by default", function() {
        var application = renderSampleQuestion();
        
        strictEqual(application.questionDescription(), "Get the model of every car in the cars table.");
        deepEqual(application.expectedResults(), [["model"], ["Fabia"], ["Fox"]]);
    });
    
    test("query input is initially empty", function() {
        var application = renderSampleQuestion();
        
        strictEqual(application.currentQuery(), "");
    });
    
    test("clicking show me the answer insert answer into query input", function() {
        var application = renderSampleQuestion();
        
        application.showMeTheAnswer();
        strictEqual(application.currentQuery(), "SELECT model FROM cars");
    });

    test("submitting query displays results", function() {
        var application = renderSampleQuestion();
        application.submitQuery("SELECT model FROM cars");

        strictEqual(application.executedQuery(), "SELECT model FROM cars");

        deepEqual(
            application.resultTable(),
            [["model"], ["Fabia"], ["Fox"]]
        );
    });

    test("can go to next question if answer is correct", function() {
        var application = renderSampleQuestion();
        application.submitQuery("SELECT model FROM cars");

        application.clickNextQuestion();
        strictEqual(application.questionDescription(), "Get the color of every car.");
    });

    test("cannot go to next question if on last question", function() {
        var application = renderSampleQuestion();
        application.submitQuery("SELECT model FROM cars");
        application.clickNextQuestion();
        application.submitQuery("SELECT color FROM cars");
        strictEqual(application.findNextQuestionButton(), null);
    });

    test("cannot go to next question if answer is incorrect", function() {
        var application = renderSampleQuestion();
        application.submitQuery("SELECT 1 as model");

        strictEqual(application.findNextQuestionButton(), null);
        strictEqual("Wrong answer. Have another a go.", application.resultMessage());
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

    function fireEvent(element, eventName) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(eventName, false, true);
        element.dispatchEvent(evt);
    }

    function renderSampleQuestion() {
        var queryExecutor = createQueryExecutor({
            "SELECT 1 as model": {
                query: "SELECT model FROM cars",
                table: {
                    columnNames: ["model"],
                    rows: [["1"]]
                }
            },
            "SELECT model FROM cars": {
                query: "SELECT model FROM cars",
                table: {
                    columnNames: ["model"],
                    rows: [["Fabia"], ["Fox"]]
                }
            },
            "SELECT color FROM cars": {
                query: "SELECT color FROM cars",
                table: {
                    columnNames: ["color"],
                    rows: [["Green"], ["Red"]]
                }
            }
        });
        
        var applicationElement = createEmptyDiv();
        learnsomesql.createLessonWidget(queryExecutor)({
            lesson: sampleLesson,
            queryExecutor: queryExecutor,
            element: applicationElement
        });
        return new Application(applicationElement);
    }
    
    function Application(element) {
        this.element = element;
    }
    
    Application.prototype.lesson = function() {
        var title = this.element.querySelector("h2").textContent;
        var description = this.element.querySelector("p.lesson-description").textContent;
        return {title: title, description: description};
    };
    
    Application.prototype.queryInput = function() {
        return this.element.querySelector(".query-input");
    };
    
    Application.prototype.currentQuery = function() {
        return this.queryInput().value;
    };
    
    Application.prototype.submitQuery = function(query) {
        var queryInput = this.queryInput();
        queryInput.value = query;
        fireEvent(queryInput, "change");        

        this.element.querySelector(".submit-query").click();
    };
    
    Application.prototype.clickNextQuestion = function() {
        this.findNextQuestionButton().click();
    };
    
    Application.prototype.findNextQuestionButton = function() {
        return this.element.querySelector(".result .next-question");
    };
    
    Application.prototype.questionDescription = function() {
        return this.element.querySelector("p.question-description").textContent;
    };
    
    Application.prototype.expectedResults = function() {
        return readTable(this.element.querySelector(".expected-results"));
    };
    
    Application.prototype.showMeTheAnswer = function() {
        this.element.querySelector(".show-me-the-answer").click();
    };
    
    Application.prototype.executedQuery = function() {
        return this.element.querySelector(".result .query").textContent;
    };
    
    Application.prototype.resultTable = function() {
        var resultTable = this.element.querySelector(".result table");
        return readTable(resultTable);
    };
    
    Application.prototype.resultMessage = function() {
        return this.element.querySelector(".result p").textContent;
    };

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

document.addEventListener("DOMContentLoaded", () => {
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach(question => {
        question.addEventListener("click", () => {
            const index = question.getAttribute("data-index");
            const answer = document.querySelector(`.faq-answer[data-index='${index}']`);
            
            if (answer.style.display === "block") {
                answer.style.display = "none";
            } else {
                answer.style.display = "block";
            }
        });
    });
});
// for the search button to be active
document.getElementById('search-button').addEventListener('click', function() {
    const searchTerm = document.getElementById('faq-search').value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    let hasResults = false; // Track whether any FAQ items are displayed

    faqItems.forEach(function(item) {
        const questionElement = item.querySelector('.faq-question');
        const answerElement = item.querySelector('.faq-answer');
        const questionText = questionElement.textContent.toLowerCase();
        const answerText = answerElement.textContent.toLowerCase();

        // Clear previous highlights
        questionElement.innerHTML = questionElement.textContent;
        answerElement.innerHTML = answerElement.textContent;

        if (searchTerm && (questionText.includes(searchTerm) || answerText.includes(searchTerm))) {
            // Highlight the keyword in the question and answer
            questionElement.innerHTML = highlightText(questionElement.textContent, searchTerm);
            answerElement.innerHTML = highlightText(answerElement.textContent, searchTerm);
            item.style.display = ''; // Show the item
            hasResults = true; // At least one result is found
        } else {
            item.style.display = 'none'; // Hide the item if it doesn't match
        }
    });

    // Show "No results found" if no results are displayed
    const noResultsMessage = document.getElementById('no-results');
    if (hasResults) {
        noResultsMessage.style.display = 'none'; // Hide the message
    } else {
        noResultsMessage.style.display = 'block'; // Show the message
    }
});

function highlightText(text, searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, 'gi'); // Create a regular expression to match the search term
    return text.replace(regex, '<span class="highlight">$1</span>'); // Wrap matches in a <span> tag with class "highlight"
}




const observerBody = new MutationObserver((mutationsList) => {
    for(const mutation of mutationsList) {
        console.log(mutation);
    }
});

observerBody.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
});

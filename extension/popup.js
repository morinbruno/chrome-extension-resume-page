document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: getDocumentText
        }, async (results) => {
            const resumePage = document.querySelector('#resume-page');
            const { result } = results[0];
            if (result) {
                try {
                    resumePage.innerHTML = `
                        <div class="d-flex gap-2 justify-content-center align-items-center flex-column my-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <div>Chargement...</div>
                        </div>`
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                    const urlencoded = new URLSearchParams();
                    urlencoded.append("request", result);

                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: urlencoded,
                        redirect: "follow"
                    };

                    const response = await fetch("http://localhost:3000/resume", requestOptions)
                        .then((response) => response.json())
                        .then((response) => {return response})
                        .catch((error) => console.error(error))

                    resumePage.innerHTML = response.request;
                } catch (err) {
                    console.log("Erreur:", err)
                    resumePage.innerHTML = "Une erreur est survenue.";
                }
            } else {
                resumePage.innerHTML = "Aucun résumé de possible.";
            }
        })
    })
})


const getDocumentText = () => {
    const documentText = document.body.innerText;
    return documentText ?? null;
}
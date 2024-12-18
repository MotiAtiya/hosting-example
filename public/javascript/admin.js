'use strict';

(function () {

    // Constants for HTML elements and SVG icons
    const AD_HEAD = '<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">';
    const AD_P1 = '<div class="col" data-id=';
    const AD_P2 = '><div class="card border-dark h-100"><h5 class="card-header fw-bold fs-4">';
    const AD_P3 = '</h5><div class="card-body">';
    const AD_P4 = '</div><div class="card-footer bg-transparent border"><button class="delete btn btn-danger">Delete</button>';
    const AD_P5 = '</div></div></div>';

    const PHONE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/></svg>';
    const EMAIL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/></svg>';

    const NO_ADS_FOUND = '<h2 class="mt-5 text-center p-2">No ads found</h2>';

    const BASE_URL = 'http://localhost:3000/api';

    const MODAL_ERR_SERVER_TITLE = 'Unexpected Error';
    const MODAL_ERR_SERVER_BODY = 'Apparently the connection to the server failed, please try again later.';

    /**
     * Executes when the DOM content is fully loaded.
     * Loads ads and sets up event listeners.
     */
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('search').addEventListener('click', presentation.loadAdsByTitle);
        presentation.loadAds();
    });

    /**
     * Namespace to manages presentation-related functionalities.
     * @namespace
     */
    const presentation = (() => {
        /**
         * Loads ads from the server and displays them.
         */
        function loadAds() {
            data.fetchApi({url: BASE_URL, method: 'GET'})
                .then(ads => {
                    showAds(ads);
                    listenToButtons();
                });
        }

        /**
         * Loads ads filtered by title from the server and displays them.
         * @param {Event} e - The event object.
         */
        function loadAdsByTitle(e) {
            e.preventDefault();
            const formData = new FormData(e.target.parentElement);
            const title = formData.get('titleSearch');

            data.fetchApi({url: `${BASE_URL}/${title}`, method: 'GET'})
                .then(ads => {
                    showAds(ads);
                    listenToButtons();
                });
        }

        /**
         * Attaches event listeners to buttons in the ad cards.
         */
        function listenToButtons() {
            document.querySelectorAll('.delete').forEach(button => button.addEventListener('click', presentation.deleteAd));
            document.querySelectorAll('.approve').forEach(button => button.addEventListener('click', presentation.approveAd));
        }

        /**
         * Displays ads received from the server.
         * @param {Array<object>} ads - The array of advertisement objects.
         */
        function showAds(ads) {
            if (!ads) return;
            if (ads.length === 0) {
                document.getElementById('ads').innerHTML = NO_ADS_FOUND;
                return;
            }
            let all_ads = AD_HEAD;
            ads.forEach(ad => {
                let ad_card = AD_P1 + `"${ad.id}"` + AD_P2 + `${ad.title}` + AD_P3 +
                    `<p> ${ad.description ? ad.description : '&nbsp;'} </p>` +
                    `<p class="fs-5 fw-semibold">${ad.price} &#8362;</p>` +
                    `<p>${PHONE_SVG} ${ad.phone}</p>` +
                    `<p>${EMAIL_SVG} ${ad.email}</p>` + AD_P4;
                if (!ad.approved) {
                    ad_card += '<button class="approve btn btn-success ms-2">Approve</button>';
                }
                ad_card += AD_P5;
                all_ads += ad_card;
            })
            document.getElementById('ads').innerHTML = all_ads + '</div>';
        }

        /**
         * Deletes an ad from the server and removes it from the UI.
         * @param {Event} e - The event object.
         */
        function deleteAd(e) {
            const id = e.target.parentElement.parentElement.parentElement.dataset.id;
            data.fetchApi({url: `${BASE_URL}/${id}`, method: 'DELETE'})
                .then(res => {
                    if (res) {
                        e.target.parentElement.parentElement.parentElement.remove();
                    }
                });ש
        }

        /**
         * Approves an ad on the server and updates its status in the UI.
         * @param {Event} e - The event object.
         */
        function approveAd(e) {
            const id = e.target.parentElement.parentElement.parentElement.dataset.id;
            data.fetchApi({url: `${BASE_URL}/${id}`, method: 'PUT'})
                .then(res => {
                    if (res) {
                        if (res.status === 222) { // if this Ad is deleted from database
                            e.target.parentElement.parentElement.parentElement.remove();
                            showDialogModel('Approve Ad failed', `the Ad (id - ${id}) has been deleted.`);
                            return;
                        }
                        e.target.remove();
                    }
                });
        }

        /**
         * Displays a modal dialog with the specified title and body content.
         * @param {string} head - The title of the modal dialog.
         * @param {string} body - The body content of the modal dialog.
         */
        function showDialogModel(head, body) {
            const modal = document.getElementById('modal');
            modal.firstElementChild.firstElementChild.firstElementChild.firstElementChild.innerHTML = head;
            modal.firstElementChild.firstElementChild.lastElementChild.innerHTML = body;
            const myModal = new bootstrap.Modal(modal);
            myModal.show();
        }

        return {
            loadAds,
            deleteAd,
            approveAd,
            loadAdsByTitle,
            showDialogModel
        }
    })();


    /**
     * Namespace to manages data-related functionalities.
     * @namespace
     */
    const data = (() => {
        /**
         * Fetches data from the server using the specified fetch details.
         * @param {object} fetchDetails - The details of the fetch request (e.g., URL, method).
         * @returns {Promise} - A promise that resolves with the fetched data or rejects with an error.
         */
        async function fetchApi(fetchDetails) {
            const gif = document.getElementById('loading');
            gif.classList.remove('d-none');
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1000 milliseconds = 1 second

            return fetch(fetchDetails.url, {method: fetchDetails.method})
                .then(response => {
                    if (!response.ok) {
                        return Promise.reject(new Error(response.statusText));
                    } else if (response.redirected) {
                        window.location.href = response.url; // Redirect to the redirected URL
                    } else {
                        return Promise.resolve(response);
                    }
                })
                .then(res => {
                    return res.json();
                })
                .catch((e) => {
                    presentation.showDialogModel(MODAL_ERR_SERVER_TITLE, MODAL_ERR_SERVER_BODY);
                })
                .finally(() => gif.classList.add('d-none'));
        }

        return {
            fetchApi,
        }

    })();

})();

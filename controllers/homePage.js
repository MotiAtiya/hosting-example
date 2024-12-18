'use strict';

const dbController = require('./dbAccess');
const DEF_MODAL_MSG = "<p>Your ad has been saved and will be published after admin approval.</p>";

/**
 * Displays the home page with approved Ads.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getHomePage = (req, res) => {
    handleAdsQueryPromise(dbController.getApprovedAds(), req, res);
};


/**
 * Displays the home page with Ads that contain a specific string in the title.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getHomePageByTitle = (req, res) => {
    handleAdsQueryPromise(dbController.getAdsByTitle(req.query.titleSearch, true), req, res);
};


/**
 * Handles the promise returned by database queries for ads.
 * @param {Promise} promise - The promise returned by database query.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function handleAdsQueryPromise (promise, req, res) {
    promise
        .then((data) => {
            renderHomePage(req, res, data);
        })
        .catch(err => {
            // res.status(500).send('Internal Server Error: ' + err);
            req.session.errorMsg = 'Internal Server Error: ' + err.message;
            res.redirect('/error');
        });
}


/**
 * Renders the home page with ads.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Array} ads - The ads to display on the home page.
 */
async function renderHomePage (req, res, ads) {
    const loggedIn = req.session.isLoggedIn ?? false;  // for navigation bar
    const { showModal, msg } = await handleModalMsg(req, res);

    res.render('index', {
        path: '',
        pageTitle: 'Approve Ads',
        ads: ads,
        loggedIn: loggedIn,
        showModal: showModal,
        modalTitle: "Ad successfully saved",
        modalBody: msg + DEF_MODAL_MSG,
        search: req.query.titleSearch,
    });
}


/**
 * Handles modal messages related to posting new ads.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} An object containing information about whether to show the modal and the message to display.
 */
async function handleModalMsg (req, res) {
    const showModal = req.cookies.postNewAd ?? false;
    let msg = '';
    const { firstAd, idOfPrevAdPosted } = req.cookies;
    res.clearCookie('postNewAd');
    res.clearCookie('idOfPrevAdPosted');

    // If modal should be shown, and it's not the first ad
    if (showModal && firstAd === 'false') {
        let status = 'not found due to a server error', user = req.session.mailOfLastAdPosted,
            updateDate = '', postDate = '';
        await dbController.getAdById(idOfPrevAdPosted)
            .then(ad => {
                if (ad) {
                    const { email, createdAt, updatedAt, approved } = ad;
                    user = email;
                    postDate = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()} `
                    postDate += `${createdAt.getHours()}:${createdAt.getMinutes() < 10 ? '0' : ''}${createdAt.getMinutes()}:${createdAt.getSeconds() < 10 ? '0' : ''}${createdAt.getSeconds()}`;
                    if (approved) {
                        updateDate = `${updatedAt.getDate()}/${updatedAt.getMonth() + 1}/${updatedAt.getFullYear()} `
                        updateDate += `${updatedAt.getHours()}:${updatedAt.getMinutes() < 10 ? '0' : ''}${updatedAt.getMinutes()}:${updatedAt.getSeconds() < 10 ? '0' : ''}${updatedAt.getSeconds()}`;
                    }
                    status = `posted on ${postDate}, and ${ approved ? `published on ${updateDate}` : 'not approved yet'}`;
                } else {
                    status = 'deleted by the manager';
                }
            })
            .catch(err => console.log(err)) //user don't need to see this, even if error happened.
        msg = `<p>Welcome back ${user}, your previous ad was ${status}.</p>`;
    }

    delete req.session.mailOfLastAdPosted;
    return {
        showModal, msg
    }
}

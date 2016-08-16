jQuery(document).ready(function($) {
	/**
	 * This interval checks for the presence of the tutorial 'Summary' button for 30 seconds, and clicks it when it comes up,
	 * to expand those details
	 */
	var showTutorialSummaryIntervalCount = 0;
	var showTutorialSummaryInterval = window.setInterval(function() {
		++showTutorialSummaryIntervalCount;
		if (showTutorialSummaryIntervalCount > 30) {
			clearInterval(showTutorialSummaryInterval);
		}
		var summaryContentContainer = $('#summary_content_container');
		if (summaryContentContainer.length > 0) {
			if (summaryContentContainer.find('a.fold_button').length > 0) {
				summaryContentContainer.find('a.fold_button').click();
				if (summaryContentContainer.find('.fold_content').css('display') == 'block') {
					clearInterval(showTutorialSummaryInterval);
				}
			}
		}
	}, 1000);

}(jQuery));
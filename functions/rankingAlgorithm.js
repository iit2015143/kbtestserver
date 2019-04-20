
// hot ranking algorithm
function hot(postTime, upvotes, downvotes) {
	const originTime = 1552280550410; 

	const timeDiff = Math.abs(postTime - originTime);
	const diff = upvotes - downvotes;

	if (diff > 0) {
		sign = 1;
	}
	if (diff == 0) {
		sign = 0;
	}
	if (diff < 0) {
		sign = -1;
	};

	const z = Math.max(Math.abs(diff), 1);

	const weight = sign * Math.log(z) / Math.log(10);

	const time_weight = 100;
	// the greater the value of time_weight, the more the pressure on the posts / reviews to perform by inreasing its diff exponentially.

	const weighted_timediff = timeDiff / time_weight; 

	const ranking_unrounded = weight + weighted_timediff;

	const ranking = ranking_unrounded.toFixed(7); // round the answer to 7 digits

	return ranking;
}

module.exports = hot;
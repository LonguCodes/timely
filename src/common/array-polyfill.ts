interface Array<T> {
	distinct(fn: (element: T) => any);
	group(fn: (element: T) => any);
}

Array.prototype.group = function groupBy<T>(fn: (element: T) => any) {
	return this.reduce((curr, next) => {
		const key = fn(next);
		if (!(key in curr)) curr[key] = [];
		curr[key].push(next);
		return curr;
	}, {});
};

Array.prototype.distinct = function distinctBy<T>(
	fn: (element: T) => any
) {
	const set = new Set();
	return this.filter((value) => {
		const key = fn(value);
		if (set.has(key)) return false;
		set.add(key);
		return true;
	});
};

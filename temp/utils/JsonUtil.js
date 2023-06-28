/**
 * 格式化json
 */
export function formatJson (str) {
	if (str) {
		if (typeof str === 'string') {
			try {
				return JSON.stringify(JSON.parse(str), null, 4);
			} catch (err) {
				return str;
			}
		} else {
			return str;
		}
	} else {
		return '';
	}
}

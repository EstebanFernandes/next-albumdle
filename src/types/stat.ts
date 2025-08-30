export interface Stat {
	artist:string;
	rank: string;
	date: string;
	genres: string;
	type: string;
	memberCount: string;
	location: string;
	label: string;
}



// Factory function with default empty values
export function createDefaultStat(): Stat {
	return {
        artist:"",
		rank: '',
		date: '',
		genres: '',
		type: '',
		memberCount: '',
		location: '',
		label: ''
	};
}

// Factory function with default empty values for main component
export function createDefaultMainStat(): Stat {
	return {
		artist: '?',
		rank: '?',
		date: '?',
		genres: '?',
		type: '?',
		memberCount: '?',
		location: '?',
		label: '?'
	};
}


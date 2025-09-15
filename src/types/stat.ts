export interface Stat {
	artist:string;
	rank: string;
	date: string;
	genres: string[];
	type: string;
	memberCount: string;
	location: string;
	label: string;
}
//Define the base word for a unknown stat
export const baseStat = "???"


// Factory function with default empty values
export function createDefaultStat(): Stat {
	return {
        artist:"",
		rank: '',
		date: '',
		genres: [],
		type: '',
		memberCount: '',
		location: '',
		label: ''
	};
}

// Factory function with default empty values for main component
export function createDefaultMainStat(): Stat {
	return {
		artist: baseStat,
		rank: baseStat,
		date: baseStat,
	  genres: [baseStat],
		type: baseStat,
 memberCount: baseStat,
	location: baseStat,
	   label: baseStat
	};
}


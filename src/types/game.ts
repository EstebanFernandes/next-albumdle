import { Album } from "./albums";

export interface AlbumOfTheDay {
id:string;
date: string;
album: Album;
imageHint:string|null;
try:number;
guess:number;
}
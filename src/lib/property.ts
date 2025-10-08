import { property } from "../types/albums";

export function getProperty(propertyName: string): property {
    switch (propertyName) {
        case "title":
            return {
                value: "",
                label: "title",
                description: "albumTitle"
            }
        case "rank":
            return {
                value: -1,
                label: "rank",
                description: "albumRank"
            }
        case "type":
            return {
                value: "",
                label: "type",
                description: "albumType"
            }
        case "memberCount":
            return {
                value: -1,
                label: "memberCount",
                description: "albumMemberCount"
            }
        case "country":
            return {
                value: "",
                label: "country",
                description: "albumCountry"
            }
        case "label":
            return {
                value: "",
                label: "label",
                description: "albumLabel"
            }
        case "smallThumbnail":
            return {
                value: "",
                label: "smallThumbnail",
                description: "albumSmallThumbnail"
            }
        case "largeThumbnail":
            return {
                value: "",
                label: "largeThumbnail",
                description: "albumLargeThumbnail"
            }
        case "genres":
            return {
                value: [],
                label: "genres",
                description: "albumGenres"
            }
        case "topSongs":
            return {
                value: [],
                label: "topSongs",
                description: "albumTopSongs"
            }
        case "artist":
            return {
                value: "",
                label: "artist",
                description: "albumArtist"
            }
        case "releaseDate":
            return {
                value: -1,
                label: "releaseDate",
                description: "albumreleaseDate"
            }
    }
    return {value:"",label:"",description:""}
}

export function getPropertiesFromHeader(header:string): property[]
{
    return header.split(",").map((head)=>getProperty(head))
}
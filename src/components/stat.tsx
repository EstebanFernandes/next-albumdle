import { Calendar, Disc, MapPinned, Medal, MicVocal, Users } from "lucide-react";
export interface StatProps {
    label: string;
    value: string;
}
export function Stat(stat: StatProps) {
    function chooseIcon(stat: StatProps) {
        switch (stat.label) {
            case "rank":
                return Medal;
            case "releaseDate":
                return Calendar;
            case "type":
                return MicVocal;
            case "memberCount":
                return Users;
            case "country":
                return MapPinned;
            case "label":
                return Disc;

        }

    }
    return (
        <span></span>
    );
}

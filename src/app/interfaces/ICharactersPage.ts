import { ICharacter } from "./ICharacter";

export interface ICharactersPage {
    info:    Info;
    results: ICharacter[];
}

export interface Info {
    count: number;
    pages: number;
    next:  string;
    prev:  null;
}

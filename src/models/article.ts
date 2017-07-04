export interface IArticleOpts {
    id: number;
    date: string;
    text: string;
    categories?: string[];
}

export class Article {
    id: number;
    text: string;
    categories: string[];
    date: Date;

    constructor(opts: IArticleOpts) {
        this.id = opts.id;
        this.text = opts.text;
        this.categories = opts.categories;
        this.date = new Date(opts.date);
    }

    get title(): string {
        return this.text.split('\n')[0].replace(/#+/, '').trim();
    }

    get body(): string {
        return this.text.split('\n').slice(1).join('\n').trim();
    }

    get description(): string {
        return this.text.split('\n').slice(1).join('').trim();
    }
}

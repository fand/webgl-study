import { Article, IArticleOpts } from './article';

interface IShaderArticleOpts extends IArticleOpts {
    fragment?: string;
    texture?: string;
    sound?: string;
}

export default class ShaderArticle extends Article {
    fragment: string;
    texture: string;
    sound: string;

    constructor(opts: IShaderArticleOpts) {
        opts.categories = (opts.categories || []).concat([
            'GLSL',
        ]);
        super(opts);
        this.fragment = opts.fragment;
        this.texture = opts.texture;
        this.sound = opts.sound;
    }
}

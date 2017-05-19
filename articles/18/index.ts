declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle(
    18,
    require('./README.md'),
    require('./index.frag')
);

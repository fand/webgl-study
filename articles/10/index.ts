declare function require(name: string);
import ShaderArticle from '../../src/models/shader-article';
export default new ShaderArticle(
    10,
    require('./README.md'),
    require('./index.frag')
);
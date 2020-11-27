import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
export declare class ArticleController {
    private readonly articleService;
    constructor(articleService: ArticleService);
    getAllArticle(): Promise<any>;
    getOneArticles(params: any): Promise<import("./interfaces/article.interface").Article>;
    createArticle(createArticleDto: CreateArticleDto): Promise<import("./interfaces/article.interface").Article>;
    updateWithAllParams(params: any, createArticleDto: CreateArticleDto): Promise<import("./interfaces/article.interface").Article>;
    deleteOneArticle(params: any): Promise<import("./interfaces/article.interface").Article>;
}

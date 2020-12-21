import { Model } from 'mongoose';
import { Article } from './interfaces/article.interface';
import { CreateArticleDto } from './dto/create-article.dto';
export declare class ArticleService {
    private readonly articleModel;
    constructor(articleModel: Model<Article>);
    createArticle(createArticleDto: CreateArticleDto): Promise<Article>;
    getAllArticles(): Promise<any>;
    getOneArticle(id: string): Promise<Article>;
    updateArticlePut(id: string, createArticleDto: CreateArticleDto): Promise<Article>;
    deleteArticle(id: string): Promise<Article>;
}

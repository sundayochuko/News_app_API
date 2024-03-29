const News = require('../models/news');
const Category = require('../models/category');
const response = require('../helpers/response');
const mongoose = require('mongoose');

class NewsContoller {
    static async getNews(req, res) {
        try {
            const count = req.params.count ? req.params.count : 0;

            const newsList = await News.find()
                .limit(+count)
                .populate({ path: 'category', model: 'Category' });

            if (!newsList) {
                res.status(500).send(
                    response('News list not available', {}, false)
                );
            }

            res.send(response('Featched news list successfully', newsList));
        } catch (err) {
            console.log(err);
        }
    }

    static async filterNewsByCategory(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                res.status(400).send(response('Invalid Category', {}, false));
            }

            const news = await News.find({ category: req.params.id });

            if (!news) {
                res.status(500).send(
                    response(
                        'News with the given category was not found',
                        {},
                        false
                    )
                );
            }

            res.status(200).send(response('Fetched news successfully', news));
        } catch (err) {
            console.log(err);
        }
    }

    static async searchNews(req, res) {
        const searchInput = req.query.title;

        const search = await News.find({
            title: { $regex: searchInput, $options: '$i' },
        });

        if (!search) {
            res.status(500).send(
                response('Search news not available', {}, false)
            );
        }
        res.send(response('Featched searched news list successfully', search));
    }

    static async getRecentNews(req, res) {
        const count = req.params.count ? req.params.count : 0;
        const news = await News.find()
            .sort({ datePosted: 'descending' })
            .limit(+count);

        if (!news) {
            return res.status(500).send(response('News not found', {}, false));
        }

        res.send(response('Fetched news successfully', news));
    }

    static async getNewsBySlug(req, res) {
        try {
            const news = await News.findOne({ slug: req.params.slug })
                .populate({ path: 'category', model: 'Category' })
                .populate({ path: 'autor', model: 'User' });
            if (!news) {
                res.status(500).send(
                    response('News with the given ID was not found', {}, false)
                );
            }

            res.status(200).send(response('Fetched news successfully', news));
        } catch (err) {
            console.log(err);
        }
    }

    static async getUsersNews(req, res) {
        try {
            const news = await News.find({ autor: req.params.id }).sort({
                dateOdered: -1,
            });

            if (!news) {
                res.status(500).send(
                    response(
                        'News with the given userID was not found',
                        {},
                        false
                    )
                );
            }

            res.status(200).send(
                response('Fetched user news successfully', news)
            );
        } catch (err) {
            console.log(err);
        }
    }

    static async createNews(req, res) {
        try {
            if (
                !mongoose.isValidObjectId(req.body.autor && req.body.category)
            ) {
                res.status(400).send(
                    response('invalid user id or category id', {}, false)
                );
            }

            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/`;
            let news = new News({
                title: req.body.title,
                autor: req.body.autor,
                body: req.body.body,
                image: `${basePath}${fileName}`,
                category: req.body.category,
            });
            news = await news.save();

            if (!news) {
                res.status(500).send(
                    response('The news can not be created ', {}, false)
                );
            }

            res.status(200).send(response('News created successfully', news));
        } catch (err) {
            console.log(err);
        }
    }

    static async updateNewsById(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                res.status(400).send(response('Invalid news id', {}, false));
            }

            const update = {
                ...req.body,
            };
            const filter = { _id: req.params.id };

            const news = await News.findOneAndUpdate(filter, update, {
                new: true,
            });

            if (!news)
                return res
                    .status(500)
                    .send(response('The news can not be updated', {}, false));

            res.send(response('News was updated successfully', news));
        } catch (err) {
            console.log(err.message);
        }
    }

    static async getTotalCountOfNews(req, res) {
        const newsCount = await News.countDocuments((count) => count);

        if (!newsCount) {
            return res
                .status(500)
                .send(response('News count unsuccessful', {}, false));
        }

        res.send(response('News count successful', newsCount));
    }

    static async updateNewsImageById(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                res.status(400).send(response('Invalid news id', {}, false));
            }

            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/`;
            const update = {
                image: `${basePath}${fileName}`,
            };
            const filter = { _id: req.params.id };

            const news = await News.findOneAndUpdate(filter, update, {
                new: true,
            });

            if (!news)
                return res
                    .status(500)
                    .send(response('The news can not be updated', {}, false));

            res.send(response('News was updated successfully', news));
        } catch (err) {
            console.log(err.message);
        }
    }

    static deleteNewsById(req, res) {
        News.findByIdAndDelete(req.params.id)
            .then((news) => {
                if (news) {
                    return res
                        .status(200)
                        .send(response('News was deleted successfully', {}));
                } else {
                    return res
                        .status(404)
                        .send(
                            response(
                                'News with the giving id was not found',
                                {},
                                false
                            )
                        );
                }
            })
            .catch((error) => {
                return res.status(400).send(response(error.message, {}, false));
            });
    }
}

module.exports = NewsContoller;
